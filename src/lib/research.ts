import { z } from "zod";
import { policyUrlSchema } from "./policy-urls";

const citationSchema = z.strictObject({
  policyVersionId: z.uuid(),
  section: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(800),
  anchor: z.string().max(200).nullable(),
});

const versionSchema = z
  .strictObject({
    id: z.uuid(),
    sourceUrl: policyUrlSchema,
    effectiveDate: z.iso.date().nullable(),
    region: z.string().min(1).max(200).nullable(),
    scopeNote: z.string().min(1).max(1500),
    retrievedAt: z.iso.datetime().nullable(),
    capturedOn: z.iso.date(),
    retrievalMethod: z.enum(["http-html", "browser-text", "document-excerpt"]),
    fullResponseSha256: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .nullable(),
  })
  .superRefine((version, context) => {
    if (
      version.retrievalMethod !== "document-excerpt" &&
      (!version.fullResponseSha256 || !version.retrievedAt)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "Complete captures need a checksum and actual retrieval timestamp.",
      });
    }
    if (
      version.retrievalMethod === "document-excerpt" &&
      version.fullResponseSha256 !== null
    ) {
      context.addIssue({
        code: "custom",
        message: "Excerpt-only captures cannot claim a full-response checksum.",
      });
    }
  });

const recordSchema = z
  .strictObject({
    serviceSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    kind: z.enum(["terms", "privacy"]),
    status: z.enum(["draft", "blocked"]),
    targetRegion: z.string().min(1).max(200),
    sourceUrl: policyUrlSchema,
    attemptedAt: z.iso.datetime(),
    accessNote: z.string().min(1).max(1500),
    reuseNote: z.string().min(1).max(1500),
    policyVersion: versionSchema.nullable(),
    editorialApproval: z.null(),
    points: z
      .array(
        z.strictObject({
          topic: z.enum([
            "data-collection",
            "content-licenses",
            "account-control",
            "model-training",
            "advertising",
            "account-termination",
          ]),
          policyStatement: z.string().min(1).max(1000),
          explanation: z.string().min(1).max(1000),
          uncertainty: z.string().min(1).max(1000),
          citations: z.array(citationSchema).min(1),
        }),
      )
      .max(10),
  })
  .superRefine((record, context) => {
    if (record.status === "blocked") {
      if (record.policyVersion !== null || record.points.length) {
        context.addIssue({
          code: "custom",
          message:
            "Blocked sources cannot contain captured versions or policy claims.",
        });
      }
      return;
    }
    if (!record.policyVersion || !record.points.length) {
      context.addIssue({
        code: "custom",
        message: "Draft research requires a captured version and cited points.",
      });
      return;
    }
    if (record.sourceUrl !== record.policyVersion.sourceUrl) {
      context.addIssue({
        code: "custom",
        message: "Research and policy-version source URLs must match.",
      });
    }
    let quotedWords = 0;
    for (const point of record.points) {
      for (const citation of point.citations) {
        quotedWords += citation.excerpt.trim().split(/\s+/).length;
        if (citation.policyVersionId !== record.policyVersion.id) {
          context.addIssue({
            code: "custom",
            message: "A citation must reference its own policy version.",
          });
        }
      }
    }
    if (quotedWords > 90) {
      context.addIssue({
        code: "custom",
        message:
          "Keep excerpts to at most 90 quoted words per captured policy.",
      });
    }
  });

export type ResearchRecord = z.infer<typeof recordSchema>;

export function parseResearch(
  input: unknown,
  serviceSlugs: ReadonlySet<string>,
) {
  return z
    .strictObject({
      schemaVersion: z.literal(1),
      records: z.array(recordSchema),
    })
    .superRefine((data, context) => {
      const pairs = new Set<string>();
      const versions = new Set<string>();
      for (const record of data.records) {
        const pair = `${record.serviceSlug}:${record.kind}`;
        if (!serviceSlugs.has(record.serviceSlug) || pairs.has(pair)) {
          context.addIssue({
            code: "custom",
            message: "Unknown service or duplicate service/policy pair.",
          });
        }
        pairs.add(pair);
        if (record.policyVersion) {
          if (versions.has(record.policyVersion.id)) {
            context.addIssue({
              code: "custom",
              message: "Policy-version IDs must be unique.",
            });
          }
          versions.add(record.policyVersion.id);
        }
      }
    })
    .parse(input);
}
