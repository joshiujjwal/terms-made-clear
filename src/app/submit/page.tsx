import type { Metadata } from "next";
import { Suspense } from "react";
import { SubmissionForm } from "../../components/submission-form";
import { catalog } from "../../lib/data";

export const metadata: Metadata = { title: "Suggest a policy source" };

export default function SubmitPage() {
  return (
    <div className="shell section">
      <div className="page-heading">
        <h1>
          Found the policy?
          <br />
          Send the link.
        </h1>
        <p>
          Help fill the source gaps for a service in the catalog. An official
          terms or privacy URL is enough; do not paste the policy.
        </p>
      </div>
      <div className="notice">
        <strong>Submissions are public. Reviews are not automatic.</strong>
        Do not share personal information, credentials, confidential material,
        or full policy text. Source acceptance is not an assessment of the
        service.
      </div>
      <div className="submission-layout">
        <div>
          <Suspense fallback={<p>Loading the source form...</p>}>
            <SubmissionForm
              services={catalog.services.map(({ slug, name, website }) => ({
                slug,
                name,
                website,
              }))}
            />
          </Suspense>
          <p className="submission-direct small">
            <a
              className="text-link"
              href="https://github.com/joshiujjwal/terms-made-clear/issues/new?template=policy-submission.yml"
            >
              Use the GitHub issue form directly &#8599;
            </a>
            <span className="muted">
              Also works without JavaScript. For an unlisted service or provider
              host, contact a maintainer through Corrections.
            </span>
          </p>
        </div>
        <aside
          className="submission-process"
          aria-labelledby="submission-process-heading"
        >
          <h2 id="submission-process-heading">From link to review</h2>
          <ol>
            <li>
              <strong>You submit the issue.</strong>
              <p>
                The website prefills it; GitHub asks you to sign in and confirm.
              </p>
            </li>
            <li>
              <strong>A maintainer accepts the source.</strong>
              <p>
                The policy-accepted label creates a draft PR with an unverified
                link. Nothing is fetched automatically.
              </p>
            </li>
            <li>
              <strong>An editor prepares the evidence.</strong>
              <p>
                Version-specific citations and human approval are required
                before any explanation can be published.
              </p>
            </li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
