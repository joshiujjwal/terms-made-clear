import Link from "next/link";
import {
  categoryLabels,
  serviceTypeLabels,
  type Service,
} from "../lib/catalog";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-monogram" aria-hidden="true">
          {service.name.slice(0, 1)}
        </span>
        <span className="small muted">
          {serviceTypeLabels[service.serviceType]}
        </span>
      </div>
      <h2>
        <Link href={`/services/${service.slug}/`}>{service.name}</Link>
      </h2>
      <p className="category-label">{categoryLabels[service.category]}</p>
      <div className="review-line">
        <span>Terms</span>
        <span className="review-badge">Not reviewed</span>
      </div>
      <div className="review-line">
        <span>Privacy</span>
        <span className="review-badge">Not reviewed</span>
      </div>
      <Link
        className="card-link"
        href={`/services/${service.slug}/`}
        aria-label={`View coverage for ${service.name}`}
      >
        View coverage <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}
