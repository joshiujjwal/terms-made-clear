# Terms Made Clear: Claude Context

## Commands and current state

Specification-only scaffold: no application, manifest, or test runner exists.
Do not claim tests passed when they could not run.

| Task | Command |
| --- | --- |
| Install | TODO: choose package manager in Phase 0 |
| Dev | TODO: create and verify the dev script |
| Database/migrate | TODO: choose tooling and document local PostgreSQL |
| Tests | TODO: create and verify the test command |
| Lint/format | TODO: create and verify lint and format-check commands |
| Typecheck/build | TODO: create and verify both commands |

Replace these placeholders alongside README and AGENTS when tooling lands.

## Project map

- `docs/spec.md`: product contract, evidence rules, domain model, edge cases.
- `TODO.md`: implementation state, evidence gates, and lessons.
- `docs/adr/`: accepted technical decisions; `0001-template.md` is only a template.
- `src/`: reserved for Next.js App Router application code.
- `tests/`: reserved for tests mirroring source.
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
- Use synthetic fixtures until real source material has editorial approval.
- Preserve published policy versions; replace reviews atomically with history.
- No broad scraping, full-policy reproduction, or third-party LLM upload is
  authorized by the scaffold.
- Never send policy content to third-party services without explicit approval.

## Implementation conventions

Strict TypeScript, named exports except framework-required defaults, `const`,
async/await, early returns, and explicit error handling. Use parameterized
PostgreSQL queries and server-only credentials. Prefer existing tooling and
helpers; comment only non-obvious logic.
