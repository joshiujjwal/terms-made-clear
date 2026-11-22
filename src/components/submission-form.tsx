"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  buildSubmissionIssueUrl,
  type SubmissionService,
} from "../lib/policy-submission";

export function SubmissionForm({
  services,
}: {
  services: readonly SubmissionService[];
}) {
  const query = useSearchParams();
  const [service, setService] = useState<string | null>(null);
  const [kind, setKind] = useState<string | null>(null);
  const [error, setError] = useState("");
  const prefillService = query.get("service") ?? "";
  const prefillKind = query.get("kind") ?? "terms";
  const invalidPrefill =
    (prefillService !== "" &&
      !services.some((entry) => entry.slug === prefillService)) ||
    !["terms", "privacy"].includes(prefillKind) ||
    query.getAll("service").length > 1 ||
    query.getAll("kind").length > 1;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const url = buildSubmissionIssueUrl(
        {
          serviceSlug: form.get("serviceSlug"),
          kind: form.get("kind"),
          sourceUrl: form.get("sourceUrl"),
          region: form.get("region"),
        },
        services,
      );
      window.location.assign(url);
    } catch (cause) {
      if (!(cause instanceof z.ZodError)) throw cause;
      setError(cause.issues.map((issue) => issue.message).join(" "));
    }
  }

  return (
    <form className="submission-form" onSubmit={submit}>
      {invalidPrefill ? (
        <p className="error-notice" role="alert">
          The prefilled service or policy type is invalid. Choose valid values
          below.
        </p>
      ) : null}
      <div className="submission-fields">
        <div>
          <label htmlFor="submission-service">Service</label>
          <select
            id="submission-service"
            name="serviceSlug"
            required
            value={service ?? prefillService}
            onChange={(event) => setService(event.target.value)}
          >
            <option value="">Choose a service</option>
            {services.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="submission-kind">Policy type</label>
          <select
            id="submission-kind"
            name="kind"
            value={kind ?? prefillKind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="terms">Terms of service</option>
            <option value="privacy">Privacy policy</option>
          </select>
        </div>
        <div className="source-field">
          <label htmlFor="submission-url">Official policy URL</label>
          <input
            id="submission-url"
            name="sourceUrl"
            type="url"
            required
            maxLength={2048}
            placeholder="https://..."
            aria-describedby="source-help"
          />
          <p id="source-help" className="small muted">
            Link to the service or its listed provider. No credentials, tokens,
            personal information, or policy text.
          </p>
        </div>
        <div>
          <label htmlFor="submission-region">Applicable region</label>
          <select
            id="submission-region"
            name="region"
            defaultValue="Unknown"
            aria-describedby="region-help"
          >
            <option value="Unknown">Unknown</option>
            <option value="United States">United States</option>
          </select>
          <p id="region-help" className="small muted">
            Keep Unknown unless the source clearly establishes applicability.
          </p>
        </div>
      </div>
      <label className="consent-label">
        <input type="checkbox" required />
        <span>
          I understand this opens a public GitHub issue, not an automatically
          reviewed or published policy.
        </span>
      </label>
      {error ? (
        <p className="error-notice" role="alert">
          {error}
        </p>
      ) : null}
      <button className="button" type="submit">
        Continue on GitHub <span aria-hidden="true">&#8599;</span>
      </button>
      <p className="small muted submission-footnote">
        GitHub sign-in required. You can inspect and edit the issue before
        submitting it.
      </p>
    </form>
  );
}
