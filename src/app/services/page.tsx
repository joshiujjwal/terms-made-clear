import type { Metadata } from "next";
import { CatalogBrowser } from "../../components/catalog-browser";
import { catalog } from "../../lib/data";

export const metadata: Metadata = { title: "Service catalog" };

export default function ServicesPage() {
  return (
    <div className="shell section">
      <div className="page-heading">
        <span className="eyebrow">THE STARTER DIRECTORY</span>
        <h1>
          Your tools.
          <br />
          <em>A clearer starting point.</em>
        </h1>
        <p>
          Browse {catalog.services.length} curated apps, websites, and projects.
          This is not a popularity ranking.
        </p>
      </div>
      <div className="notice">
        <strong>Every service below is unreviewed.</strong> No policy summaries
        or findings are published. A listing does not imply safety, endorsement,
        or confirmed policy applicability.
      </div>
      <CatalogBrowser services={catalog.services} />
    </div>
  );
}
