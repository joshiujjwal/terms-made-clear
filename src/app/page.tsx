import Link from "next/link";
import { ServiceRow } from "../components/service-row";
import { categoryLabels } from "../lib/catalog";
import { catalog } from "../lib/data";
import { sitePath } from "../lib/site";

export default function HomePage() {
  const sample = catalog.services
    .toSorted((a, b) => a.name.localeCompare(b.name, "en"))
    .slice(0, 4);

  return (
    <>
      <section className="shell introduction">
        <div className="introduction-copy">
          <h1>
            Before
            <br />
            you <span className="marked-word">agree.</span>
          </h1>
          <p className="introduction-deck">
            The apps you use have terms. We&apos;re building a guide to what
            they say, what they leave open, and where to check for yourself.
          </p>
        </div>
        <div className="search-entry">
          <form action={sitePath("/services/")} method="get">
            <label htmlFor="home-search">Search services</label>
            <p className="search-description">
              {catalog.services.length} apps, websites, and projects in one
              directory.
            </p>
            <input
              id="home-search"
              name="q"
              type="search"
              maxLength={200}
              placeholder="A service you use"
            />
            <button className="button primary" type="submit">
              Find a service <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
          <p className="search-examples">
            Try <Link href="/services/?q=github">GitHub</Link>,{" "}
            <Link href="/services/?q=youtube">YouTube</Link>, or{" "}
            <Link href="/services/?q=whatsapp">WhatsApp</Link>.
          </p>
          <div className="coverage-note">
            <p>No published policy reviews yet.</p>
            <p>
              This is a starter directory. A listing is not a safety assessment.
            </p>
          </div>
        </div>
      </section>
      <section className="shell directory-preview">
        <div className="section-heading">
          <div>
            <h2>From the directory</h2>
            <p className="muted">
              A sample, listed alphabetically. Not a popularity ranking.
            </p>
          </div>
          <Link className="text-link" href="/services/">
            Browse the catalog <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="directory-layout">
          <div className="sample-directory">
            <div className="directory-columns" aria-hidden="true">
              <span>Service</span>
              <span>Category</span>
              <span>Terms</span>
              <span>Privacy</span>
            </div>
            {sample.map((service) => (
              <ServiceRow service={service} key={service.slug} />
            ))}
          </div>
          <nav className="category-index" aria-label="Browse by category">
            <h3>Browse by category</h3>
            {Object.entries(categoryLabels).map(([category, label]) => {
              const count = catalog.services.filter(
                (service) => service.category === category,
              ).length;
              return (
                <Link href={`/services/?category=${category}`} key={category}>
                  <span>{label}</span>
                  <span className="category-count">
                    {count}
                    <span className="sr-only">
                      {" "}
                      {count === 1 ? "service" : "services"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
      <section className="shell review-standard">
        <div>
          <h2>What a review will need</h2>
          <Link className="text-link" href="/methodology/">
            Read the methodology <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div>
          <p>
            A source, an exact policy version, and a human editor. Every
            explanation will need a citation; unknown dates and regional
            exceptions will stay visible.
          </p>
          <p className="small muted">
            Our first planned review region is the United States. Policy
            applicability has not been verified. No findings does not mean no
            risks, and a concern is not a legal verdict.
          </p>
        </div>
      </section>
    </>
  );
}
