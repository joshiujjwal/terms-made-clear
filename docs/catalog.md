# Prefilled starter catalog

`data/catalog.json` contains 30 well-known apps, websites, and developer projects
for initial editorial planning. It is a curated selection, not a measured
popularity ranking. The intended first review region is the United States;
that target does not establish the applicability of any service's policies.

This file supplies the runnable static catalog preview. Zod validates it at build
time, and all service details are exported for GitHub Pages. It is not a database
seed or policy import format. No database, importer, or policy publication
workflow exists yet. Published explanations still require cited, human-reviewed
evidence. See [ADR 0002](adr/0002-static-pages-preview.md).

## Editing the list

Each service has a unique lowercase hyphenated `slug`, display `name`, official
HTTPS `website`, `category`, `serviceType`, and separate terms/privacy
`reviewStatus` values. Add or replace entries in `services` to customize the list.
Keep both statuses `not_reviewed` in this planning file; future publication
status must come from reviewed database records, not a manually edited flag.

Categories are `social`, `messaging`, `streaming`, `shopping`, `payments`,
`productivity`, `ai`, and `developer`. Service types are `app`,
`app_and_website`, `website`, and `project`. These are editorial groupings, not
claims about every platform a service supports.

Homepage links identify candidates. Their live availability, redirects, and
regional destinations have not been checked. Policy URLs, applicable regions,
effective dates, retrieval dates, and review dates remain unrecorded. No policy
content was fetched, and no summaries, excerpts, findings, or safety scores are
included. `not_reviewed` means missing editorial coverage, not a missing policy
or an absence of concerns.

## Improvements to build next

1. Establish the runnable Next.js foundation and test harness before reader UI.
2. Add a separate, schema-validated service-only seed path that can prefill names
   and homepage links without creating policy versions or published reviews.
   Use stable slugs for idempotency; reject duplicates and malformed HTTPS URLs,
   and roll back failed imports. Record the seed design in an ADR first.
3. Show unreviewed services in the directory with explicit missing-coverage
   labels, never blank sections that could imply safety. Keep documented-concern
   filtering based only on published findings.
4. Maintain an editorial queue per service, policy kind, and actual region.
   Confirm official policy URLs and access/reuse conditions with approval before
   fetching; capture immutable versions and short, version-specific citations.
5. Require a named human reviewer, citation validation, and atomic publication
   before explanations become public. Add freshness reminders only to actual
   reviews, not to these starter entries.

For projects, distinguish the project website, downloadable software,
self-hosted installations, and hosted offerings during review. WordPress.org
does not stand in for WordPress.com; GitLab's hosted service does not stand in
for every self-managed instance. A software license is not automatically a
service's terms or privacy policy. Resolve these boundaries before creating
policy records, rather than sharing assumed findings across products.

## Update the deployed directory

1. Edit `data/catalog.json`, keeping the schema and unreviewed statuses intact.
2. Run `npm test`, `npm run lint`, `npm run format:check`, and
   `npm run typecheck`, then `npm run build && npm run test:e2e`.
3. Review the change and obtain human approval. Push the approved change to
   `main`; the checked Pages workflow will redeploy the export.

Duplicate slugs, names, or canonical homepage URLs, unexpected fields, unsafe
URLs, and published-status edits fail validation rather than being dropped.
Do not add policy findings to this file; the future evidence model is separate.

## Verification and remaining limits

Initial structural checks covered the 30 entries. The preview now has a Vitest
suite for validation and search plus Playwright tests against the static export,
including missing coverage, query errors, history, pagination, mobile keyboard
navigation, real 404 responses, and the no-JavaScript fallback.
No live-source verification or policy review is claimed. Full-product roadmap
phase gates and human editorial approval remain open.
