import { z } from "zod";

const sensitiveQueryKeys = new Set([
  "token",
  "access_token",
  "password",
  "secret",
  "api_key",
  "key",
  "session",
  "session_id",
  "email",
  "authorization",
]);

export const policyUrlSchema = z
  .url()
  .max(2048)
  .pipe(
    z.string().refine((value) => {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      return (
        url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        (!url.port || url.port === "443") &&
        !/\s/.test(value) &&
        host.includes(".") &&
        !host.endsWith(".local") &&
        !host.endsWith(".localhost") &&
        !host.endsWith(".internal") &&
        !/^[\d.]+$/.test(host) &&
        !host.includes(":") &&
        !Array.from(url.searchParams.keys()).some((key) =>
          sensitiveQueryKeys.has(key.toLowerCase()),
        )
      );
    }, "Use a public HTTPS policy URL without credentials, private hosts, custom ports, or sensitive query parameters."),
  );
