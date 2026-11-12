import type { Locator } from "@playwright/test"
import { expect, test } from "@playwright/test"

const actionVerb = /^(?:download|view|visit|open|read|join)\b/i

async function boxStyle(locator: Locator) {
  return locator.evaluate((el) => {
    const s = getComputedStyle(el)
    return { background: s.backgroundColor, border: s.borderTopColor, color: s.color }
  })
}

test("project links read as actions and look different from stack badges", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/projects")

  for (const card of await page.locator("article").all()) {
    const badge = await boxStyle(card.locator("[data-project-skill]").first())

    for (const link of await card.locator("a[href^='http']").all()) {
      const label = (await link.textContent())?.trim() ?? ""
      expect.soft(label, `"${label}" should start with a verb`).toMatch(actionVerb)
      expect.soft(await boxStyle(link), `"${label}" looks like a stack badge`).not.toEqual(badge)
    }
  }
})
