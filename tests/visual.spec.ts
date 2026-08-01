import { expect, test } from "@playwright/test"

test.describe("terminal portfolio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders the terminal home screen", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Samwel Omwenga/i, level: 1 })).toBeVisible()
    // "Software" renders via <TerminalText>, which keeps a visually-hidden full
    // copy for screen readers plus an animated copy — two matches. Take the
    // first (the screen-reader copy, always the full string) so the duplicate
    // doesn't trip strict mode.
    await expect(page.getByText("Software", { exact: true }).first()).toBeVisible()
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

  test("skills show brand icons", async ({ page }) => {
    await page.getByRole("tab", { name: "~/skills" }).click()

    for (const skill of ["HTML5", "React", "Git"]) {
      await expect(page.locator(`[data-skill="${skill}"] svg`)).toBeVisible()
    }
  })

  test("experience timeline reveals the featured role", async ({ page }) => {
    await page.getByRole("tab", { name: "~/experience" }).click()

    await expect(page.getByRole("heading", { name: "Featured Experience" })).toBeVisible()
    await expect(page.getByText("Africa Cloud Space", { exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Full-Stack Developer" })).toBeVisible()
  })

  test("theme dialog switches palette and persists", async ({ page }) => {
    await page.getByRole("button", { name: /tokyo/ }).click()
    const dialog = page.getByRole("dialog", { name: "Theme settings" })
    await expect(dialog).toBeVisible()

    await dialog.getByRole("button", { name: "catppuccin", exact: true }).click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "catppuccin")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "dark")

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()

    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "catppuccin")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "dark")
  })

  test("theme dialog exposes the Herdr theme catalog", async ({ page }) => {
    await page.getByRole("button", { name: /tokyo/ }).click()
    const dialog = page.getByRole("dialog", { name: "Theme settings" })

    for (const theme of [
      "terminal",
      "dracula",
      "nord",
      "one dark",
      "rose pine",
      "catppuccin latte",
      "tokyo day",
      "gruvbox light",
      "one light",
      "kanagawa lotus",
      "rose pine dawn",
    ]) {
      await expect(dialog.getByRole("button", { name: theme, exact: true })).toBeVisible()
    }
  })

  test("theme dialog exposes downloaded VS Code themes", async ({ page }) => {
    await page.getByRole("button", { name: /tokyo/ }).click()
    const dialog = page.getByRole("dialog", { name: "Theme settings" })

    for (const theme of [
      "Night Owl",
      "Better Solarized Dark",
      "Better Selenized Dark",
      "poimandres",
      "poimandres-storm",
      "Sapphire (Dim)",
      "City Lights",
      "Winter is Coming (Dark Black)",
      "Vue Theme High Contrast",
      "Dark (Visual Studio - C/C++)",
      "Visual Studio 2019 Light",
    ]) {
      await expect(dialog.getByRole("button", { name: theme, exact: true })).toBeVisible()
    }

    await expect(dialog.getByRole("button", { name: /No Italics|Italics/ })).toHaveCount(0)
  })

  test("theme catalog scrolls within the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 720 })
    await page.getByRole("button", { name: /tokyo/ }).click()

    const dialog = page.getByRole("dialog", { name: "Theme settings" })
    const metrics = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const scroller = element.querySelector<HTMLElement>("[data-theme-list]")

      return {
        dialogHeight: rect.height,
        viewportHeight: window.innerHeight,
        listCanScroll: scroller ? scroller.scrollHeight > scroller.clientHeight : false,
        listOverflow: scroller ? getComputedStyle(scroller).overflowY : "",
      }
    })

    expect(metrics.dialogHeight).toBeLessThanOrEqual(metrics.viewportHeight)
    expect(metrics.listCanScroll).toBe(true)
    expect(metrics.listOverflow).toMatch(/auto|scroll/)
  })

  test("selecting a light catalog theme sets light mode", async ({ page }) => {
    await page.getByRole("button", { name: /tokyo/ }).click()
    const dialog = page.getByRole("dialog", { name: "Theme settings" })

    await dialog.getByRole("button", { name: "Night Owl Light", exact: true }).click()
    await expect(page.locator("html")).toHaveAttribute("data-theme", "night-owl")
    await expect(page.locator("html")).toHaveAttribute("data-mode", "light")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "light")
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

  test("auto mode falls back to dark when color scheme media is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: undefined,
      })
    })
    await page.goto("/")

    await expect(page.locator("html")).toHaveAttribute("data-mode", "auto")
    await expect(page.locator("html")).toHaveAttribute("data-effective-mode", "dark")
  })

  test("assistant prompt chip echoes and types a response", async ({ page }) => {
    await page.getByRole("button", { name: "recruiter summary" }).click()
    await expect(page.getByText("Summarize my best projects for a recruiter")).toBeVisible()
    await expect(page.getByText(/Samwel Omwenga is a software engineer at Africa Cloud Space/)).toBeVisible({ timeout: 15_000 })
  })

  test("projects section lists the featured cards", async ({ page }) => {
    await page.getByRole("tab", { name: "~/projects" }).click()
    await expect(page.getByRole("heading", { name: "Learning Portal Redesign" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "eTIMS Integration" })).toBeVisible()
  })

  test("contact form exposes labeled fields and a live status region", async ({ page }) => {
    await page.getByRole("tab", { name: "~/contact" }).click()

    await expect(page.getByRole("heading", { name: "Contact", exact: true })).toBeVisible()
    await expect(page.getByLabel("name")).toBeVisible()
    await expect(page.getByLabel("email")).toBeVisible()
    await expect(page.getByLabel("message")).toBeVisible()
    await expect(page.getByRole("button", { name: "send message" })).toBeVisible()
    // The submit-state feedback lives in a persistent aria-live region so the
    // idle → submitting → success/error swap is announced, not just animated.
    await expect(page.getByRole("status")).toBeVisible()
  })

  test("archive route reveals non-featured work", async ({ page }) => {
    await page.goto("/#/projects")
    await expect(page.getByRole("heading", { name: "Project Library" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Portfolio Terminal" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "eTIMS Integration" })).toBeVisible()
  })

  test("blog archive is reachable", async ({ page }) => {
    await page.goto("/#/blogs")
    await expect(page.getByRole("heading", { name: "Blog Library" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "React Native navigation with Expo Router" })).toBeVisible()
  })
})
