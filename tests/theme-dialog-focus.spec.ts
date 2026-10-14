import type { Locator } from "@playwright/test"
import { expect, test } from "@playwright/test"

async function waitForHydration(locator: Locator) {
  await expect.poll(() => locator.evaluate(node => Object.keys(node).some(key => key.startsWith("__reactFiber")))).toBe(true)
}

test("theme launcher does not take focus on page load", async ({ page }) => {
  await page.goto("/")

  const launcher = page.getByRole("button", { name: /\[\/\]/ })
  await waitForHydration(launcher)
  await page.waitForTimeout(500)
  await expect(launcher).not.toBeFocused()
})

test("closing the theme dialog returns focus to the launcher", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  await page.keyboard.press("t")
  const dialog = page.getByRole("dialog", { name: "Theme settings" })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator("button[aria-pressed=\"true\"]")).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(page.getByRole("button", { name: /\[\/\]/ })).toBeFocused()
})
