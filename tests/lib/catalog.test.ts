import { describe, expect, it } from "vitest";
import { parseCatalog, searchCatalog } from "../../src/lib/catalog";

const service = {
  slug: "example-app",
  name: "Example App",
  website: "https://example.com/",
  category: "social",
  serviceType: "app_and_website",
  reviewStatus: { terms: "not_reviewed", privacy: "not_reviewed" },
};
const fixture = {
  schemaVersion: 1,
  status: "editorial_starter",
  targetReviewRegion: "United States",
  selectionBasis: "Synthetic test selection",
  services: [service],
};

describe("starter validation", () => {
  it("should preserve missing coverage when a starter service is valid", () => {
    expect(parseCatalog(fixture).services[0].reviewStatus).toEqual(
      service.reviewStatus,
    );
  });
  it.each([
    "javascript:alert(1)",
    "http://example.com",
    "https://user:pass@example.com",
    "https://example.com/?secret=value",
  ])("should reject unsafe URLs when a website is %s", (website) => {
    expect(() =>
      parseCatalog({ ...fixture, services: [{ ...service, website }] }),
    ).toThrow();
  });
  it("should reject duplicate slugs when two services share an identity", () => {
    expect(() =>
      parseCatalog({
        ...fixture,
        services: [
          service,
          { ...service, name: "Other", website: "https://example.org/" },
        ],
      }),
    ).toThrow();
  });
  it("should reject duplicate URLs when identities point to the same homepage", () => {
    expect(() =>
      parseCatalog({
        ...fixture,
        services: [service, { ...service, slug: "other", name: "Other" }],
      }),
    ).toThrow();
  });
  it("should reject policy claims when an unexpected field is supplied", () => {
    expect(() =>
      parseCatalog({
        ...fixture,
        services: [{ ...service, findings: ["Unsupported claim"] }],
      }),
    ).toThrow();
  });
  it("should reject publication when starter status is changed", () => {
    expect(() =>
      parseCatalog({
        ...fixture,
        services: [
          {
            ...service,
            reviewStatus: { terms: "published", privacy: "not_reviewed" },
          },
        ],
      }),
    ).toThrow();
  });
});

describe("catalog search", () => {
  const services = parseCatalog(fixture).services;
  it("should match literally and case insensitively when searching names", () => {
    expect(
      searchCatalog(services, new URLSearchParams("q=+eXaMpLe+")).services,
    ).toHaveLength(1);
    expect(
      searchCatalog(services, new URLSearchParams("q=%25")).services,
    ).toHaveLength(0);
  });
  it("should combine category and name when both filters are supplied", () => {
    expect(
      searchCatalog(services, new URLSearchParams("q=example&category=ai"))
        .total,
    ).toBe(0);
  });
  it.each([
    "q=" + "a".repeat(201),
    "page=0",
    "page=1.5",
    "page=2",
    "category=unknown",
    "q=one&q=two",
    "topic=tracking",
    "unexpected=value",
  ])(
    "should return explicit feedback when parameters are invalid: %s",
    (query) => {
      expect(() =>
        searchCatalog(services, new URLSearchParams(query)),
      ).toThrow();
    },
  );
  it("should paginate deterministically when more than 20 services match", () => {
    const many = Array.from({ length: 21 }, (_, index) => ({
      ...services[0],
      slug: `example-${index}`,
      name: `Example ${String(index).padStart(2, "0")}`,
    }));
    expect(searchCatalog(many, new URLSearchParams()).services).toHaveLength(
      20,
    );
    expect(
      searchCatalog(many, new URLSearchParams("page=2")).services[0].name,
    ).toBe("Example 20");
  });
});
