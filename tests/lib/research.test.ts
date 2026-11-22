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
const localVersion = {
  ...version,
  sourceUrl: null,
  retrievedAt: null,
  retrievalMethod: "local-pdf",
  fullResponseSha256: null,
  localDocument: {
    filename: "synthetic-agreement.pdf",
    title: "Synthetic Program Agreement",
    documentId: "SAMPLE001",
    documentDate: "2026-10-29",
    pageCount: 12,
    sha256: "b".repeat(64),
  },
};
const localRecord = {
  ...record,
  sourceUrl: null,
  policyVersion: localVersion,
};

describe("unpublished policy research", () => {
  it("should retain local provenance without inventing retrieval or effective dates when a PDF is supplied", () => {
    const parsed = parseResearch(
      { ...dataset, records: [localRecord] },
      new Set(["sample"]),
    ).records[0];
    expect(parsed.sourceUrl).toBeNull();
    expect(parsed.policyVersion).toMatchObject({
      effectiveDate: null,
      retrievedAt: null,
      fullResponseSha256: null,
      capturedOn: "2026-11-21",
      localDocument: { documentDate: "2026-10-29", sha256: "b".repeat(64) },
    });
    expect(parsed.editorialApproval).toBeNull();
  });
  it("should reject missing provenance when a local PDF draft has no document metadata", () => {
    const { localDocument, ...incompleteVersion } = localVersion;
    void localDocument;
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [{ ...localRecord, policyVersion: incompleteVersion }],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it.each([
    { filename: "../synthetic-agreement.pdf" },
    { sha256: "not-a-checksum" },
    { pageCount: 0 },
    { documentDate: "unknown" },
  ])(
    "should reject invalid local document metadata when it contains %j",
    (change) => {
      expect(() =>
        parseResearch(
          {
            ...dataset,
            records: [
              {
                ...localRecord,
                policyVersion: {
                  ...localVersion,
                  localDocument: { ...localVersion.localDocument, ...change },
                },
              },
            ],
          },
          new Set(["sample"]),
        ),
      ).toThrow();
    },
  );
  it.each([
    { fullResponseSha256: "c".repeat(64) },
    { retrievedAt: "2026-11-21T12:00:00Z" },
  ])(
    "should reject invented remote retrieval metadata when a local capture contains %j",
    (change) => {
      expect(() =>
        parseResearch(
          {
            ...dataset,
            records: [
              { ...localRecord, policyVersion: { ...localVersion, ...change } },
            ],
          },
          new Set(["sample"]),
        ),
      ).toThrow();
    },
  );
  it("should require a source URL when research is not a local PDF capture", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            {
              ...record,
              sourceUrl: null,
              policyVersion: { ...version, sourceUrl: null },
            },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject local metadata when an HTTP capture is claimed", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            {
              ...record,
              policyVersion: {
                ...version,
                localDocument: localVersion.localDocument,
              },
            },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
  it("should reject a missing source URL when a blocked record has no captured version", () => {
    expect(() =>
      parseResearch(
        {
          ...dataset,
          records: [
            {
              ...localRecord,
              status: "blocked",
              policyVersion: null,
              points: [],
            },
          ],
        },
        new Set(["sample"]),
      ),
    ).toThrow();
  });
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
