# Policy research and public source intake

These are unpublished research leads, **not completed or approved reviews**.
`data/catalog.json` retains `not_reviewed`. `data/research.json` contains seven
short cited drafts across five services and three blocked document records.

| Service          | Terms                      | Privacy                       | Important limitation                                                                      |
| ---------------- | -------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| GitHub           | Draft, HTML checksum       | Draft, HTML checksum          | Organization/Enterprise and individual license grants need further review                 |
| YouTube          | Draft, HTML checksum       | Draft, Google policy checksum | Multi-service scope, license duration, settings, and regional applicability incomplete    |
| ChatGPT          | Excerpt-only draft         | Excerpt-only US draft         | Direct capture 403; full checksums unknown; privacy updated date is not an effective date |
| Instagram / Meta | Blocked, Help Center shell | Excerpt-only Meta draft       | No terms body; privacy shell not policy evidence; US regional notice unreviewed           |
| Amazon.com       | Blocked, HTTP 503          | Blocked, HTTP 503             | No clauses, dates, or policy-content checksums verified                                   |

The four HTML checksums identify complete HTTP responses, including page
furniture. Document-tool excerpts lack a recorded complete-response checksum and
exact retrieval time; `capturedOn` records the known day, not an invented
timestamp. Their stable version IDs group provisional evidence, not proof that
complete versions have been verified. Shell-page hashes are deliberately not
stored as policy evidence. Excerpts remove link markup and normalize typography;
editors must verify the original wording and surrounding qualifications.

Every draft has explicit scope/access/reuse notes and null approval. Statements
and interpretations are separate. Excerpts are limited to 90 words per record.
The server-only dataset is not passed to client components; public detail pages
show only source/capture metadata and progress, never unapproved explanations.
No ToS;DR data or ratings were imported; its current data reuse license is not
verified. No full policies were saved or uploaded to external AI services.

## Completing the first five

1. Manually verify the official policy and applicable product/account/region.
   For inaccessible pages, supply an accessible official link through `/submit/`;
   do not substitute a different country or product to fill the gap.
2. Verify the complete version and checksum basis, effective versus updated
   dates, each short quotation, linked policies, and relevant exceptions.
3. Review reuse rights and attribution. Do not commit full policy bodies.
4. Have a human editor approve wording and evidence before designing a
   separately reviewed publication change. The current schema rejects
   non-null approval and published statuses; editing a starter flag is not
   publication.

For Instagram, the source links a separate US regional notice at
https://www.facebook.com/privacy/policies/uso/ . It remains unreviewed.
Model-training controls and other linked source documents also remain
unreviewed. No finding here establishes safety, illegality, or legal advice.

## Suggesting a source

Use https://joshiujjwal.github.io/terms-made-clear/submit/ or the service's
“Suggest a source” link. Select a catalog service, terms/privacy, an official
HTTPS link, and United States or Unknown. GitHub sign-in and explicit issue
submission are required. Do not include credentials, tokens, personal data,
confidential material, or policy bodies. Unlisted services/provider hosts need
maintainer discussion through Corrections.

The site prefills `.github/ISSUE_TEMPLATE/policy-submission.yml`. The issue
gets `policy-submission`; a collaborator with write/maintain/admin permission
adds `policy-accepted` after checking the link. The Action creates
`policy-source-issue-N` and a **draft** PR adding
`data/submissions/issue-N.json`. It never fetches the URL, executes issue/PR
content, writes review explanations, approves, merges, or closes the issue.

Repeated acceptance reuses any existing PR, including a closed one. Issue edits
after the maintainer's label event are rejected. Interrupted PR creation can
reuse an unchanged candidate, but reviewer edits are not
overwritten. API failures retain the branch because a failed response might
follow a successful remote write. A branch without a candidate needs manual
inspection. Errors are posted to the issue and fail the job; repeating an
unchanged success does not create another PR.

`npm run build` validates submission files before exporting the site. It does
not import those candidates into public research. `GITHUB_TOKEN`-created PRs
do not start other workflows; run the checks in the PR checklist and require
human review before merging. Use manual Pages workflow dispatch if a bot-made
merge did not start deployment.

Actions keeps default workflow permissions read-only; only intake receives
contents/issues/PR write permissions. GitHub's combined “create and approve PRs”
setting must be enabled for creation, but this workflow never calls the approval
or merge APIs. See ADR 0003 for scope and threat boundaries.
