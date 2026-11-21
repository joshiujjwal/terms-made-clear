import { expect, test } from "@playwright/test";

test("should show the homepage limitations when opening the exported site", async ({
  page,
}, testInfo) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", {
      name: "Know the service. Understand the tradeoffs.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("30 services. No published policy reviews yet."),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("homepage-desktop.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Browse the catalog", exact: true })
    .click();
  await expect(page.getByLabel("Search services")).toBeVisible();
});

test("should search and preserve history when filters change", async ({
  page,
}) => {
  await page.goto("./services/");
  await page.getByLabel("Search services").fill("gItHuB");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("1 service");
  await page.getByLabel("Category").selectOption("social");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("heading", { name: "No matching services" }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Category")).toHaveValue("");
});

test("should preserve category filters when navigating pages", async ({
  page,
}) => {
  await page.goto("./services/?category=developer");
  await expect(page.getByRole("status")).toContainText("5 services");
  await expect(page.getByRole("link", { name: "Next page" })).toHaveCount(0);
  await page.goto("./services/");
  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByRole("status")).toContainText("Page 2 of 2");
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Page 2 of 2");
});

test("should display explicit errors when shared parameters are malformed", async ({
  page,
}) => {
  await page.goto("./services/?page=0");
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Could not apply these filters." }),
  ).toContainText("Page must be a positive whole number.");
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("30 services");
});

test("should show separate missing policy coverage when visiting a direct detail URL", async ({
  page,
}) => {
  await page.goto("./services/github/");
  await expect(
    page.getByRole("heading", { name: "GitHub", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Terms of service" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Privacy policy" }),
  ).toBeVisible();
  await expect(page.getByText("Not reviewed", { exact: true })).toHaveCount(2);
  await expect(
    page.getByText("No findings is not a safety endorsement."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Visit official website" }),
  ).toHaveAttribute("href", "https://github.com/");
});

test("should return a real not-found response when a service is unknown", async ({
  page,
}) => {
  const response = await page.goto("./services/no-such-service/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});

test("should keep navigation keyboard accessible when viewed on mobile", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("homepage-mobile.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Methodology", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Evidence before explanations." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Corrections", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("link", { name: "Open a correction issue" }),
  ).toHaveAttribute(
    "href",
    /github\.com\/joshiujjwal\/terms-made-clear\/issues\/new/,
  );
});

test("should treat markup as literal search text when a shared query contains HTML", async ({
  page,
}) => {
  await page.goto("./services/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E");
  await expect(
    page.getByRole("heading", { name: "No matching services" }),
  ).toBeVisible();
  await expect(page.getByLabel("Search services")).toHaveValue(
    "<script>alert(1)</script>",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("should expose all detail links when interactive filtering is unavailable", async ({
    page,
  }) => {
    await page.goto("./services/");
    await expect(page.locator("noscript .notice")).toContainText(
      "Interactive search and pagination require JavaScript.",
    );
    await page
      .locator("noscript")
      .getByRole("link", { name: "YouTube", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "YouTube", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Not reviewed", { exact: true })).toHaveCount(
      2,
    );
  });
});
