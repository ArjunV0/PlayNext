import { expect, test } from "@playwright/test"

test.describe("Auth flow", () => {
  test("homepage is publicly accessible without auth", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("domcontentloaded")
    expect(page.url()).not.toContain("/login")
    await expect(page.locator("header").getByText("PlayNext")).toBeVisible()
  })

  test("login page renders PlayNext branding", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "PlayNext" })).toBeVisible()
    await expect(page.getByText("Sign in to continue")).toBeVisible()
  })

  test("login page renders Google SSO button", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("button", { name: /Continue with Google/i })).toBeVisible()
  })

  test("login page renders magic link form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByPlaceholder("Email address")).toBeVisible()
    await expect(page.getByRole("button", { name: /Sign in with magic link/i })).toBeVisible()
  })

  test("magic link form validates email input", async ({ page }) => {
    await page.goto("/login")
    const emailInput = page.getByPlaceholder("Email address")
    await expect(emailInput).toHaveAttribute("type", "email")
    await expect(emailInput).toHaveAttribute("required", "")
  })

  test("/api/health is accessible without auth", async ({ page }) => {
    const response = await page.goto("/api/health")
    expect(response?.status()).toBe(200)
  })

  test("error param displays error message", async ({ page }) => {
    await page.goto("/login?error=auth_callback_failed")
    await expect(page.getByText("Authentication failed")).toBeVisible()
  })
})
