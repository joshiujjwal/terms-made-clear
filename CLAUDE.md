# Terms Made Clear: Claude Context

## Commands and current state

Runnable Next.js static catalog preview with 30 unreviewed starter services.
Use Node.js 22 (at least 22.13) and npm. The Pages preview cannot run PostgreSQL;
the full policy publication product remains deferred.

ADR 0003 permits five unpublished research starts and maintainer-accepted
link-only draft PRs. Keep `data/research.json` server-only; only source metadata
may reach reader pages. `data/submissions/` is isolated from research/publication;
build validates it, and intake must never fetch URLs or approve/merge reviews.

| Task               | Command                                          |
| ------------------ | ------------------------------------------------ |
| Install            | `npm ci`                                         |
| Dev                | `npm run dev`                                    |
| Static preview     | `npm run build && npm run preview`               |
| Database/migrate   | Deferred; no database in this preview            |
| Unit/browser tests | `npm test` / `npm run build && npm run test:e2e` |
| Lint/format        | `npm run lint` / `npm run format:check`          |
| Apply formatting   | `npm run format`                                 |
| Typecheck/build    | `npm run typecheck` / `npm run build`            |

Keep these commands synchronized with README and AGENTS. Dev uses
http://localhost:3000/terms-made-clear/ and preview uses port 4173 at the same path.
Browser tests need a build and Chromium; if missing, use
`npx playwright install chromium`. See ADR 0002 for the hosting scope.

## Project map

- `docs/spec.md`: product contract, evidence rules, domain model, edge cases.
- `TODO.md`: implementation state, evidence gates, and lessons.
- `docs/adr/`: accepted technical decisions; `0001-template.md` is only a template.
- `src/`: App Router pages, catalog controls, validation, and search.
- `data/catalog.json`: starter service identities, never policy evidence.
- `tests/`: Vitest validation/search and Playwright exported reader flows.
- `.github/workflows/pages.yml`: checked build and GitHub Pages deployment.
- `.github/instructions/`: path-specific requirements.
- `.github/skills/`: reserved for reusable project skills.

## Workflow

1. Run existing tests first; if no harness exists, state that explicitly.
2. Read TODO and the applicable spec section; choose one bounded task.
3. Write a focused failing test and verify the expected failure.
4. Implement until green; run relevant lint, type, and build checks.
5. Review the diff and retain evidence; require human review at phase gates.
6. Commit only when requested or authorized by the active task.
7. Record durable discoveries in context and leave TODO as a clear handoff.

Fix issues caused by the task immediately. Do not hide debt with silent fallbacks
or bundle unrelated cleanup; track unrelated work separately.

## Non-obvious constraints

- MVP is curated, read-only discovery, not user-submitted policy analysis.
- A concern is an editorial interpretation, not a legal verdict.
- Published summaries and findings require citations to the same policy version.
- Effective, retrieved, and reviewed dates have different meanings.
- A next-review-date notice is not evidence that a source changed.
- No findings does not mean no risks; missing coverage must stay visible.
- Tests use synthetic fixtures; the real starter catalog includes identities
  only, never source-policy claims.
- Preserve published policy versions; replace reviews atomically with history.
- No broad scraping, full-policy reproduction, or third-party LLM upload is
  authorized by the scaffold.
- Never send policy content to third-party services without explicit approval.

## Implementation conventions

Strict TypeScript, named exports except framework-required defaults, `const`,
async/await, early returns, and explicit error handling. Use parameterized
PostgreSQL queries and server-only credentials. Prefer existing tooling and
helpers; comment only non-obvious logic.
