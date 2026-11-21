import Link from "next/link";
import {
  categoryLabels,
  serviceTypeLabels,
  type Service,
} from "../lib/catalog";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <article className="service-row">
      <div className="service-identity">
        <h2>
          <Link href={`/services/${service.slug}/`}>{service.name}</Link>
        </h2>
        <p className="service-platform">
          {serviceTypeLabels[service.serviceType]}
        </p>
      </div>
      <p className="service-category">{categoryLabels[service.category]}</p>
      <p className="policy-status">
        <span className="policy-kind">Terms</span>
        <span>Not reviewed</span>
      </p>
      <p className="policy-status">
        <span className="policy-kind">Privacy</span>
        <span>Not reviewed</span>
      </p>
    </article>
  );
}
