# Terms Made Clear: Product Specification

## Overview

A searchable database explaining the terms and conditions and privacy policies
of popular apps and websites in plain language. Readers can identify meaningful
tradeoffs, inspect cited red flags, and follow links to the original policies.

Status: specification only. No application, dependencies, or dataset exists yet.

## Problem

Legal policies are long, change over time, and obscure how a service uses data
or limits users' rights. Readers need short, accurate explanations, not an
unsupported score or a claim that a service is safe.

## First-version scope

- [ ] Browse a curated catalog of apps and websites.
- [ ] Search service names and filter by category and documented concern topic.
- [ ] View separate terms-of-service and privacy-policy summaries per service.
- [ ] Show a short overview and topic-based explanations in everyday language.
- [ ] Explain red flags, their practical impact, and the supporting source.
- [ ] Display the applicable region, source URL, policy effective date when
  stated, retrieval date, and editorial review date.
- [ ] Link findings to their exact policy version and a short supporting excerpt.
- [ ] Mark missing documents, ambiguous clauses, and outdated reviews explicitly.
- [ ] Publish methodology and a process for reporting factual corrections.

Out of scope: user-submitted text or URL analysis, browser extensions, accounts,
personalized legal advice, automated legal conclusions, numerical trust scores,
and large-scale policy crawling.

## Reader experience

1. A visitor searches for a service without creating an account.
2. Results identify services with both, one, or neither reviewed policy type.
3. A service page separates its overview, policy summaries, and concerns.
4. Each concern explains what the clause says and what it could mean in practice.
5. A citation opens the official policy URL and identifies the reviewed version.
6. If a review is stale or incomplete, a visible notice explains the limitation.

No findings means "no documented findings in this review," not "no risks."

## Editorial requirements

- [ ] Every published summary point and finding has at least one source citation.
- [ ] Use precise claims: distinguish sale, sharing, collection, and retention.
- [ ] Separate what the policy says from the editor's interpretation.
- [ ] Use short sentences, familiar words, and definitions for unavoidable jargon.
- [ ] Preserve qualifications, exceptions, region limits, and opt-out conditions.
- [ ] Label uncertainty instead of inventing missing details.
- [ ] Use topic labels rather than an overall service score.
- [ ] Require human review before publishing or updating a summary.
- [ ] Display "Informational summaries, not legal advice" on policy pages.
- [ ] Never imply that a flag proves illegality or wrongdoing.

Concern topics include advertising/data sharing, tracking, data retention,
account deletion, content licenses, cancellation/renewal, dispute resolution,
unilateral changes, and account termination. Publish findings only when relevant
clauses support them; do not generate flags from a checklist alone.

## Data model

| Entity | Fields and invariants |
| --- | --- |
| Service | UUID, unique slug, name, official HTTPS website, category |
| PolicyVersion | UUID, service ID, kind (`terms` or `privacy`), official HTTPS source URL, region, optional effective date, retrieved timestamp, content SHA-256, optional predecessor ID |
| Review | UUID, policy-version ID, status (`draft`, `published`, `superseded`), overview, reviewed timestamp, next-review date, methodology version |
| Citation | UUID, policy-version ID, section label, optional anchor, short verbatim excerpt |
| SummaryPoint | UUID, review ID, topic, plain-language explanation |
| Finding | UUID, review ID, topic, title, policy statement, practical impact, uncertainty note when applicable |
| SummaryCitation / FindingCitation | Join tables; each citation must reference the same policy version as its review |

Store dates/timestamps in PostgreSQL using explicit UTC timestamps where
appropriate. Effective dates may be unknown; do not replace them with retrieval
dates. Policy versions are immutable once cited by a published review.
Publishing a replacement review supersedes the prior review atomically.
Readers see at most one current published review per policy kind and region;
enforce that invariant in the publication transaction.

Staleness means the current UTC time has reached the stored next-review date.
The date is selected during editorial review and remains visible to readers.
It is a review reminder, not proof the official policy changed.

## Interface and architecture

Stack: Next.js App Router, strict TypeScript, Tailwind CSS, PostgreSQL.
Use server-rendered catalog/detail pages and parameterized database queries.
Database driver, migration tooling, and package versions are chosen in Phase 0
and recorded in an ADR before dependent implementation.

| Route | Purpose |
| --- | --- |
| `/` | Search entry point, product limitations, catalog link |
| `/services?q=&category=&topic=&page=` | Search/filter catalog; page size 20 |
| `/services/[slug]` | Separate reviewed terms and privacy sections with citations |
| `/methodology` | Topic definitions, evidence rules, versioning, staleness |
| `/corrections` | Correction process and contact channel chosen before launch |

No public JSON API or admin UI is required for the first version. Use a
maintainer-operated, schema-validated import command for curated records.
Validate citation completeness and cross-version references before publication;
failed imports must leave existing published data unchanged.

Normalize and length-limit search text to 200 characters. Reject malformed
pagination/category/topic inputs with clear feedback, not silent fallback.
Use case-insensitive name search; escape wildcard characters if using `ILIKE`.
Preserve search filters when navigating pages.

## Non-functional requirements

- [ ] Read-only public access; no user accounts or advertising trackers.
- [ ] Responsive pages with keyboard navigation, visible focus, and semantic HTML.
- [ ] Target WCAG 2.2 AA; verify search, filters, and source links manually.
- [ ] Render imported content as text; do not inject policy HTML.
- [ ] Validate external links; disallow executable URL schemes.
- [ ] Keep database credentials server-only; commit no secrets.
- [ ] Show useful not-found, empty-results, and database-error states.
- [ ] Log operational errors server-side without exposing credentials or user input.
- [ ] Use bounded pagination and indexed service lookup.
- [ ] Publish only short necessary excerpts plus original analysis; check source
  access/reuse restrictions before importing any real policies.

## Test plan

Use red/green TDD. Choose tooling in Phase 0; prefer integration tests for routes
and database behavior, plus browser tests for core reader flows.

- Catalog: mixed-case search, categories/topics, pagination, empty results,
  special characters, overlong queries, and invalid parameters.
- Detail: existing/missing service, separate policy kinds, region differences,
  unknown dates, absent reviews, and stale notices at the UTC date boundary.
- Evidence: reject uncited points/findings, mismatched citation versions,
  invalid source URLs, and incomplete publication records.
- Import: idempotent reimport by content hash, transaction rollback, immutable
  published versions, and replacement-review publication.
- Presentation: accessible labels, keyboard navigation, escaped policy text,
  visible limitations, and working original-source links.
- Errors: unavailable database, invalid imports, and missing configuration
  produce explicit failures without leaking secrets.

## Decisions needed before implementation

- Initial service list, categories, and supported jurisdiction/region.
- Who performs editorial review, and how the first records will be sourced.
- Per-review next-review-date guidance and policy-change monitoring workflow.
- ORM/driver, migrations, test tools, hosting, and database provider.
- Public corrections contact channel and expected response process.

The empty catalog is the default until real, cited, human-reviewed records exist.
Use clearly synthetic fixtures in tests; do not fabricate real-service findings.
