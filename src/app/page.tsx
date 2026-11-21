import Link from "next/link";
import { categoryLabels } from "../lib/catalog";
import { catalog } from "../lib/data";

export default function HomePage() {
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> AN INDEPENDENT, CURATED DIRECTORY
          </span>
          <h1>
            Know the service.
            <br />
            <em>Understand the tradeoffs.</em>
          </h1>
          <p className="hero-description">
            Terms and privacy policies should be easier to understand. We are
            building a place for clear explanations, original sources, and
            honest limitations.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/services/">
              Browse the catalog <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link className="text-link" href="/methodology/">
              How we review policies <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
          <p className="small muted">
            {catalog.services.length} services. No published policy reviews yet.
          </p>
        </div>
        <aside className="hero-panel" aria-label="Current review coverage">
          <div className="panel-top">
            <span className="eyebrow">COVERAGE, NOT A SCORE</span>
            <span className="tag">Preview</span>
          </div>
          <div className="coverage-number">
            {catalog.services.length}
            <span>services in the starter directory</span>
          </div>
          <div className="coverage-row">
            <span>Terms reviews</span>
            <strong>0 published</strong>
          </div>
          <div className="coverage-row">
            <span>Privacy reviews</span>
            <strong>0 published</strong>
          </div>
          <div className="panel-note">
            <strong>Not reviewed is not risk-free.</strong>
            <p>
              Names and homepage links are a starting point, not evidence about
              a service&apos;s policies.
            </p>
          </div>
        </aside>
      </section>
      <section className="notice-strip">
        <div className="shell">
          <strong>A directory today. Evidence-backed explanations next.</strong>
          <span>
            Our first planned review region is the United States. Policy
            applicability has not been verified.
          </span>
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR EVERYDAY TOOLS</span>
            <h2>A starting point for every corner of your digital life.</h2>
          </div>
          <Link className="text-link" href="/services/">
            View all services &rarr;
          </Link>
        </div>
        <div className="category-grid">
          {Object.entries(categoryLabels).map(([category, label], index) => {
            const count = catalog.services.filter(
              (service) => service.category === category,
            ).length;
            return (
              <Link
                className="category-card"
                href={`/services/?category=${category}`}
                key={category}
              >
                <span className="category-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{label}</h3>
                <span className="muted small">
                  {count} {count === 1 ? "service" : "services"}{" "}
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="shell principles section">
        <div>
          <span className="eyebrow">OUR STANDARD</span>
          <h2>
            Show the evidence.
            <br />
            Keep the uncertainty.
          </h2>
        </div>
        <div className="principle">
          <span className="principle-number">01</span>
          <h3>Sources before summaries</h3>
          <p>
            Future explanations need short citations to the exact policy version
            and human editorial review.
          </p>
        </div>
        <div className="principle">
          <span className="principle-number">02</span>
          <h3>No shortcut safety scores</h3>
          <p>
            A documented concern is not a legal verdict. Missing findings never
            mean a service is safe.
          </p>
        </div>
      </section>
    </>
  );
}
