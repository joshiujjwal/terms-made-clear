import "server-only";
import source from "../../data/research.json";
import { catalog } from "./data";
import { parseResearch } from "./research";
import { validateSubmission } from "./policy-submission";

export const research = parseResearch(
  source,
  new Set(catalog.services.map((service) => service.slug)),
);
for (const record of research.records) {
  validateSubmission(
    {
      serviceSlug: record.serviceSlug,
      kind: record.kind,
      sourceUrl: record.sourceUrl,
      region: "Unknown",
    },
    catalog.services,
  );
}
