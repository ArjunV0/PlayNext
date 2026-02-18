import { expect, test } from "@playwright/test"

/** Helper: wait for iTunes data to load and return a locator for a song card */
async function waitForSongCards(page: import("@playwright/test").Page) {
  const songCard = page.locator("main button img[src*='mzstatic.com']").first()
  await expect(songCard).toBeVisible({ timeout: 10000 })
  return songCard
}

/** Helper: click first song card within a section (not search results) */
async function clickFirstSong(page: import("@playwright/test").Page) {
  const card = page
    .locator("main section button")
    .filter({ has: page.locator("img[src*='mzstatic.com']") })
    .first()
  await expect(card).toBeVisible({ timeout: 10000 })
  await card.click()
  return card
}

/** Helper: click song card, then click Play in modal */
async function playSongViaModal(page: import("@playwright/test").Page) {
  await clickFirstSong(page)
  const modal = page.locator("[role='dialog']")
  await expect(modal).toBeVisible({ timeout: 5000 })
  await modal.getByRole("button", { name: "Play" }).click()
  await expect(modal).not.toBeVisible()
}

test("has title", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/PlayNext/)
})

test("displays header with branding, search, and theme toggle", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("header").getByText("PlayNext")).toBeVisible()
  await expect(page.getByPlaceholder("Search songs or artists...")).toBeVisible()
  await expect(page.getByRole("button", { name: /switch to/i })).toBeVisible()
})

test("displays all three song sections with iTunes data", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Selected For You")).toBeVisible()
  await expect(page.getByText("Top Hits Global")).toBeVisible()
  await expect(page.getByText("Top Hits India")).toBeVisible()

  await waitForSongCards(page)
})

test("song cards display real album art from iTunes", async ({ page }) => {
  await page.goto("/")
  await waitForSongCards(page)

  const coverImages = page.locator("img[src*='mzstatic.com']")
  const count = await coverImages.count()
  expect(count).toBeGreaterThanOrEqual(3)
})

test("theme toggle switches between light and dark mode", async ({ page }) => {
  await page.goto("/")
  const toggle = page.getByRole("button", { name: /switch to/i })

  await toggle.click()
  const htmlClass = await page.locator("html").getAttribute("class")
  expect(htmlClass).toContain("dark")

  await toggle.click()
  const htmlClassAfter = await page.locator("html").getAttribute("class")
  expect(htmlClassAfter).not.toContain("dark")
})

test("dark mode changes page background", async ({ page }) => {
  await page.goto("/")
  const toggle = page.getByRole("button", { name: /switch to/i })
  await toggle.click()

  const bodyBg = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(bodyBg).not.toBe("rgb(255, 255, 255)")
})

test("clicking a song opens modal with song details", async ({ page }) => {
  await page.goto("/")
  await clickFirstSong(page)

  const modal = page.locator("[role='dialog']")
  await expect(modal).toBeVisible({ timeout: 5000 })
  await expect(modal.getByRole("button", { name: "Play" })).toBeVisible()
  await expect(modal.getByRole("button", { name: "Close" })).toBeVisible()
})

test("modal Play button starts playback and shows player bar", async ({ page }) => {
  await page.goto("/")
  await playSongViaModal(page)

  const playerBar = page.locator(".fixed.bottom-0")
  await expect(playerBar).toBeVisible()
  await expect(playerBar.getByRole("button", { name: /pause/i })).toBeVisible()
})

test("modal Close button dismisses without playing", async ({ page }) => {
  await page.goto("/")
  await clickFirstSong(page)

  const modal = page.locator("[role='dialog']")
  await expect(modal).toBeVisible({ timeout: 5000 })
  await modal.getByRole("button", { name: "Close" }).click()

  await expect(modal).not.toBeVisible()
  const playerBar = page.locator(".fixed.bottom-0")
  await expect(playerBar).not.toBeVisible()
})

test("next button advances to the next song", async ({ page }) => {
  await page.goto("/")
  await playSongViaModal(page)

  const playerBar = page.locator(".fixed.bottom-0")
  await expect(playerBar).toBeVisible()

  const firstTitle = await playerBar.locator("p.font-medium").textContent()

  await playerBar.getByRole("button", { name: /next/i }).click()

  const secondTitle = await playerBar.locator("p.font-medium").textContent()
  expect(secondTitle).not.toBe(firstTitle)
})

test("player controls work", async ({ page }) => {
  await page.goto("/")
  await playSongViaModal(page)

  const playerBar = page.locator(".fixed.bottom-0")
  await expect(playerBar).toBeVisible()

  const pauseBtn = playerBar.getByRole("button", { name: /pause/i })
  await expect(pauseBtn).toBeVisible()
  await pauseBtn.click()
  await expect(playerBar.getByRole("button", { name: "Play", exact: true })).toBeVisible()

  await expect(playerBar.getByRole("slider", { name: /volume/i })).toBeVisible()
  await expect(playerBar.getByRole("button", { name: /auto-play/i })).toBeVisible()
})

test("search returns real iTunes results", async ({ page }) => {
  await page.goto("/")
  const searchInput = page.getByPlaceholder("Search songs or artists...")
  await searchInput.fill("taylor swift")

  await page.waitForTimeout(500)
  const resultItem = page
    .locator("button")
    .filter({ has: page.locator("img[src*='mzstatic.com']") })
    .first()
  await expect(resultItem).toBeVisible({ timeout: 10000 })
})

test("search shows no results for gibberish", async ({ page }) => {
  await page.goto("/")
  const searchInput = page.getByPlaceholder("Search songs or artists...")
  await searchInput.fill("xyznonexistent99999")

  await page.waitForTimeout(500)
  await expect(page.getByText("No results found")).toBeVisible({ timeout: 5000 })
})

test("progress bar is visible in player", async ({ page }) => {
  await page.goto("/")
  await playSongViaModal(page)

  const progressBar = page.locator("[role='progressbar']")
  await expect(progressBar).toBeVisible()
})
