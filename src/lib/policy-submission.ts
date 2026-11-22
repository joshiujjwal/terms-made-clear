import { z } from "zod";
import { policyUrlSchema } from "./policy-urls";

export type SubmissionService = { slug: string; name: string; website: string };

const additionalHosts: Record<string, readonly string[]> = {
  github: ["docs.github.com"],
  youtube: ["policies.google.com", "support.google.com"],
  instagram: [
    "help.instagram.com",
    "privacycenter.instagram.com",
    "privacycenter.meta.com",
    "facebook.com",
    "www.facebook.com",
  ],
  chatgpt: ["openai.com", "www.openai.com"],
};

export const submissionSchema = z.strictObject({
  serviceSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["terms", "privacy"]),
  sourceUrl: policyUrlSchema,
  region: z.enum(["United States", "Unknown"]),
});
export type PolicySubmission = z.infer<typeof submissionSchema>;

export function validateSubmission(
  input: unknown,
  services: readonly SubmissionService[],
) {
  return submissionSchema
    .superRefine((submission, context) => {
      const service = services.find(
        (candidate) => candidate.slug === submission.serviceSlug,
      );
      if (!service) {
        context.addIssue({
          code: "custom",
          message: "Choose an existing catalog service.",
        });
        return;
      }
      const root = new URL(service.website).hostname.replace(/^www\./, "");
      const hosts = [
        root,
        `www.${root}`,
        ...(additionalHosts[service.slug] ?? []),
      ];
      if (!hosts.includes(new URL(submission.sourceUrl).hostname)) {
        context.addIssue({
          code: "custom",
          message: `Policy host must be one of: ${hosts.join(", ")}. Contact a maintainer if an official host is missing.`,
        });
      }
    })
    .parse(input);
}

export function buildSubmissionIssueUrl(
  input: unknown,
  services: readonly SubmissionService[],
) {
  const submission = validateSubmission(input, services);
  const url = new URL(
    "https://github.com/joshiujjwal/terms-made-clear/issues/new",
  );
  url.searchParams.set("template", "policy-submission.yml");
  url.searchParams.set(
    "title",
    `Policy source: ${submission.serviceSlug} (${submission.kind})`,
  );
  url.searchParams.set("service", submission.serviceSlug);
  url.searchParams.set("kind", submission.kind);
  url.searchParams.set("policy-url", submission.sourceUrl);
  url.searchParams.set("region", submission.region);
  return url.href;
}

export function parseSubmissionIssue(
  body: string,
  services: readonly SubmissionService[],
) {
  if (body.length > 8000) throw new Error("The submission body is too long.");
  const sections = new Map<string, string>();
  const parts = body.replace(/\r\n/g, "\n").split(/^### /m);
  if (parts[0].trim()) throw new Error("Use the policy submission issue form.");
  for (const part of parts.slice(1)) {
    const split = part.indexOf("\n");
    if (split === -1) throw new Error("A submission field has no value.");
    const label = part.slice(0, split).trim();
    const value = part.slice(split + 1).trim();
    if (sections.has(label))
      throw new Error("A submission field appears more than once.");
    sections.set(label, value);
  }
  const labels = [
    "Service",
    "Policy type",
    "Policy URL",
    "Applicable region",
    "Confirmation",
  ];
  if (
    sections.size !== labels.length ||
    labels.some((label) => !sections.has(label))
  ) {
    throw new Error("Complete all fields in the policy submission issue form.");
  }
  if (
    !/^- \[[xX]\] I understand submissions are public and are not automatically reviewed or published\.$/.test(
      sections.get("Confirmation") ?? "",
    )
  ) {
    throw new Error("Confirm that the submission is public and unpublished.");
  }
  for (const label of labels.slice(0, 4)) {
    if (sections.get(label)?.includes("\n"))
      throw new Error(`Supply one value for ${label}.`);
  }
  return validateSubmission(
    {
      serviceSlug: sections.get("Service"),
      kind: sections.get("Policy type"),
      sourceUrl: sections.get("Policy URL"),
      region: sections.get("Applicable region"),
    },
    services,
  );
}
