import { expect, test } from "@playwright/test"

test.describe("portfolio visual smoke checks", () => {
  test("renders the complete one-page portfolio", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /Hey There/i })).toBeVisible()
    await expect(page.getByRole("heading", { name: "What do I help?" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "My Work Experience" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "My Latest Works" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "People talk about us" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Design Notes" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled()

    const hero = page.getByTestId("hero")
    const heroBox = await hero.boundingBox()
    expect(heroBox?.width).toBeGreaterThan(300)
    expect(heroBox?.height).toBeGreaterThan(420)

    const screenshot = await page.screenshot({ fullPage: true })
    expect(screenshot.byteLength).toBeGreaterThan(50_000)
  })
})
