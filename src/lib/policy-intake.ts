import { z } from "zod";
import {
  parseSubmissionIssue,
  submissionSchema,
  validateSubmission,
  type SubmissionService,
} from "./policy-submission";

export class GitHubApiError extends Error {
  constructor(public readonly status: number) {
    super(`GitHub API request failed (HTTP ${status}).`);
  }
}

export type IntakeApi = {
  request(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
  ): Promise<unknown>;
};

export const submissionRecordSchema = submissionSchema.extend({
  schemaVersion: z.literal(1),
  issueNumber: z.int().positive(),
  issueUrl: z
    .url()
    .refine((value) =>
      /^https:\/\/github\.com\/joshiujjwal\/terms-made-clear\/issues\/[1-9]\d*$/.test(
        value,
      ),
    ),
  submittedAt: z.iso.datetime(),
  status: z.literal("unverified"),
  editorialApproval: z.null(),
});

export function validateSubmissionRecord(
  input: unknown,
  services: readonly SubmissionService[],
) {
  const record = submissionRecordSchema.parse(input);
  validateSubmission(
    {
      serviceSlug: record.serviceSlug,
      kind: record.kind,
      sourceUrl: record.sourceUrl,
      region: record.region,
    },
    services,
  );
  if (!record.issueUrl.endsWith(`/issues/${record.issueNumber}`))
    throw new Error("Submission provenance does not match its issue number.");
  return record;
}

const prSchema = z.object({ number: z.int().positive(), html_url: z.url() });

async function optionalGet(api: IntakeApi, path: string) {
  try {
    return await api.request("GET", path);
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 404) return null;
    throw error;
  }
}

export async function runPolicyIntake(
  input: unknown,
  repository: string,
  services: readonly SubmissionService[],
  api: IntakeApi,
) {
  if (repository !== "joshiujjwal/terms-made-clear")
    throw new Error("Intake is configured for the canonical repository only.");
  const event = z
    .object({
      action: z.literal("labeled"),
      label: z.object({ name: z.literal("policy-accepted") }),
      sender: z.object({ login: z.string().regex(/^[a-zA-Z0-9-]{1,39}$/) }),
      issue: z.object({
        number: z.int().positive(),
        body: z.string().max(8000),
        pull_request: z.unknown().optional(),
      }),
    })
    .parse(input);
  if (event.issue.pull_request !== undefined)
    throw new Error("Policy intake accepts issues, not pull requests.");
  const root = `/repos/${repository}`;
  const permission = z
    .object({ permission: z.string() })
    .parse(
      await api.request(
        "GET",
        `${root}/collaborators/${event.sender.login}/permission`,
      ),
    ).permission;
  if (!["write", "maintain", "admin"].includes(permission)) {
    throw new Error(
      "Only a maintainer with write, maintain, or admin permission may accept a policy source.",
    );
  }
  const number = event.issue.number;
  const issue = z
    .object({
      state: z.literal("open"),
      body: z.string(),
      created_at: z.iso.datetime(),
      labels: z.array(z.object({ name: z.string() })),
      pull_request: z.unknown().optional(),
    })
    .parse(await api.request("GET", `${root}/issues/${number}`));
  if (
    issue.pull_request !== undefined ||
    !["policy-submission", "policy-accepted"].every((name) =>
      issue.labels.some((label) => label.name === name),
    )
  ) {
    throw new Error(
      "The open issue must have both policy-submission and policy-accepted labels.",
    );
  }
  const submission = parseSubmissionIssue(issue.body, services);
  if (issue.body !== event.issue.body) {
    throw new Error(
      "The issue body changed after acceptance. Review the new link and reapply policy-accepted.",
    );
  }
  const candidate = validateSubmissionRecord(
    {
      ...submission,
      schemaVersion: 1,
      issueNumber: number,
      issueUrl: `https://github.com/${repository}/issues/${number}`,
      submittedAt: issue.created_at,
      status: "unverified",
      editorialApproval: null,
    },
    services,
  );
  const branch = `policy-source-issue-${number}`;
  const prs = z
    .array(prSchema)
    .parse(
      await api.request(
        "GET",
        `${root}/pulls?state=all&head=${encodeURIComponent(`${repository.split("/")[0]}:${branch}`)}&per_page=100`,
      ),
    );
  if (prs.length)
    return { number: prs[0].number, url: prs[0].html_url, reused: true };

  const base = z
    .object({ default_branch: z.string().min(1) })
    .parse(await api.request("GET", root)).default_branch;
  const existingBranch = await optionalGet(
    api,
    `${root}/git/ref/heads/${branch}`,
  );
  const path = `${root}/contents/data/submissions/issue-${number}.json`;
  const createdBranch = existingBranch === null;
  if (!existingBranch) {
    const sha = z
      .object({ object: z.object({ sha: z.string().regex(/^[a-f0-9]{40}$/) }) })
      .parse(
        await api.request(
          "GET",
          `${root}/git/ref/heads/${encodeURIComponent(base)}`,
        ),
      ).object.sha;
    await api.request("POST", `${root}/git/refs`, {
      ref: `refs/heads/${branch}`,
      sha,
    });
  }
  const existingFile = createdBranch
    ? null
    : await optionalGet(api, `${path}?ref=${branch}`);
  if (existingFile) {
    const file = z
      .object({ content: z.string(), encoding: z.literal("base64") })
      .parse(existingFile);
    const saved = validateSubmissionRecord(
      JSON.parse(Buffer.from(file.content, "base64").toString("utf8")),
      services,
    );
    if (JSON.stringify(saved) !== JSON.stringify(candidate)) {
      throw new Error(
        "The existing candidate has changed. Review the branch manually; it will not be overwritten.",
      );
    }
  } else {
    if (!createdBranch)
      throw new Error(
        "An existing branch has no candidate file. Review it manually; it will not be overwritten.",
      );
    await api.request("PUT", path, {
      message: `Add unverified policy source from issue #${number}`,
      branch,
      content: Buffer.from(`${JSON.stringify(candidate, null, 2)}\n`).toString(
        "base64",
      ),
    });
  }
  const pr = prSchema.parse(
    await api.request("POST", `${root}/pulls`, {
      title: `Policy source: ${submission.serviceSlug} (${submission.kind})`,
      head: branch,
      base,
      draft: true,
      body: `Source suggestion from #${number}.\n\nThis draft contains one **unverified policy URL**, not a review. No submitted URL was fetched and no explanation was generated. Acceptance of the link is not editorial approval.\n\nMaintainer checklist:\n- Inspect the complete diff and verify the official source, region, and policy kind.\n- Run \`npm test\`, \`npm run lint\`, \`npm run format:check\`, \`npm run typecheck\`, and \`npm run build\` before merging.\n- Prepare version-specific evidence and obtain human editorial approval separately; do not publish this candidate as a review.\n\nGitHub-token-created PRs do not trigger other workflows. Do not auto-merge. This PR does not close the source issue.`,
    }),
  );
  return { number: pr.number, url: pr.html_url, reused: false };
}
