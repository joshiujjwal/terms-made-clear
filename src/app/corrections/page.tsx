import type { Metadata } from "next";

export const metadata: Metadata = { title: "Corrections" };

export default function CorrectionsPage() {
  return (
    <div className="shell section reading-page">
      <span className="eyebrow">HELP KEEP THE RECORD STRAIGHT</span>
      <h1>
        Clarity is a<br />
        <em>work in progress.</em>
      </h1>
      <p className="lede">
        Found an incorrect name, broken homepage link, or confusing limitation?
        Report it through the project&apos;s GitHub Issues.
      </p>
      <section>
        <h2>What to include</h2>
        <p>
          Name the service and page, explain the factual issue, and include an
          official source URL if available. For future policy corrections,
          identify the region, version, and relevant section. Use only short
          necessary excerpts; do not upload full policies.
        </p>
      </section>
      <div className="notice">
        <strong>Issues are public.</strong> Do not include passwords, account
        details, personal information, or confidential documents. A GitHub
        account is required to submit an issue.
      </div>
      <p>
        <a
          className="button primary"
          href="https://github.com/joshiujjwal/terms-made-clear/issues/new?title=Catalog%20correction"
        >
          Open a correction issue <span aria-hidden="true">&#8599;</span>
        </a>
      </p>
      <p>
        <a
          className="text-link"
          href="https://github.com/joshiujjwal/terms-made-clear/issues"
        >
          Read existing reports &rarr;
        </a>
      </p>
      <section>
        <h2>What happens next</h2>
        <p>
          A maintainer will evaluate the report against its source. Accepted
          catalog changes will be validated and redeployed; future policy
          changes will require editorial review before publication. There is no
          guaranteed response time, and this channel does not provide legal
          advice or service account support.
        </p>
      </section>
    </div>
  );
}
