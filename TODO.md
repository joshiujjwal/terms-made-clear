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

## Five-service research and accepted source intake

Approved scope: GitHub, YouTube, Instagram (Meta provider), ChatGPT, Amazon.com;
official-source fetching for these drafts only; public link suggestions accepted
by a write-capable maintainer before draft PR automation (ADR 0003).

- [x] Establish baseline: 20 unit and 10 exported browser tests passed.
- [x] Capture schema/submission red (missing modules), then intake red (missing
      module); 51 unit tests passed after implementation.
- [x] Capture all three new browser tests red before implementing `/submit/`
      and source metadata. Preserve Not reviewed badges; research progress is
      separate, not editorial approval.
- [x] Start ten document records for five services: seven cited unpublished
      drafts and three blocked sources. Four complete HTML-response checksums;
      three excerpt-only drafts have null full checksum and unknown exact
      retrieval time. Instagram terms: shell only. Amazon documents: HTTP 503.
      Details and human verification tasks: `docs/policy-research.md`.
- [x] Add structured issue form, safe official-host URL validation, explicit
      errors, current maintainer-permission gate, deterministic branch/path,
      idempotent draft PR creation, and isolated unverified source records.
      No intake fetching, external AI calls, approval, or auto-merge.
- [x] Create `policy-submission` and `policy-accepted` labels; enable GitHub's
      combined workflow PR-creation setting, retaining read-only defaults.
      The implementation never uses approval permissions.
- [x] Finish local checks: 54 unit and 15 exported browser tests passed; lint,
      format check, typecheck, and static build passed. Red/green regressions
      cover preserving ambiguous API writes, post-acceptance issue edits, and
      320px navigation overflow. Verified home/submit/GitHub/Amazon/Instagram
      layouts at 320, 390, 768, and 1280px, loaded fonts, keyboard form entry,
      and no browser runtime errors. Source and rendered Impeccable scans exit
      0; final form scans have no contrast advisory. Manually reviewed screenshots
      in session artifacts: `policy-submit-390.png`, `policy-submit-1280.png`,
      and `policy-github-390.png`/`policy-github-1280.png`.
      Unapproved interpretations were absent from exported HTML/TXT/JS.
      This is not a full human accessibility audit or editorial approval.
- [ ] Commit/push, exercise a real accepted issue and duplicate acceptance,
      verify generated draft PR and source isolation, then verify live Pages.

**Human blockers:** complete and verify excerpt-only captures; accessible official
Instagram terms and Amazon.com policies; regional/linked-policy and reuse
review; actual editorial approval. No first-five review or phase gate is complete.

## Approved GitHub Pages catalog preview

This is a limited static release, not completion of the PostgreSQL/policy MVP.
The user approved static hosting and the required app/tooling/documentation
changes. ADR 0002 records the deviation and remaining editorial boundaries.

- [x] Add strict TypeScript, Next.js static export, Tailwind, npm lockfile, and
      verified commands. Local checks use compatible Node.js 22.23.5.
- [x] Capture catalog-test red: missing `src/lib/catalog`; then green: 20 tests
      cover synthetic validation and search cases.
- [x] Capture homepage-smoke red: missing expected heading in the exported
      placeholder page. Implement homepage, 30 generated details, and catalog.
- [x] Add search/categories, 20-item pagination, URL validation/history, explicit
      missing coverage/dates, methodology, and GitHub Issues corrections.
- [x] Finish exported browser checks, desktop/mobile screenshot review, and
      evidence handoff. `npm run test:e2e`: 9 passed against the static export.
      Screenshots in ignored `test-results/`: `homepage-desktop.png` (1280px)
      and `homepage-mobile.png` (390px). Visual inspection found no horizontal
      overflow; scripted keyboard checks cover skip-link focus and navigation.
      This is not a complete human WCAG audit.
- [x] Verify local lint, format, typecheck, and build for the final revision.
      `npm test`: 20 passed. `npm run lint`, `npm run format:check`,
      `npm run typecheck`, and `npm run build` succeeded. `npm ci` reproduced
      the lockfile; dev and preview responded at the expected project path.
