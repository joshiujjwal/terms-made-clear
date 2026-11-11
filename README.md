# Terms Made Clear

**Status: Early Development — specification and scaffold only**

A searchable database of popular apps and websites that explains their terms
and privacy policies in plain language and highlights concerns with citations.

Readers should be able to understand a tradeoff and verify its source, without
being told a service is automatically "safe" or that a clause is illegal.
Summaries are informational, not legal advice.

## Planned stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- PostgreSQL

## Getting started

```sh
git clone https://github.com/joshiujjwal/terms-made-clear.git
cd terms-made-clear
```

The application has not been implemented. There is no dependency manifest or
runnable application yet.

| Task | Command |
| --- | --- |
| Install | TODO: select package manager and add a lockfile in Phase 0 |
| Configure database | TODO: document required environment variables and migrations |
| Develop | TODO: add the dev script in Phase 0 |
| Test | TODO: add the test runner and first smoke test in Phase 0 |
| Lint/format | TODO: add lint and format-check scripts in Phase 0 |
| Type-check/build | TODO: add typecheck and build scripts in Phase 0 |

Start with [the spec](docs/spec.md) and [the roadmap](TODO.md). The first release
is a curated database, not a tool for analyzing user-submitted policies.

## Structure

```text
src/                         Application source (reserved)
tests/                       Tests mirroring source (reserved)
docs/spec.md                 Product and editorial requirements
docs/adr/                    Architecture decision records
.github/copilot-instructions.md
.github/instructions/        Path-specific guidance
.github/skills/              Project skills (reserved)
TODO.md                      Evidence-gated implementation roadmap
CLAUDE.md                    Claude session guidance
AGENTS.md                    Shared coding-agent guidance
```

## Contributing

- Agree on a small task from `TODO.md`; read the applicable spec first.
- Run existing tests, then write a focused failing test before implementing.
- Keep PRs small; do not remove tests or bundle unrelated refactors.
- Review every generated diff and any AI-written PR description yourself.
- Attach evidence: red/green test output, relevant command results, and
  screenshots or keyboard-test notes for visible changes.
- Require human review and passing checks before crossing a phase gate.
- Record durable lessons in agent context only when supported by evidence.

Real service summaries require human editorial review and version-specific
citations. Do not copy entire policies or publish invented findings.

No license has been selected; public visibility alone does not grant reuse rights.
