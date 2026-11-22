import { describe, expect, it } from "vitest";
import { parseResearch } from "../../src/lib/research";

const policyVersionId = "11111111-1111-4111-8111-111111111111";
const version = {
  id: policyVersionId,
  sourceUrl: "https://example.com/privacy",
  effectiveDate: null,
  region: null,
  scopeNote: "Synthetic scope; applicability unknown.",
  retrievedAt: "2026-11-21T12:00:00Z",
  capturedOn: "2026-11-21",
  retrievalMethod: "http-html",
  fullResponseSha256: "a".repeat(64),
};
const record = {
  serviceSlug: "sample",
  kind: "privacy",
  status: "draft",
  targetRegion: "United States",
  sourceUrl: version.sourceUrl,
  attemptedAt: version.retrievedAt,
  accessNote: "Synthetic source",
  reuseNote: "Short quotation; requires editorial verification.",
  policyVersion: version,
  editorialApproval: null,
  points: [
    {
      topic: "data-collection",
      policyStatement: "The sample policy describes collection.",
      explanation: "Synthetic interpretation, not a real-service claim.",
      uncertainty: "Other clauses have not been assessed.",
      citations: [
        {
          policyVersionId,
          section: "Collection",
          excerpt: "A short synthetic excerpt.",
          anchor: null,
        },
      ],
    },
  ],
};
const dataset = { schemaVersion: 1, records: [record] };

describe("unpublished policy research", () => {
  it("should preserve unknown dates and scope when a draft is valid", () => {
    const parsed = parseResearch(dataset, new Set(["sample"]));
    expect(parsed.records[0].policyVersion?.effectiveDate).toBeNull();
    expect(parsed.records[0].policyVersion?.region).toBeNull();
  });
  it("should reject publication when a draft is marked published", () => {
    expect(() =>
      parseResearch(
        { ...dataset, records: [{ ...record, status: "published" }] },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject fabricated approval when approval is not null", () => {
    expect(() =>
      parseResearch(
        { ...dataset, records: [{ ...record, editorialApproval: "approved" }] },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject uncited explanations when a point has no evidence", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            { ...record, points: [{ ...record.points[0], citations: [] }] },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject cross-version citations when IDs do not match", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            {
              ...record,
              points: [
                {
                  ...record.points[0],
                  citations: [
                    {
                      ...record.points[0].citations[0],
                      policyVersionId: "22222222-2222-4222-8222-222222222222",
                    },
                  ],
                },
              ],
            },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject duplicates when a service/policy pair appears twice", () => {
    expect(() =>
      parseResearch(
        { ...dataset, records: [record, record] },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject unknown services when importing research", () => {
    expect(() => parseResearch(dataset, new Set(["different"]))).toThrow();
  });
  it("should retain source blockers when a page could not be read", () => {
    const blocked = {
      ...record,
      status: "blocked",
      policyVersion: null,
      points: [],
      accessNote: "HTTP 503; no content assessed.",
    };
    expect(
      parseResearch({ ...dataset, records: [blocked] }, new Set(["sample"]))
        .records[0].status,
    ).toBe("blocked");
  });
  it("should reject claims when a blocked record contains an explanation", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [{ ...record, status: "blocked", policyVersion: null }],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject a missing checksum when a full HTML capture is claimed", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            {
              ...record,
              policyVersion: { ...version, fullResponseSha256: null },
            },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
});
