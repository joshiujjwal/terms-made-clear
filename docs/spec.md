# Terms Made Clear: Product Specification

## Overview

A searchable database explaining the terms and conditions and privacy policies
of popular apps and websites in plain language. Readers can identify meaningful
tradeoffs, inspect cited red flags, and follow links to the original policies.

Status: the full evidence-backed product is planned. A runnable static preview
now exposes 31 curated service identities with explicit unreviewed coverage.
No policy versions, summaries, citations, or findings are published.

## Approved static preview

The user approved a GitHub Pages deployment, documented in ADR 0002. This limited
release uses Next.js static export and build-time-validated JSON, not PostgreSQL
or a server. It includes browser-side literal name search, category filters,
20-item pagination, shareable validated parameters, generated service details,
methodology, and a GitHub Issues corrections channel.

United States is the initial review target, not confirmed policy applicability.
Unknown dates and policy coverage remain explicit. Concern filters and reviewed
explanations are deferred until actual evidence exists. Interactive filtering
requires JavaScript; all detail links remain available in a static fallback.
The architecture and transactional requirements below describe the future full
product, not capabilities of the Pages preview.

## Approved research and link-intake extension

ADR 0003 records the user-approved exception for five unpublished research drafts
(GitHub, YouTube, Instagram/Meta, ChatGPT, Amazon.com) and `/submit/`. Contributors
may suggest official policy URLs through a prefilled GitHub issue, requiring a
GitHub account. This is not user-submitted policy analysis.

A write-capable maintainer adds `policy-accepted` to a `policy-submission` issue
to trigger a validated, link-only draft PR. No submitted URL is fetched, no code
from the issue or PR runs, and no review is automatically approved or published.
Submitted records are isolated from the website's research dataset. Public
issues/PRs must contain no secrets, personal information, or full policies.

Research drafts require version-linked short citations, distinct policy
statements and interpretations, null editorial approval, and explicit source
access/reuse limitations. Missing checksums, dates, applicability, and failed
retrievals stay visible. The website may show source links and progress but must
not render unapproved explanation text or excerpts. Publication remains deferred.

## Approved local-PDF research extension

ADR 0004 adds Apple Developer as a distinct catalog service with unpublished
research from a user-supplied program agreement. Validated local-PDF provenance
records a byte checksum, document identifier, printed date, page count, and local
inspection day. A missing official source URL and original retrieval date stay
null; a printed date does not establish a universal effective date.

This adds no publication capability. The website shows only provenance, scope,
and progress; draft explanations and excerpts remain server-only, and the full
PDF is neither committed nor exported. The agreement is not evidence of Apple's
consumer terms or a standalone privacy policy. Regional attachments and missing
paid-distribution schedules remain explicit blockers.

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

| Entity                            | Fields and invariants                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Service                           | UUID, unique slug, name, official HTTPS website, category                                                                                                                |
| PolicyVersion                     | UUID, service ID, kind (`terms` or `privacy`), official HTTPS source URL, region, optional effective date, retrieved timestamp, content SHA-256, optional predecessor ID |
| Review                            | UUID, policy-version ID, status (`draft`, `published`, `superseded`), overview, reviewed timestamp, next-review date, methodology version                                |
| Citation                          | UUID, policy-version ID, section label, optional anchor, short verbatim excerpt                                                                                          |
| SummaryPoint                      | UUID, review ID, topic, plain-language explanation                                                                                                                       |
| Finding                           | UUID, review ID, topic, title, policy statement, practical impact, uncertainty note when applicable                                                                      |
| SummaryCitation / FindingCitation | Join tables; each citation must reference the same policy version as its review                                                                                          |

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

| Route                                 | Purpose                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| `/`                                   | Search entry point, product limitations, catalog link       |
| `/services?q=&category=&topic=&page=` | Search/filter catalog; page size 20                         |
| `/services/[slug]`                    | Separate reviewed terms and privacy sections with citations |
| `/methodology`                        | Topic definitions, evidence rules, versioning, staleness    |
| `/corrections`                        | Correction process and contact channel chosen before launch |

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

No published reviews is the default until real, cited, human-reviewed records
exist. The approved preview may list starter service identities with explicit
unreviewed labels; those identities are not policy evidence.
Use clearly synthetic fixtures in tests; do not fabricate real-service findings.
