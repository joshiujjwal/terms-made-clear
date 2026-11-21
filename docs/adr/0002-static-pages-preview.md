# ADR 0002: Static catalog preview on GitHub Pages

- Status: accepted for the catalog preview; approved by the user
- Date: 2026-11-21

## Context

The user requested a runnable catalog and GitHub Pages deployment. Pages hosts
static files, not a Next.js server or PostgreSQL. The initial 30-service dataset
contains identities only; it cannot substantiate policy explanations.

## Options

- Deploy the full server/database product elsewhere: fits the original design
  but does not meet the requested hosting target.
- Replace the stack with a custom static site: smaller dependency footprint but
  diverges unnecessarily from the intended App Router architecture.
- Export Next.js statically: preserves route components and build-time rendering,
  with browser-only filtering over the small, validated starter catalog.

## Decision

Use Next.js App Router static export, strict TypeScript, React, Tailwind CSS,
and npm with a committed lockfile. Use Node.js 22 (at least 22.13), Vitest for
catalog/input validation, Playwright Chromium for exported reader flows, ESLint,
and Prettier. No database, API, credentials, or policy fetching is needed.
Pin ESLint 9 because Next.js's bundled import, React, and accessibility plugins
do not yet declare ESLint 10 compatibility. Track its upstream deprecation rather
than forcing an invalid peer dependency tree.

Validate the starter JSON with Zod at build time. Reject duplicate identities,
unsafe URLs, unknown fields, and any status other than `not_reviewed`; never
silently omit invalid records. Generate all detail routes ahead of time.
Use case-insensitive literal name search, category filters, validated URL
parameters, and 20-item pagination. Search state is browser-side because Pages
cannot process per-request queries. Preserve shareable filters and browser
history. Do not offer concern filters without published findings.

Set the project base path to `/terms-made-clear`, retain trailing slashes, and
deploy `out/` using GitHub's Pages artifact workflow. Run checks and browser tests
before deployment. Use a local static preview server with the same path prefix
and real 404 responses to verify export behavior, not only the development app.

## Consequences

This is an explicitly labeled, unreviewed directory preview, not completion of
the database-backed MVP or its evidence gates. United States is a planned review
target, not an established policy region. Terms and privacy coverage remain
missing; no policy dates, citations, findings, or safety ratings are invented.
Project/hosted-service boundaries remain visible.

The homepage and methodology render without JavaScript; interactive filters
require it and display a notice. GitHub Issues is the public corrections channel;
readers can read existing reports without an account but need one to submit.
Policy publication, imports, immutable versioning, PostgreSQL integration tests,
and transactional replacement reviews remain deferred.

Changing the catalog requires a validated build and deployment. Future reviewed
content needs a separate evidence schema and human approval, not edits to
starter status flags. A future server deployment must supersede this limited
hosting decision rather than pretending static export provides database behavior.
