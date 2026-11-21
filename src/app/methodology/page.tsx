import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Methodology" };

export default function MethodologyPage() {
  return (
    <div className="shell section reading-page">
      <h1>Evidence before explanations.</h1>
      <p className="lede">
        Clear language only helps when it stays faithful to the source. Here is
        the standard we will require before publishing a policy review.
      </p>
      <div className="notice">
        <strong>This site is an unreviewed catalog preview.</strong> There are
        no published policy explanations. The services are curated candidates,
        not a measured popularity ranking or an endorsement.
      </div>
      <section>
        <h2>What counts as evidence?</h2>
        <p>
          Every future summary point and finding needs a short excerpt and
          section reference from the exact reviewed policy version. We separate
          what a policy says from what an editor thinks it could mean in
          practice. A human must approve the explanation before publication.
        </p>
      </section>
      <section>
        <h2>What will a concern mean?</h2>
        <p>
          A concern describes a supported tradeoff, not a numerical trust score
          or a verdict that a clause is illegal. Planned topics include
          advertising and data sharing, tracking, retention, account deletion,
          content licenses, renewal and cancellation, dispute resolution,
          unilateral changes, and account termination. Topic labels alone cannot
          justify findings.
        </p>
      </section>
      <section>
        <h2>Dates and regions stay distinct.</h2>
        <p>
          Effective, retrieved, and reviewed dates describe different events.
          Unknown dates stay unknown. The United States is our first planned
          review target; actual applicable regions will need source evidence.
          Exceptions, opt-outs, and regional limits must remain visible.
        </p>
      </section>
      <section>
        <h2>Reviews will have a history.</h2>
        <p>
          Reviewed policy versions must be preserved. A replacement review will
          retain the previous version and its evidence. A next-review-date
          reminder means an editorial check is due, not that a source has
          necessarily changed. No freshness claims appear on unreviewed entries.
        </p>
      </section>
      <section>
        <h2>Missing coverage is not reassurance.</h2>
        <p>
          No findings means no documented findings in that review, not no risks.
          Here, no reviews exist at all. Project licenses, website policies, and
          hosted-service policies are not interchangeable.
        </p>
      </section>
      <section>
        <h2>Short excerpts, no hidden uploads.</h2>
        <p>
          We will not reproduce entire policies. Source access and reuse
          conditions need checking before approved retrieval, and policy content
          will not be sent to third-party AI services without explicit approval.
          This preview fetches no policies and uses no advertising trackers.
        </p>
      </section>
      <Link className="button secondary" href="/corrections/">
        Help correct the catalog &rarr;
      </Link>
    </div>
  );
}
