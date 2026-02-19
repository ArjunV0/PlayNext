import { test, expect } from "@playwright/test"

test("screenshot homepage to debug visibility issues", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await page.screenshot({ path: "e2e/screenshots/homepage.png", fullPage: true })

  // Check search input is visible (use .first() because responsive layout renders two)
  const searchInput = page.getByPlaceholder("Search songs or artists...").first()
  await expect(searchInput).toBeVisible()

  // Check toggle switch is visible
  const toggle = page.getByRole("button", { name: /switch to/i })
  await expect(toggle).toBeVisible()

  // Take a screenshot of just the header area
  const header = page.locator("header").first()
  await header.screenshot({ path: "e2e/screenshots/header.png" })

  // Click a song card if available
  const firstSong = page
    .locator("main section button")
    .filter({ has: page.locator("img[src*='mzstatic.com']") })
    .first()
  if (await firstSong.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstSong.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: "e2e/screenshots/song-clicked.png", fullPage: true })
  }
})
