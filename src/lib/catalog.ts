import { z } from "zod";

export const categoryLabels = {
  social: "Social",
  messaging: "Messaging",
  streaming: "Streaming",
  shopping: "Shopping",
  payments: "Payments",
  productivity: "Productivity",
  ai: "AI",
  developer: "Developer & projects",
} as const;

export const serviceTypeLabels = {
  app: "App",
  app_and_website: "App & website",
  website: "Website",
  project: "Project",
} as const;

const websiteSchema = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    Boolean(url.hostname) &&
    !url.username &&
    !url.password &&
    !url.search &&
    !url.hash &&
    !/\s/.test(value)
  );
}, "Website must be an HTTPS URL without credentials, query, or fragment.");

const serviceSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z
    .string()
    .min(1)
    .max(100)
    .refine((value) => value.trim() === value),
  website: websiteSchema,
  category: z.enum([
    "social",
    "messaging",
    "streaming",
    "shopping",
    "payments",
    "productivity",
    "ai",
    "developer",
  ]),
  serviceType: z.enum(["app", "app_and_website", "website", "project"]),
  reviewStatus: z.strictObject({
    terms: z.literal("not_reviewed"),
    privacy: z.literal("not_reviewed"),
  }),
});

const catalogSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    status: z.literal("editorial_starter"),
    targetReviewRegion: z.string().min(1),
    selectionBasis: z.string().min(1),
    services: z.array(serviceSchema).min(1),
  })
  .superRefine((catalog, context) => {
    for (const field of ["slug", "name", "website"] as const) {
      const seen = new Set<string>();
      for (const [index, service] of catalog.services.entries()) {
        const value =
          field === "website"
            ? new URL(service.website).href
            : service[field].toLowerCase();
        if (seen.has(value)) {
          context.addIssue({
            code: "custom",
            path: ["services", index, field],
            message: `Duplicate service ${field}.`,
          });
        }
        seen.add(value);
      }
    }
  });

export type Service = z.infer<typeof serviceSchema>;

export class CatalogInputError extends Error {}

export function parseCatalog(input: unknown) {
  return catalogSchema.parse(input);
}

export function searchCatalog(
  services: readonly Service[],
  parameters: URLSearchParams,
) {
  for (const key of parameters.keys()) {
    if (!["q", "category", "page"].includes(key)) {
      throw new CatalogInputError(`Unsupported search parameter: ${key}.`);
    }
    if (parameters.getAll(key).length !== 1) {
      throw new CatalogInputError(`Supply ${key} only once.`);
    }
  }
  const rawQuery = parameters.get("q") ?? "";
  if (rawQuery.length > 200) {
    throw new CatalogInputError("Search must be 200 characters or fewer.");
  }
  const query = rawQuery.trim().replace(/\s+/g, " ");
  const category = parameters.get("category") ?? "";
  if (category && !Object.hasOwn(categoryLabels, category)) {
    throw new CatalogInputError("Choose a valid category.");
  }
  const rawPage = parameters.get("page") ?? "1";
  if (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(Number(rawPage))) {
    throw new CatalogInputError("Page must be a positive whole number.");
  }
  const page = Number(rawPage);
  const matches = services
    .filter(
      (service) =>
        service.name.toLowerCase().includes(query.toLowerCase()) &&
        (!category || service.category === category),
    )
    .toSorted((first, second) => first.name.localeCompare(second.name, "en"));
  const totalPages = Math.max(1, Math.ceil(matches.length / 20));
  if (page > totalPages) {
    throw new CatalogInputError(
      `Page is out of range. There are ${totalPages} available pages.`,
    );
  }
  return {
    query,
    category,
    page,
    total: matches.length,
    totalPages,
    services: matches.slice((page - 1) * 20, page * 20),
  };
}
