import { test, expect } from "@playwright/test";

test("hero, typewriters en scroll secties renderen", async ({ page }) => {
  await page.goto("/");

  // Hero
  await expect(page.getByText("Maestro AI").first()).toBeVisible();
  await expect(page.getByText("Orchestrating Agentic AI Solutions").first()).toBeVisible();

  // Compose typewriter
  await expect(page.getByText("Compose...").first()).toBeVisible();

  // Orchestrate/Automate koppen
  await expect(page.getByText("Orchestrate").first()).toBeVisible();
  await expect(page.getByText("Automate").first()).toBeVisible();

  // Footer typewriter
  await expect(page.getByText("More to come...").first()).toBeVisible();
}); 