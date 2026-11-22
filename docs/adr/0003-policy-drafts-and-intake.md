# ADR 0003: Unpublished research and accepted policy-link submissions

- Status: accepted for draft preparation and link intake; user approved
- Date: 2026-11-21

## Context

The user requested five initial policy drafts and website submissions that open
GitHub issues and automatically produce PRs. The chosen services are GitHub,
YouTube, Instagram (Meta as provider, not a separate product), ChatGPT, and
Amazon.com. United States remains the target, not assumed applicability.

## Decision

Keep Pages static. Store strictly validated unpublished research in
`data/research.json`, separate from starter identities. A captured policy version
has a stable ID, source URL, actual retrieval method/time, distinct effective
date, nullable full-response SHA-256, and explicit scope/access/reuse limitations.
Document-tool excerpts without a full-response checksum stay marked incomplete.
Blocked sources have no invented policy version or explanation.

Every draft point separates the policy statement from interpretation and links
short excerpts to its own captured version. All records have null editorial
approval; the schema rejects publication. The website exposes only source links,
capture metadata, and progress, never unapproved explanations or excerpts.
Publishing reviews is a future, separately reviewed change.

Add `/submit/` with a local form that validates a known service, policy kind,
official-host HTTPS URL, and region, then navigates to a prefilled GitHub issue.
Contributors need a GitHub account and must explicitly submit the issue. A
matching issue form is also available directly on GitHub. Do not put a token in
the website or offer an anonymous submission backend.

Only an issue labeled `policy-accepted` by a collaborator with write/maintain/
admin permission can trigger a draft PR. A second label, `policy-submission`,
identifies intake. The Action checks out the trusted default branch, validates
the issue body, and writes one JSON candidate to
`data/submissions/issue-N.json` via GitHub's API. It fetches no submitted URL,
runs no submitted code, copies no policy text, and never merges or approves a PR.
Accepted-source PRs are suggestions, not reviewed policy versions.

Use an issue-number-derived branch and file path. Repeated acceptance finds the
existing PR and does not overwrite reviewers' changes. Invalid input receives
explicit issue feedback and fails the job. API failures surface explicitly
without printing tokens or untrusted response bodies. Serialize input as JSON;
never interpolate issue text into a shell command or Action script.

## Threat boundaries and operations

The maintainer label is the spam/rate-control gate. Validate the actor's current
repository permission, issue state, both labels, and a bounded structured body.
Reject bodies edited between the acceptance event and the fresh issue read;
the maintainer must review the change and reapply the label.
Allow only configured service hosts, HTTPS, ordinary ports, and URLs without
credentials, sensitive query keys, or private/local hostnames. This is syntax
and hostname screening, not proof that a submitted page is authentic or current.
Do not follow redirects or fetch content in the intake Action.

Grant contents/pull-request/issue write permissions only to the intake job.
Keep the repository's default token permissions read-only. Enable GitHub's
workflow PR creation setting; never use the approval capability in this code.
PRs created with `GITHUB_TOKEN` do not trigger other workflows. Intake validates
the generated record itself, and maintainers must run checks/human review before
merging; use manual Pages dispatch after a bot-authored merge if needed.

Do not auto-close the issue on a link-only merge. Public issues and PRs must not
contain credentials, personal information, full policies, or confidential data.
Source suggestions remain separate from the website's research dataset.

## Verification and limits

Use synthetic red/green schema, URL, issue-body, permission, API/idempotency,
and rollback/error tests, plus browser tests for submission and source metadata.
Exercise the real Action with a clearly labeled maintainer smoke-test issue and
retain its draft PR as evidence; no auto-merge. This is not a database importer
or a replacement for human editorial review or a full publication threat model.
