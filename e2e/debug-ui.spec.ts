import { test, expect } from "@playwright/test"

test("screenshot homepage to debug visibility issues", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await page.screenshot({ path: "e2e/screenshots/homepage.png", fullPage: true })

  // Check search input is visible
  const searchInput = page.getByPlaceholder("Search songs or artists...")
  await expect(searchInput).toBeVisible()

  // Check toggle switch is visible
  const toggle = page.locator(
    '[aria-label*="theme"], [aria-label*="mode"], [role="switch"], button:has-text("dark"), button:has-text("light")'
  )
  const toggleCount = await toggle.count()
  console.log(`Toggle elements found: ${toggleCount}`)

  // Take a screenshot of just the header area
  const header = page.locator("main > div").first()
  await header.screenshot({ path: "e2e/screenshots/header.png" })

  // Click an album to trigger search
  const firstAlbum = page.locator("button, a, div[role='button']").filter({ hasText: "Daily Mix 1" }).first()
  if (await firstAlbum.isVisible()) {
    await firstAlbum.click()
    await page.waitForTimeout(1000)
    await page.screenshot({ path: "e2e/screenshots/album-clicked.png", fullPage: true })
  }
})
