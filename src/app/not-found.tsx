import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="shell section reading-page">
      <span className="eyebrow">404 / NOT IN THE DIRECTORY</span>
      <h1>Page not found</h1>
      <p>
        This page does not exist. A missing service is not a statement about its
        policies.
      </p>
      <Link className="button primary" href="/services/">
        Back to the catalog &rarr;
      </Link>
    </div>
  );
}
