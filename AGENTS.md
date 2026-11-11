# Agent Guide

## Setup and commands

This is a specification-only scaffold. There is no package manifest, application,
or test runner. Do not run guessed scripts or report unavailable checks as passing.

| Operation | Command |
| --- | --- |
| Install dependencies | TODO: select package manager and commit its lockfile |
| Start development | TODO: define dev script in Phase 0 |
| Configure/migrate database | TODO: select and document PostgreSQL tooling |
| Run tests | TODO: add and verify the test runner in Phase 0 |
| Lint/format check | TODO: add and verify scripts in Phase 0 |
| Typecheck/build | TODO: add and verify scripts in Phase 0 |

When adding tooling, replace these placeholders in README, AGENTS, and CLAUDE
with exact commands that have been executed successfully.

## Read first

`docs/spec.md` defines behavior; `TODO.md` tracks evidence-gated work.
Record significant technical choices in `docs/adr/` before dependent work.
Source lives under `src/`; tests mirror it under `tests/`.

## Stack and code style

- Next.js App Router, strict TypeScript, Tailwind CSS, PostgreSQL.
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
