"use client";

import { useSyncExternalStore, type FormEvent } from "react";
import {
  CatalogInputError,
  categoryLabels,
  searchCatalog,
  type Service,
} from "../lib/catalog";
import { sitePath } from "../lib/site";
import { ServiceCard } from "./service-card";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("catalog:navigate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("catalog:navigate", callback);
  };
}

function getSearch() {
  return window.location.search;
}

function serverSearch() {
  return "";
}

function pageHref(parameters: URLSearchParams, page: number) {
  const next = new URLSearchParams(parameters);
  next.set("page", String(page));
  return `?${next.toString()}`;
}

export function CatalogBrowser({ services }: { services: Service[] }) {
  const search = useSyncExternalStore(subscribe, getSearch, serverSearch);
  const parameters = new URLSearchParams(search);
  let result: ReturnType<typeof searchCatalog> | undefined;
  let errorMessage: string | undefined;
  try {
    result = searchCatalog(services, parameters);
  } catch (error) {
    if (!(error instanceof CatalogInputError)) throw error;
    errorMessage = error.message;
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const query = String(form.get("q") ?? "");
    const category = String(form.get("category") ?? "");
    if (query) next.set("q", query);
    if (category) next.set("category", category);
    const value = next.toString();
    window.history.pushState(
      null,
      "",
      `${sitePath("/services/")}${value ? `?${value}` : ""}`,
    );
    window.dispatchEvent(new Event("catalog:navigate"));
  }

  return (
    <>
      <form className="filter-bar" onSubmit={applyFilters} key={search}>
        <div className="search-field">
          <label htmlFor="search">Search services</label>
          <input
            id="search"
            name="q"
            type="search"
            maxLength={200}
            placeholder="Try GitHub, Spotify, or Signal"
            defaultValue={parameters.get("q") ?? ""}
          />
        </div>
        <div className="category-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={result?.category ?? ""}
          >
            <option value="">All categories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button className="button primary" type="submit">
          Apply filters
        </button>
        <a className="text-link clear-filters" href={sitePath("/services/")}>
          Clear filters
        </a>
      </form>
      {errorMessage ? (
        <div className="error-notice" role="alert">
          <strong>Could not apply these filters.</strong>
          <p>{errorMessage}</p>
        </div>
      ) : null}
      {result ? (
        <>
          <div className="results-bar">
            <p role="status" aria-live="polite">
              {result.total} {result.total === 1 ? "service" : "services"}{" "}
              <span className="muted">
                / Page {result.page} of {result.totalPages}
              </span>
            </p>
            <span className="small muted">
              Alphabetical &middot; Unreviewed directory
            </span>
          </div>
          {result.total ? (
            <div className="service-grid">
              {result.services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No matching services</h2>
              <p>
                Try a different name or category. Missing coverage is not a
                safety assessment.
              </p>
            </div>
          )}
          {result.totalPages > 1 ? (
            <nav className="pagination" aria-label="Catalog pages">
              {result.page > 1 ? (
                <a
                  className="button secondary"
                  href={pageHref(parameters, result.page - 1)}
                >
                  Previous page
                </a>
              ) : (
                <span />
              )}
              <span>
                Page {result.page} of {result.totalPages}
              </span>
              {result.page < result.totalPages ? (
                <a
                  className="button secondary"
                  href={pageHref(parameters, result.page + 1)}
                >
                  Next page
                </a>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </>
      ) : null}
      <noscript>
        <div className="notice">
          Interactive search and pagination require JavaScript. All services are
          listed below with working detail links.
        </div>
        <ul>
          {services.map((service) => (
            <li key={service.slug}>
              <a href={sitePath(`/services/${service.slug}/`)}>
                {service.name}
              </a>{" "}
              - terms and privacy not reviewed
            </li>
          ))}
        </ul>
      </noscript>
    </>
  );
}
