import { expect, test } from "@playwright/test"

test.describe("terminal portfolio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders the terminal home screen", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Samwel Omwenga/i, level: 1 })).toBeVisible()
    await expect(page.getByText("Software", { exact: true })).toBeVisible()
    await expect(page.getByText("personal ai assistant")).toBeVisible()

    // Tab strip is the primary navigation on every viewport.
    await expect(page.getByRole("tab", { name: "~/home" })).toHaveAttribute("aria-selected", "true")
  })

  test("tab navigation activates and scrolls to a section", async ({ page }) => {
    const projectsTab = page.getByRole("tab", { name: "~/projects" })
    await projectsTab.click()
    await expect(projectsTab).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible()
  })

  test("theme dialog switches palette and persists", async ({ page }) => {
    await page.getByRole("button", { name: /tokyo night/ }).click()
    const dialog = page.getByRole("dialog", { name: "Theme settings" })
    await expect(dialog).toBeVisible()

    await dialog.getByRole("button", { name: "cappuccino" }).click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "cappuccino")

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()

    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "cappuccino")
  })

  test("keyboard shortcut opens the theme dialog", async ({ page }) => {
    await page.keyboard.press("/")
    await expect(page.getByRole("dialog", { name: "Theme settings" })).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: "Theme settings" })).toBeHidden()
  })

  test("color mode toggle updates the effective mode", async ({ page, isMobile }) => {
    const modeGroup = page.getByRole("group", { name: "Color mode" })

    async function pickMode(label: string) {
      // On mobile the switch collapses to the active mode; tap the visible
      // button first to expand it before choosing another mode.
      if (isMobile) {
        await modeGroup.locator("button:visible").first().click()
      }
      await page.getByRole("button", { name: `Use ${label} mode` }).click()
    }

    await pickMode("light")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "light")
    await pickMode("dark")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "dark")
  })

  test("assistant prompt chip echoes and types a response", async ({ page }) => {
    await page.getByRole("button", { name: "recruiter summary" }).click()
    await expect(page.getByText("Summarize my best projects for a recruiter")).toBeVisible()
    await expect(page.getByText(/Samwel Omwenga builds practical product interfaces/)).toBeVisible({ timeout: 15_000 })
  })

  test("project filters narrow the featured cards", async ({ page }) => {
    await page.getByRole("tab", { name: "~/projects" }).click()
    await page.getByRole("button", { name: "apps", exact: true }).click()
    await expect(page.getByRole("heading", { name: "Mobile App Interface" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Portfolio Terminal" })).toBeHidden()
  })

  test("archive route reveals non-featured work and filters it", async ({ page }) => {
    await page.getByRole("button", { name: /More projects/ }).click()
    await expect(page.getByRole("heading", { name: "Project Library" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Operations Dashboard" })).toBeVisible()

    await page.getByRole("button", { name: "systems", exact: true }).click()
    await expect(page.getByRole("heading", { name: "Component Kit" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Operations Dashboard" })).toBeHidden()
  })

  test("blog archive is reachable", async ({ page }) => {
    await page.getByRole("button", { name: /More blogs/ }).click()
    await expect(page.getByRole("heading", { name: "Blog Library" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Choosing breakpoints around content" })).toBeVisible()
  })
})
