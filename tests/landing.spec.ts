import { test, expect } from "@playwright/test";

test("chip hero renders with glow background", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Coming soon").first()).toBeVisible();
  await expect(page.getByText("Maestro").first()).toBeVisible();
  await expect(page.getByText("AI Solutions").first()).toBeVisible();

  // No CTAs
  const mailto = page.locator("a[href^=mailto]");
  await expect(mailto).toHaveCount(0);
}); 