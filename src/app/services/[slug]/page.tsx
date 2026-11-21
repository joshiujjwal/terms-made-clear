import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabels, serviceTypeLabels } from "../../../lib/catalog";
import { catalog } from "../../../lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalog.services.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function getService(params: Props["params"]) {
  const { slug } = await params;
  const service = catalog.services.find((entry) => entry.slug === slug);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params);
  return { title: `${service.name} | Review coverage` };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params);
  return (
    <div className="shell section">
      <Link className="text-link breadcrumb" href="/services/">
        &larr; Back to catalog
      </Link>
      <div className="detail-heading">
        <div>
          <h1>{service.name}</h1>
          <p className="service-taxonomy">
            {categoryLabels[service.category]} /{" "}
            {serviceTypeLabels[service.serviceType]}
          </p>
          <p>A catalog entry, not a policy assessment.</p>
        </div>
        <a className="button secondary" href={service.website}>
          Visit official website <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
      <div className="notice">
        <strong>No reviewed policies are available for this service.</strong>{" "}
        United States is our planned initial review region, not a verified
        region for these policies. Homepage destinations and redirects have not
        been independently checked.
      </div>
      <div className="policy-grid">
        {[
          ["terms", "Terms of service"],
          ["privacy", "Privacy policy"],
        ].map(([kind, label]) => (
          <section
            className="policy-panel"
            key={kind}
            aria-labelledby={`${kind}-heading`}
          >
            <div className="panel-top">
              <h2 id={`${kind}-heading`}>{label}</h2>
              <span className="review-badge">Not reviewed</span>
            </div>
            <p>
              No summary, citations, or documented findings have been published.
              The policy&apos;s existence or contents have not been assessed.
            </p>
            <dl className="policy-dates">
              <div>
                <dt>Official policy source</dt>
                <dd>Not recorded</dd>
              </div>
              <div>
                <dt>Applicable region</dt>
                <dd>Not verified</dd>
              </div>
              <div>
                <dt>Effective date</dt>
                <dd>Unknown</dd>
              </div>
              <div>
                <dt>Retrieved date</dt>
                <dd>Not retrieved</dd>
              </div>
              <div>
                <dt>Editorial review date</dt>
                <dd>Not reviewed yet</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
      {service.serviceType === "project" || service.slug === "gitlab" ? (
        <section className="notice project-note">
          <h2>Product boundaries matter.</h2>
          <p>
            The project website, downloadable software, self-hosted
            installations, and hosted offerings can have different policies. A
            software license is not automatically a terms-of-service or privacy
            policy. This entry does not cover all related products or
            installations.
            {service.slug === "wordpress"
              ? " WordPress.org is distinct from WordPress.com."
              : null}
          </p>
        </section>
      ) : null}
      <section className="detail-standard">
        <h2>No findings is not a safety endorsement.</h2>
        <p>
          Future explanations will need version-specific citations and human
          review. A documented concern is an editorial interpretation, not proof
          of illegality.
        </p>
        <Link className="text-link" href="/methodology/">
          Read our evidence standards &rarr;
        </Link>
      </section>
    </div>
  );
}