- [x] Verify the checked Pages CI workflow for the deployed revision.
      Evidence: [run 44945891435](https://github.com/joshiujjwal/terms-made-clear/actions/runs/44945891435)
      passed install, 20 unit tests, lint/format/typecheck, export build, 9 browser
      tests, and deployment for application commit `77a3170`.
- [x] Commit/push the approved preview, enable Actions-based Pages, and verify
      the deployed homepage, filters, deep links, and assets.
      Live: https://joshiujjwal.github.io/terms-made-clear/ . Chromium checks
      confirmed homepage HTTP 200 and loaded CSS, search, category filters,
      pagination, direct detail reload, methodology/corrections, and custom HTTP 404. No runtime errors or failed requests other than normal navigation
      cancellations of Next.js prefetches.

**Remaining blockers:** human editorial reviewer and policy-source approval;
reviewed records, actual regions, citation/version schema, transactional imports,
PostgreSQL tooling, full accessibility audit, and full-product release signoff.
ESLint 9 is pinned for Next plugin peer compatibility despite upstream
deprecation; upgrade when compatible plugins are available (ADR 0002).
CI also reports Node.js 20 deprecation annotations for the Pages action versions;
GitHub ran them successfully with Node.js 24. Update supported action majors
in a focused follow-up, retaining the same deployment checks.

## Reference-index redesign

The user approved a search-first reference index and publication to the existing
Pages site, using [Impeccable](https://impeccable.style/designing/) as guidance.
This changes presentation and homepage entry, not policy coverage.

- [x] Establish baseline: 20 unit tests and 9 browser tests passed.
- [x] Write homepage-search test first; confirm red because the homepage had no
      search input. The redesigned native GET form opens validated catalog search.
- [x] Replace italic headlines, metric panels, monograms, numbered decorations,
      and rounded-card grids with self-hosted Archivo, ink/off-white surfaces,
      restrained orange actions, and reusable service rows.
- [x] Retain terms/privacy missing-coverage labels, unknown dates, regional
      uncertainty, plain-text rendering, source links, and no-JavaScript access.
- [x] Finish final reader tests, Impeccable scans, and screenshot/focus review.
      `npm test`: 20 passed; `npm run test:e2e`: 10 passed. Lint, format check,
      typecheck, and static build succeeded. Impeccable 4.10.0 source scan
      reports no findings; rendered scans of home/catalog at desktop/mobile
      widths and a detail page also exit 0 without findings.
      Archivo loads locally; home/catalog/detail have no horizontal overflow at
      320, 390, 768, and 1280px. Keyboard checks cover skip-to-main and focus on
      homepage search. Visually reviewed screenshots are in session artifacts:
      `reference-home-1280.png`, `reference-home-390.png`, and catalog/detail
      counterparts. These checks do not certify full WCAG compliance.
- [x] Publish and verify the redesigned Pages release.
      [Run 44955793723](https://github.com/joshiujjwal/terms-made-clear/actions/runs/44955793723)
      passed all checks and deployed application commit `812b940`.
      The live site shows the new heading and self-hosted typography; homepage
      search, direct detail reload, missing coverage, and desktop/mobile layouts
      were verified without browser runtime errors. A live Impeccable scan exits
      0 with no findings. Deployed screenshots are in session artifacts as
      `reference-live-home-1280.png` and `reference-live-home-390.png`.

Design tooling is local: `npm exec -- impeccable detect src/` for source checks,
or `npm exec -- impeccable detect http://127.0.0.1:4173/terms-made-clear/`
against `npm run preview`. Add `--viewport 390x844` for a mobile scan.
No Impeccable hooks, global configuration, AI uploads, or policy retrieval were
enabled. A clean detector result is not a full accessibility audit or human
editorial approval.

## Phase 0: Foundation

- [x] Record the product spec, editorial invariants, and initial scope.
- [x] Create and review the initial agent guidance and directory layout.
- [ ] Confirm initial service list, supported region, and editorial reviewer.
  - Starter evidence: `data/catalog.json` contains 30 curated candidates;
    `docs/catalog.md` explains customization and limitations. The user selected
    the United States as the initial review target, not confirmed applicability.
    All terms/privacy statuses are `not_reviewed`; reviewer assignment and human
    signoff remain blockers.
  - Initial dataset checks: 30 entries, required fields, unique slugs/URLs, HTTPS
    syntax, allowed categories/types, and both unreviewed statuses. At that time
    no test harness existed; no application tests or live-source checks ran.
    The later static-preview verification is recorded above.
- [ ] Select package manager, supported Node.js version, database driver/migrations,
      and integration/browser test tools; record the tradeoffs in an ADR.
- [x] Initialize Next.js App Router, strict TypeScript, and Tailwind under `src/`.
      Evidence: static export builds; server/database work remains deferred.
- [x] Add lint, format-check, typecheck, build, and test scripts plus a lockfile.
- [x] Write a failing homepage smoke test, then render the minimal page.
      Evidence: expected-heading failure before implementation; preview tests track
      the reader flows, not PostgreSQL behavior.
- [ ] Document local PostgreSQL setup, server-only environment variables, and
      migration/test-database commands; add a secret-free `.env.example`.
- [ ] Add CI running the same checks against a disposable PostgreSQL database.
- [x] Replace command placeholders in README, AGENTS, and CLAUDE with verified commands.
      Database commands stay explicitly deferred, not guessed.

**Gate:** reproducible setup, smoke-test red/green output, passing CI, human review.

## Phase 1: Versioned, evidence-backed policy records

- [ ] Write failing database integration tests for the spec's entities and invariants.
- [ ] Add migrations for services, policy versions, reviews, citations, points,
      findings, and citation join tables with foreign keys.
- [ ] Reject uncited published content and cross-policy-version citations.
- [ ] Implement a schema-validated maintainer import command using transactions.
- [ ] Record a service-only seed design in an ADR, then test and implement
      idempotent import of approved starter names/homepages without policy versions
      or reviews; reject invalid/duplicate records and roll back failures.
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

- At scaffold time there was no app or dataset. Static-preview commands are now
  verified; database commands and evidence-backed publication remain deferred.
- GitHub publishing requires working `gh` authentication; local commits can be
  created independently of remote availability.
