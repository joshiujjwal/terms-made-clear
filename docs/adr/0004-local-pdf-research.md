# ADR 0004: Local PDF evidence for unpublished research

- Status: accepted for draft preparation; user approved
- Date: 2026-11-22

## Context

The user supplied an Apple Developer Program License Agreement PDF and approved
a separate Apple Developer catalog entry, an unpublished draft, and coordinated
validation, presentation, test, and documentation changes. This is not approval
to publish explanations, fetch sources, commit the full PDF, or deploy.

## Decision

Extend the existing unpublished research schema with `local-pdf` captures.
Record the local document's basename, title, document identifier, printed date,
page count, and SHA-256 of the complete PDF bytes. This fingerprint identifies
the supplied file, not an authenticated official version or HTTP response.

Allow a null source URL only for a draft with validated local-PDF provenance.
Keep original retrieval time and HTTP-response checksum null. `capturedOn`
records the local inspection day; the printed document date does not populate
the agreement's unknown effective date. Existing remote-capture requirements,
version-linked citations, short-excerpt limits, and null approval remain intact.

The site may expose provenance, scope, and draft progress, but no unapproved
points or excerpts. Without a verified source URL, render an explicit missing
source notice, not an invented official link. Do not export or commit the PDF.
Keep the supplied file local using a narrowly scoped Git ignore rule.

Apple Developer covers program membership, not Apple's consumer terms or a
standalone privacy policy. Regional attachments and missing paid-distribution
Schedules 2 and 3 remain review blockers. Human verification of authenticity,
reuse, applicability, quotations, and wording is required before publication.

## Verification

Use synthetic red/green tests for local provenance, checksum basis, unknown
URLs/dates, and rejection of incomplete or remote-mislabeled captures. Verify
the exported Apple Developer route, search, source submission prefill, missing
privacy coverage, mobile layout, and absence of unapproved text/PDF assets.
