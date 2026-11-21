# Terms Made Clear

**Status: Runnable static catalog preview — no published policy reviews**

A searchable starter directory of 30 apps, websites, and developer projects.
Every entry explicitly marks terms and privacy policies as not reviewed.
The planned full product will explain policies with version-specific citations.

Readers should be able to understand a tradeoff and verify its source, without
being told a service is automatically "safe" or that a clause is illegal.
Summaries are informational, not legal advice.

## Preview stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- Build-time JSON validation with Zod
- Vitest and Playwright Chromium

GitHub Pages hosts the Next.js static export. PostgreSQL and evidence-backed
policy publication are deferred, not simulated. See
[the hosting decision](docs/adr/0002-static-pages-preview.md).

Public site: https://joshiujjwal.github.io/terms-made-clear/

## Getting started

```sh
git clone https://github.com/joshiujjwal/terms-made-clear.git
cd terms-made-clear
```

Use Node.js 22, at least 22.13 (`.nvmrc`). Install from the committed lockfile.
Local development and preview both use `/terms-made-clear/`, matching Pages.

| Task             | Command                                                     |
| ---------------- | ----------------------------------------------------------- |
| Install          | `npm ci`                                                    |
| Develop          | `npm run dev` (http://localhost:3000/terms-made-clear/)     |
| Unit tests       | `npm test`                                                  |
| Browser tests    | `npm run build && npm run test:e2e`                         |
| Lint/format      | `npm run lint` / `npm run format:check`                     |
| Apply formatting | `npm run format`                                            |
| Type-check/build | `npm run typecheck` / `npm run build`                       |
| Preview export   | `npm run preview` (http://127.0.0.1:4173/terms-made-clear/) |
| Database         | Not used by this preview; PostgreSQL tooling is deferred    |

Playwright needs Chromium. If its executable is missing, run
`npx playwright install chromium`; CI installs Chromium and its Linux dependencies.
Build before starting the static preview or running browser tests.

Start with [the spec](docs/spec.md) and [the roadmap](TODO.md). The first release
is a curated database, not a tool for analyzing user-submitted policies.

## Edit and deploy

Customize [data/catalog.json](data/catalog.json) using
[the catalog guide](docs/catalog.md). Invalid records fail the build. Starter
status cannot be used to publish policy claims.

The Pages workflow checks, builds, and tests the static export before deploying
`out/` on pushes to `main` or manual workflow dispatch. In repository
Settings > Pages, select **GitHub Actions** as the source. No database secrets
are needed. Changes to the project path require updating `src/lib/site.ts`
and the local preview/browser configuration together.

The corrections channel is
[GitHub Issues](https://github.com/joshiujjwal/terms-made-clear/issues).
Reports are public; do not include personal or confidential information.

## Structure

```text
src/app/                     Static App Router pages
src/components/              Catalog controls and cards
src/lib/                     Catalog validation, search, and shared paths
data/catalog.json            Unreviewed starter identities
tests/lib/                   Synthetic catalog/input tests
tests/browser/               Exported reader-flow tests and screenshots
scripts/preview.mjs          Local static preview with the Pages path prefix
docs/spec.md                 Product and editorial requirements
docs/adr/                    Architecture decision records
.github/copilot-instructions.md
.github/instructions/        Path-specific guidance
.github/workflows/pages.yml  Checked static deployment
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

## Preview limitations

There are no reviewed policy URLs, dates, excerpts, summaries, or findings.
The United States is a planned review target, not confirmed policy applicability.
Homepage availability and regional redirects are unverified. Interactive search
and pagination require JavaScript; the no-JavaScript fallback lists all detail
links. The full database-backed spec and its human review gates remain open.
