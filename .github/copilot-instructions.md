# Terms Made Clear

Read `AGENTS.md`, `docs/spec.md`, and `TODO.md` before changes.
This scaffold currently has no runnable application or package manifest.
Command placeholders must be replaced with verified commands during Phase 0.

## Stack and conventions

Next.js App Router, strict TypeScript, Tailwind CSS, PostgreSQL.
Prefer server rendering, named exports (except framework-required defaults),
`const`, async/await, early returns, and schema validation.
Use parameterized queries and server-only credentials.
Surface errors explicitly; never silently return success-shaped fallback data.
Render imported policy content as plain text and validate source URLs.

## Test-first workflow

Run existing tests first. Write a focused failing test, confirm red, then implement
until green. Prefer integration tests for route/database behavior. Include edge
cases and failures, and use "should ... when ..." test names.
If the test harness is absent, state that fact; do not claim tests passed.

## Editorial boundaries

MVP: searchable curated database, not user-submitted policy analysis.
Every published summary point and finding needs a citation to its reviewed
policy version and human editorial approval.
Preserve unknown dates, region limits, uncertainty, and missing coverage.
Never equate absence of findings with safety or declare a clause illegal.
Do not fabricate real-service claims or reproduce entire policies.
Do not send source content to external AI services without explicit approval.

## Change boundaries and evidence

Modify only agreed files; ask before large multi-file changes.
Do not remove tests or bundle unrelated refactors. Fix task-caused defects now.
Manually review diffs and AI-written PR descriptions.
Provide test evidence and UI screenshots/manual notes where relevant.
Keep TODO updated with blockers and evidence; record only durable verified lessons
in context. Human review and passing checks are required at phase gates.
