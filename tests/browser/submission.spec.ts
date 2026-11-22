import { expect, test } from "@playwright/test";

test("should keep source navigation within the viewport when the screen is 320 pixels wide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("./submit/");
  await expect(
    page.getByRole("link", { name: "Suggest a source", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("should prefill a public issue when a contributor submits an official URL", async ({
  page,
}) => {
  await page.goto("./submit/?service=github&kind=terms");
  await expect(page.getByLabel("Service", { exact: true })).toHaveValue(
    "github",
  );
  await page
    .getByLabel("Official policy URL")
    .fill(
      "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service",
    );
  await page
    .getByLabel("I understand this opens a public GitHub issue")
    .check();
  await page.route("https://github.com/**", async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("service")).toBe("github");
    expect(url.searchParams.get("policy-url")).toContain(
      "github-terms-of-service",
    );
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<h1>GitHub issue handoff</h1>",
    });
  });
  await page.getByRole("button", { name: "Continue on GitHub" }).click();
  await expect(
    page.getByRole("heading", { name: "GitHub issue handoff" }),
  ).toBeVisible();
});

test("should show an error without navigating when a source host is not official", async ({
  page,
}) => {
  await page.goto("./submit/");
  await page.getByLabel("Service", { exact: true }).selectOption("github");
  await page
    .getByLabel("Official policy URL")
    .fill("https://example.com/terms");
  await page
    .getByLabel("I understand this opens a public GitHub issue")
    .check();
  await page.getByRole("button", { name: "Continue on GitHub" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Policy host" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/submit\//);
});

test("should expose source progress but not draft claims when visiting a researched service", async ({
  page,
}) => {
  await page.goto("./services/github/");
  await expect(
    page.getByRole("link", { name: "Read original terms" }),
  ).toBeVisible();
  await expect(
    page.getByText("Draft awaiting human review", { exact: true }),
  ).toHaveCount(2);
  await expect(
    page.getByText(
      "No summary, citations, or documented findings have been published.",
    ),
  ).toHaveCount(2);
  await expect(
    page.getByText("You own Your Content.", { exact: false }),
  ).toHaveCount(0);
  expect(await page.content()).not.toContain(
    "Owning your content and granting service licenses",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("should expose the direct GitHub form when client scripting is unavailable", async ({
    page,
  }) => {
    await page.goto("./submit/");
    await expect(
      page.getByRole("link", { name: "Use the GitHub issue form directly" }),
    ).toHaveAttribute("href", /template=policy-submission.yml/);
    await expect(
      page.getByText("Submissions are public. Reviews are not automatic."),
    ).toBeVisible();
  });
});

test("should expose local document provenance without publishing claims when visiting Apple Developer", async ({
  page,
}, testInfo) => {
  await page.goto("./services/?q=apple");
  await page
    .getByRole("link", { name: "Apple Developer", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Apple Developer", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Draft awaiting human review", { exact: true }),
  ).toHaveCount(1);
  await expect(page.getByText("Not reviewed", { exact: true })).toHaveCount(2);
  await expect(
    page.getByText("No verified source URL; supplied PDF only.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read original terms" }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "Apple Developer Program License Agreement. LYL262; printed date 2026-10-29; 132 pages.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Recorded locally 2026-11-22; original retrieval date unknown",
      { exact: true },
    ),
  ).toBeVisible();
  expect(await page.content()).not.toContain(
    "Apple may change the Program Requirements",
  );
  expect(await page.content()).not.toContain(
    "Budget for an annual membership cost",
  );
  const effectiveDate = page
    .locator("dl > div")
    .filter({ has: page.getByText("Effective date", { exact: true }) });
  await expect(effectiveDate).toHaveText([
    "Effective dateUnknown",
    "Effective dateUnknown",
  ]);
  await page.screenshot({
    path: testInfo.outputPath("apple-developer-desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("apple-developer-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Suggest an updated source" }).click();
  await expect(page.getByLabel("Service", { exact: true })).toHaveValue(
    "apple-developer",
  );
  await page
    .getByLabel("Official policy URL")
    .fill("https://developer.apple.com/support/terms/");
  await page
    .getByLabel("I understand this opens a public GitHub issue")
    .check();
  await page.route("https://github.com/**", async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("service")).toBe("apple-developer");
    expect(url.searchParams.get("policy-url")).toBe(
      "https://developer.apple.com/support/terms/",
    );
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<h1>Apple source handoff</h1>",
    });
  });
  await page.getByRole("button", { name: "Continue on GitHub" }).click();
  await expect(
    page.getByRole("heading", { name: "Apple source handoff" }),
  ).toBeVisible();
});
