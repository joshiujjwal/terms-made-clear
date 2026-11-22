import { describe, expect, it } from "vitest";
import {
  buildSubmissionIssueUrl,
  parseSubmissionIssue,
  validateSubmission,
} from "../../src/lib/policy-submission";

const services = [
  { slug: "sample", name: "Example App", website: "https://example.com/" },
];
const input = {
  serviceSlug: "sample",
  kind: "terms",
  sourceUrl: "https://example.com/terms?lang=en",
  region: "United States",
};
const body = `### Service
sample

### Policy type
terms

### Policy URL
https://example.com/terms?lang=en

### Applicable region
United States

### Confirmation
- [X] I understand submissions are public and are not automatically reviewed or published.
`;

describe("policy link submissions", () => {
  it("should create a prefilled issue URL when the submission is valid", () => {
    const url = new URL(buildSubmissionIssueUrl(input, services));
    expect(url.origin).toBe("https://github.com");
    expect(url.searchParams.get("template")).toBe("policy-submission.yml");
    expect(url.searchParams.get("policy-url")).toBe(input.sourceUrl);
    expect(url.searchParams.get("service")).toBe("sample");
  });
  it.each([
    "javascript:alert(1)",
    "http://example.com/terms",
    "https://user:password@example.com/terms",
    "https://example.com:444/terms",
    "https://example.com/terms?token=secret",
    "https://localhost/terms",
    "https://127.0.0.1/terms",
    "https://example.com.evil.com/terms",
  ])("should reject unsafe sources when a URL is %s", (sourceUrl) =>
    expect(() =>
      validateSubmission({ ...input, sourceUrl }, services),
    ).toThrow(),
  );
  it("should reject unknown services when a submission is created", () => {
    expect(() =>
      validateSubmission({ ...input, serviceSlug: "../../bad" }, services),
    ).toThrow();
  });
  it("should parse the issue form when fields and consent are complete", () => {
    expect(parseSubmissionIssue(body, services)).toEqual(input);
  });
  it("should reject missing consent when the checkbox is unchecked", () => {
    expect(() =>
      parseSubmissionIssue(body.replace("[X]", "[ ]"), services),
    ).toThrow();
  });
  it("should reject duplicate fields when headings repeat", () => {
    expect(() =>
      parseSubmissionIssue(
        body + "\n### Policy URL\nhttps://example.com/other",
        services,
      ),
    ).toThrow();
  });
  it("should reject arbitrary text when a structured field has multiple lines", () => {
    expect(() =>
      parseSubmissionIssue(
        body.replace("sample\n", "sample\nmalicious input\n"),
        services,
      ),
    ).toThrow();
  });
  it("should preserve unknown applicability when the submitter cannot identify a region", () => {
    expect(
      validateSubmission({ ...input, region: "Unknown" }, services).region,
    ).toBe("Unknown");
  });
});
