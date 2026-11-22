import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  GitHubApiError,
  runPolicyIntake,
  type IntakeApi,
} from "../../src/lib/policy-intake";

const services = [
  { slug: "sample", name: "Sample", website: "https://example.com/" },
];
const repo = "joshiujjwal/terms-made-clear";
const issueBody =
  "### Service\nsample\n\n### Policy type\nterms\n\n### Policy URL\nhttps://example.com/terms\n\n### Applicable region\nUnknown\n\n### Confirmation\n- [X] I understand submissions are public and are not automatically reviewed or published.";
const event = {
  action: "labeled",
  label: { name: "policy-accepted" },
  sender: { login: "editor" },
  issue: { number: 123, body: issueBody },
};

function fakeApi(
  options: {
    permission?: string;
    existingPr?: boolean;
    failFile?: boolean;
    failPr?: boolean;
    storedFile?: "same" | "changed";
  } = {},
) {
  const calls: { method: string; path: string; body?: unknown }[] = [];
  const api: IntakeApi = {
    async request(method, path, body) {
      calls.push({ method, path, body });
      if (path.endsWith("/permission"))
        return { permission: options.permission ?? "write" };
      if (method === "GET" && path.endsWith("/issues/123"))
        return {
          state: "open",
          body: issueBody,
          created_at: "2026-11-21T12:00:00Z",
          labels: [{ name: "policy-submission" }, { name: "policy-accepted" }],
        };
      if (path.includes("/pulls?"))
        return options.existingPr
          ? [{ number: 456, html_url: `https://github.com/${repo}/pull/456` }]
          : [];
      if (path.includes("/git/ref/heads/policy-source-issue-")) {
        if (options.storedFile) return { object: { sha: "a".repeat(40) } };
        throw new GitHubApiError(404);
      }
      if (
        path.includes("/contents/") &&
        method === "GET" &&
        options.storedFile
      ) {
        return {
          encoding: "base64",
          content: Buffer.from(
            JSON.stringify({
              serviceSlug: "sample",
              kind: "terms",
              sourceUrl: `https://example.com/${options.storedFile === "changed" ? "changed" : "terms"}`,
              region: "Unknown",
              schemaVersion: 1,
              issueNumber: 123,
              issueUrl: `https://github.com/${repo}/issues/123`,
              submittedAt: "2026-11-21T12:00:00Z",
              status: "unverified",
              editorialApproval: null,
            }),
          ).toString("base64"),
        };
      }
      if (path === `/repos/${repo}`) return { default_branch: "main" };
      if (path.endsWith("/git/ref/heads/main"))
        return { object: { sha: "a".repeat(40) } };
      if (method === "PUT" && options.failFile) throw new GitHubApiError(500);
      if (method === "POST" && path.endsWith("/pulls")) {
        if (options.failPr) throw new GitHubApiError(500);
        return { number: 456, html_url: `https://github.com/${repo}/pull/456` };
      }
      return {};
    },
  };
  return { api, calls };
}

describe("maintainer-gated intake", () => {
  it("should create one draft PR when a writer accepts a valid issue", async () => {
    const { api, calls } = fakeApi();
    const result = await runPolicyIntake(event, repo, services, api);
    expect(result.reused).toBe(false);
    const pr = calls.find(
      (call) => call.method === "POST" && call.path.endsWith("/pulls"),
    );
    expect(pr?.body).toMatchObject({
      draft: true,
      head: "policy-source-issue-123",
      base: "main",
    });
    const file = calls.find((call) => call.method === "PUT");
    expect(file?.path).toBe(
      `/repos/${repo}/contents/data/submissions/issue-123.json`,
    );
    const value = z.object({ content: z.string() }).parse(file?.body);
    const candidate = JSON.parse(
      Buffer.from(value.content, "base64").toString(),
    );
    expect(candidate).toMatchObject({
      status: "unverified",
      editorialApproval: null,
      sourceUrl: "https://example.com/terms",
    });
    expect(candidate).not.toHaveProperty("points");
  });
  it("should reject acceptance when the actor only has read permission", async () => {
    const { api, calls } = fakeApi({ permission: "read" });
    await expect(runPolicyIntake(event, repo, services, api)).rejects.toThrow(
      "write",
    );
    expect(calls.filter((call) => call.method !== "GET")).toHaveLength(0);
  });
  it("should reuse the existing PR when acceptance is repeated", async () => {
    const { api, calls } = fakeApi({ existingPr: true });
    expect((await runPolicyIntake(event, repo, services, api)).reused).toBe(
      true,
    );
    expect(calls.filter((call) => call.method !== "GET")).toHaveLength(0);
  });
  it("should preserve the recovery branch when saving its file fails", async () => {
    const { api, calls } = fakeApi({ failFile: true });
    await expect(runPolicyIntake(event, repo, services, api)).rejects.toThrow(
      "500",
    );
    expect(
      calls.some(
        (call) =>
          call.method === "DELETE" &&
          call.path.endsWith("/git/refs/heads/policy-source-issue-123"),
      ),
    ).toBe(false);
    expect(
      calls.some(
        (call) => call.path.endsWith("/pulls") && call.method === "POST",
      ),
    ).toBe(false);
  });
  it("should preserve the candidate branch when the PR API fails after a commit", async () => {
    const { api, calls } = fakeApi({ failPr: true });
    await expect(runPolicyIntake(event, repo, services, api)).rejects.toThrow(
      "500",
    );
    expect(calls.some((call) => call.method === "DELETE")).toBe(false);
  });
  it("should reject another label when the event is not policy acceptance", async () => {
    const { api, calls } = fakeApi();
    await expect(
      runPolicyIntake(
        { ...event, label: { name: "other" } },
        repo,
        services,
        api,
      ),
    ).rejects.toThrow();
    expect(calls).toHaveLength(0);
  });
  it("should reject a changed issue when its body no longer matches the accepted event", async () => {
    const { api, calls } = fakeApi();
    await expect(
      runPolicyIntake(
        {
          ...event,
          issue: {
            ...event.issue,
            body: issueBody.replace("/terms", "/different"),
          },
        },
        repo,
        services,
        api,
      ),
    ).rejects.toThrow("changed");
    expect(calls.filter((call) => call.method !== "GET")).toHaveLength(0);
  });
  it("should preserve reviewer edits when an interrupted branch contains a changed candidate", async () => {
    const { api, calls } = fakeApi({ storedFile: "changed" });
    await expect(runPolicyIntake(event, repo, services, api)).rejects.toThrow(
      "not be overwritten",
    );
    expect(calls.filter((call) => call.method !== "GET")).toHaveLength(0);
  });
  it("should recover draft PR creation when an interrupted branch contains the unchanged candidate", async () => {
    const { api, calls } = fakeApi({ storedFile: "same" });
    expect((await runPolicyIntake(event, repo, services, api)).reused).toBe(
      false,
    );
    expect(calls.filter((call) => call.method === "PUT")).toHaveLength(0);
    expect(calls.filter((call) => call.method === "POST")).toHaveLength(1);
  });
});
