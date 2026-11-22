import { readdir, readFile } from "node:fs/promises";
import { parseCatalog } from "../src/lib/catalog";
import { validateSubmissionRecord } from "../src/lib/policy-intake";

const catalog = parseCatalog(
  JSON.parse(await readFile("data/catalog.json", "utf8")),
);
for (const name of await readdir("data/submissions")) {
  if (name === ".gitkeep") continue;
  if (!/^issue-[1-9]\d*\.json$/.test(name))
    throw new Error(`Unexpected submission filename: ${name}`);
  const record = validateSubmissionRecord(
    JSON.parse(await readFile(`data/submissions/${name}`, "utf8")),
    catalog.services,
  );
  if (name !== `issue-${record.issueNumber}.json`)
    throw new Error("Submission filename does not match its provenance.");
}
console.log("Submission candidates validated; none are published reviews.");
