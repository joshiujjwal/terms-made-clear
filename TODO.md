# Terms Made Clear — Task Breakdown

## How to use this file

For each task:
1. Read the spec and run the existing tests; if none exist, record that fact.
2. Write tests FIRST and capture the expected failure (red).
3. Implement the smallest change that passes (green).
4. Review the diff manually and capture evidence.
5. Commit a focused change; update agent context for verified durable lessons.

A phase is complete only with passing relevant checks and human review.
Record evidence links or command results beside each completed item. Scaffold
creation is not evidence that the application works.

## Phase 0: Foundation

- [x] Record the product spec, editorial invariants, and initial scope.
- [x] Create and review the initial agent guidance and directory layout.
- [ ] Confirm initial service list, supported region, and editorial reviewer.
- [ ] Select package manager, supported Node.js version, database driver/migrations,
  and integration/browser test tools; record the tradeoffs in an ADR.
- [ ] Initialize Next.js App Router, strict TypeScript, and Tailwind under `src/`.
- [ ] Add lint, format-check, typecheck, build, and test scripts plus a lockfile.
- [ ] Write a failing homepage smoke test, then render the minimal page.
- [ ] Document local PostgreSQL setup, server-only environment variables, and
  migration/test-database commands; add a secret-free `.env.example`.
- [ ] Add CI running the same checks against a disposable PostgreSQL database.
- [ ] Replace command placeholders in README, AGENTS, and CLAUDE with verified commands.

**Gate:** reproducible setup, smoke-test red/green output, passing CI, human review.

## Phase 1: Versioned, evidence-backed policy records

- [ ] Write failing database integration tests for the spec's entities and invariants.
- [ ] Add migrations for services, policy versions, reviews, citations, points,
  findings, and citation join tables with foreign keys.
- [ ] Reject uncited published content and cross-policy-version citations.
- [ ] Implement a schema-validated maintainer import command using transactions.
- [ ] Cover idempotent reimports, rollback on errors, and immutable cited versions.
- [ ] Publish replacement reviews atomically, retaining prior version history.
- [ ] Use synthetic fixtures; document how a real review becomes publishable.

**Gate:** passing PostgreSQL integration tests, import success/failure evidence,
and human review of schema and editorial publication rules.

## Phase 2: Searchable reader experience

- [ ] Write failing route/browser tests for service search and filters.
- [ ] Implement `/services` with case-insensitive search, category/topic filters,
  validated query parameters, bounded pagination, and accessible controls.
- [ ] Test special characters, invalid parameters, empty results, and database failure.
- [ ] Write failing detail tests, then implement `/services/[slug]` with separate
  terms/privacy sections, source citations, region, and policy/review dates.
- [ ] Explain each finding using policy statement, practical impact, and uncertainty.
- [ ] Cover missing services/policies, unpublished reviews, unknown dates, and
  next-review-date notices at UTC boundaries.
- [ ] Add the homepage, visible legal-advice limitation, and no-findings caveat.

**Gate:** passing reader-flow tests, desktop/mobile screenshots, keyboard-test
notes, source-link checks, and human review of explanations.

## Phase 3: Editorial readiness and hardening

- [ ] Implement `/methodology` describing evidence rules, topics, and stale reviews.
- [ ] Choose a public corrections channel and implement `/corrections`.
- [ ] Select initial services/regions and check official-policy access/reuse conditions.
- [ ] Curate initial terms/privacy records with short excerpts and human review;
  leave missing information explicit instead of filling gaps.
- [ ] Test untrusted text escaping, allowed URL schemes, query parameterization,
  secret isolation, and useful error pages.
- [ ] Check WCAG 2.2 AA behavior for search, filters, headings, focus, and citations.
- [ ] Document repeatable editorial updates and next-review-date selection.

**Gate:** passing error/evidence/presentation tests, reviewed initial dataset,
accessibility notes, and human signoff on methodology.

## Phase 4: Ship

- [ ] Choose hosting and PostgreSQL provider; document migrations and rollback.
- [ ] Configure production secrets without committing credentials.
- [ ] Run the production build and smoke-test the deployed reader flows.
- [ ] Verify production original-source links and freshness/region labels.
- [ ] Document backup/restore and operational error monitoring.
- [ ] Choose a license before describing the project as open source.
- [ ] Review all release diffs and descriptions; publish with evidence.

**Gate:** passing release checks, deployment smoke-test evidence, documented
rollback/restore procedure, and human release approval.

## Parking lot

- User-submitted text or URL analysis (requires a separate spec and threat model).
- Browser extension, policy-change notifications, and service comparisons.
- Additional languages and jurisdiction-specific versions.

## Lessons learned

- No application or dataset exists at scaffold time. Keep command placeholders
  explicit until the actual commands have been run successfully.
- GitHub publishing requires working `gh` authentication; local commits can be
  created independently of remote availability.
