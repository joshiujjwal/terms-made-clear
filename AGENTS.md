# Agent Guide

## Setup and commands

This repository has a Next.js static catalog preview for GitHub Pages, not the
full database-backed product. Use Node.js 22 (at least 22.13) and the npm lockfile.
See `docs/adr/0002-static-pages-preview.md` for the approved preview exception.

ADR 0003 permits unpublished research and maintainer-gated policy-link draft
PRs. See `docs/policy-research.md`: candidates never become reviews automatically,
and the intake Action must not fetch submitted URLs. `npm run build` validates
isolated submission files before export. Keep research imports server-only.

| Operation                  | Command                                          |
| -------------------------- | ------------------------------------------------ |
| Install dependencies       | `npm ci`                                         |
| Start development          | `npm run dev`                                    |
| Static preview             | `npm run build && npm run preview`               |
| Configure/migrate database | Deferred; no database in the Pages preview       |
| Run unit/browser tests     | `npm test` / `npm run build && npm run test:e2e` |
| Lint/format check          | `npm run lint` / `npm run format:check`          |
| Apply formatting           | `npm run format`                                 |
| Typecheck/build            | `npm run typecheck` / `npm run build`            |

Development uses http://localhost:3000/terms-made-clear/; static preview uses
http://127.0.0.1:4173/terms-made-clear/. Build before browser tests. If Chromium is
missing, install it with `npx playwright install chromium`. Keep commands in
README, AGENTS, and CLAUDE synchronized with verified scripts.

## Read first

`docs/spec.md` defines behavior; `TODO.md` tracks evidence-gated work.
Record significant technical choices in `docs/adr/` before dependent work.
Source lives under `src/`; tests mirror it under `tests/`.

## Stack and code style

- Next.js App Router, strict TypeScript, Tailwind CSS, PostgreSQL.
- Current preview: static export with validated starter JSON; PostgreSQL,
  imports, and publication remain deferred. Never invent reviews to fill gaps.
- Prefer server rendering for catalog and policy details.
- Use `const`, named exports, async/await, early returns, and narrow types.
- Framework-mandated default exports are allowed for route components.
- Use parameterized SQL, schema validation at input boundaries, and safe URLs.
- Keep credentials server-only. Never commit secrets or log sensitive values.
- Render policy text as text, not untrusted HTML.
- Handle failures explicitly; do not turn errors into success-shaped defaults.
- Reuse existing patterns. Comment only non-obvious logic.

## Tests and verification

1. Run the existing full suite first; document if the harness does not yet exist.
2. Write tests first; verify the intended failure before implementing.
3. Implement the smallest passing change, then run relevant checks.
4. Prefer route/database integration tests over mocked API behavior.
5. Test edge cases and error paths; name tests "should ... when ...".
6. Never delete existing tests to make checks pass.

Use disposable test databases, not production or shared databases. Keep fixtures
synthetic. Test citation/version consistency and transactional publication, not
just component rendering.

## Content invariants

Every published explanation/finding needs version-specific evidence and human
editorial review. Preserve region and date distinctions. Do not fabricate
real-service findings, equate no findings with safety, or present legal advice.
Use only necessary short excerpts with attribution. Policy fetching or sending
content to external AI services requires separate approval.

## Scope, handoff, and PRs

- Modify only agreed files; ask before large multi-file changes.
- Do not refactor unrelated code. Fix task-caused issues before completion.
- Check the diff manually, including generated code and PR descriptions.
- Include red/green output and relevant checks; include screenshots/manual
  accessibility notes for UI changes.
- Require passing checks and human review at every roadmap phase gate.
- Update TODO with evidence and blockers; update context only for verified lessons.
- Do not claim a feature, deployment, or check exists without evidence.
