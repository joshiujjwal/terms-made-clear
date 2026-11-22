import { readFile } from "node:fs/promises";
import { z } from "zod";
import { parseCatalog } from "../src/lib/catalog";
import {
  GitHubApiError,
  runPolicyIntake,
  type IntakeApi,
} from "../src/lib/policy-intake";

const config = z
  .object({
    GITHUB_TOKEN: z.string().min(1),
    GITHUB_REPOSITORY: z.literal("joshiujjwal/terms-made-clear"),
    GITHUB_EVENT_PATH: z.string().min(1),
  })
  .parse(process.env);
const event: unknown = JSON.parse(
  await readFile(config.GITHUB_EVENT_PATH, "utf8"),
);
const catalog = parseCatalog(
  JSON.parse(await readFile("data/catalog.json", "utf8")),
);
const api: IntakeApi = {
  async request(method, path, body) {
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${config.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new GitHubApiError(response.status);
    return response.status === 204 ? null : response.json();
  },
};

async function feedback(message: string) {
  const number = z
    .object({ issue: z.object({ number: z.int().positive() }) })
    .parse(event).issue.number;
  const path = `/repos/${config.GITHUB_REPOSITORY}/issues/${number}/comments`;
  const marker = "<!-- policy-intake-feedback -->";
  for (let page = 1; page <= 10; page++) {
    const comments = z
      .array(
        z.object({ body: z.string(), user: z.object({ login: z.string() }) }),
      )
      .parse(await api.request("GET", `${path}?per_page=100&page=${page}`));
    if (
      comments.some(
        (comment) =>
          comment.user.login === "github-actions[bot]" &&
          comment.body === `${marker}\n${message}`,
      )
    )
      return;
    if (comments.length < 100) {
      await api.request("POST", path, { body: `${marker}\n${message}` });
      return;
    }
  }
  throw new Error(
    "Too many comments to safely deduplicate intake feedback; maintainer action is required.",
  );
}

try {
  const result = await runPolicyIntake(
    event,
    config.GITHUB_REPOSITORY,
    catalog.services,
    api,
  );
  await feedback(
    `${result.reused ? "An existing" : "A new"} source-candidate PR is available: #${result.number}. It remains unverified and requires human review. No submitted URL was fetched.`,
  );
  console.log(
    `Source candidate PR: #${result.number}${result.reused ? " (existing)" : " (draft)"}.`,
  );
} catch (error) {
  const detail =
    error instanceof z.ZodError
      ? error.issues.map((issue) => issue.message).join(" ")
      : error instanceof Error
        ? error.message
        : "Unexpected intake failure.";
  try {
    await feedback(
      `Policy intake failed: ${detail}\n\nCorrect the issue fields or repository configuration, then remove and re-add policy-accepted. If a policy-source-issue branch already exists, inspect it manually: the bot will not overwrite reviewer changes or delete an ambiguous API write. No review has been published.`,
    );
  } catch {
    console.error(
      "Could not post intake failure feedback. Check repository permissions and the GitHub API.",
    );
  }
  console.error(
    "Policy intake failed. See the issue feedback; no review was published.",
  );
  process.exitCode = 1;
}
