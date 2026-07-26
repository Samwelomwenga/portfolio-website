import { expect, test } from "@playwright/test"

test.describe("portfolio visual smoke checks", () => {
  test("renders the complete one-page portfolio", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /Hey There/i })).toBeVisible()
    await expect(page.getByRole("heading", { name: "About Samwel Omwenga" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "What I bring to projects" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Featured Experience" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Featured Projects" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Featured Blogs" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Let's make something useful together." })).toBeVisible()
    await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled()

    const desktopNav = page.getByRole("navigation", { name: "Primary navigation" })
    if (await desktopNav.isVisible()) {
      const projectsNavLink = desktopNav.getByRole("link", { name: "Projects" })
      await projectsNavLink.click()
      await expect(projectsNavLink).toHaveClass(/active/)
    }

    const hero = page.getByTestId("hero")
    const heroBox = await hero.boundingBox()
    expect(heroBox?.width).toBeGreaterThan(300)
    expect(heroBox?.height).toBeGreaterThan(420)

    await page.getByRole("link", { name: /More projects/i }).click()
    await expect(page.getByRole("heading", { name: "Project Library" })).toBeVisible()
    await page.getByRole("button", { name: /Web Builds/i }).click()
    await expect(page.getByText("Operations Dashboard")).toBeVisible()
    await expect(page.getByText("Booking Flow")).not.toBeVisible()

    await page.goto("/")
    await page.getByRole("link", { name: /More blogs/i }).click()
    await expect(page.getByRole("heading", { name: "Blog Library" })).toBeVisible()
    await page.getByRole("button", { name: /Build Logs/i }).click()
    await expect(page.getByText("Choosing breakpoints around content")).toBeVisible()
    await expect(page.getByText("Why simple portfolio interfaces convert")).not.toBeVisible()

    await page.goto("/")
    const screenshot = await page.screenshot({ fullPage: true })
    expect(screenshot.byteLength).toBeGreaterThan(50_000)
  })
})
