import type { Locator } from "@playwright/test"
import { expect, test } from "@playwright/test"

function lastUnitShift(paragraph: Locator) {
  return paragraph.evaluate((element) => {
    const unit = [...element.querySelectorAll("[data-roll-unit]")].at(-1)
    if (!unit)
      return null
    const { top } = unit.getBoundingClientRect()
    const mask = unit.parentElement!.getBoundingClientRect()
    return Math.round(((top - mask.top) / mask.height) * 100)
  })
}

test("hero intro rolls into place on load", async ({ page }) => {
  await page.goto("/")
  const intro = page.locator("#screen-home p.max-w-\\[62ch\\]")
  await expect.poll(() => lastUnitShift(intro), { timeout: 10_000 }).toBe(0)
})

test("paragraph words roll on hover and settle back", async ({ page, isMobile }) => {
  test.skip(isMobile, "hover rolls are pointer-only")
  await page.goto("/")
  const paragraph = page.locator("#screen-about p").first()
  await paragraph.scrollIntoViewIfNeeded()
  await expect.poll(() => lastUnitShift(paragraph)).toBe(0)

  await paragraph.hover()
  await expect.poll(() => lastUnitShift(paragraph), { timeout: 10_000 }).toBe(-100)

  await page.mouse.move(0, 0)
  await expect.poll(() => lastUnitShift(paragraph), { timeout: 10_000 }).toBe(0)
})

test("paragraph rolls keep the full text in the accessibility tree", async ({ page }) => {
  await page.goto("/")
  const paragraph = page.locator("#screen-about p").first()
  const text = await paragraph.evaluate(element => element.querySelector(".sr-only")?.textContent ?? "")
  expect(text.length).toBeGreaterThan(20)
  await expect(paragraph.locator("[data-roll-unit]").first()).toHaveAttribute("aria-hidden", "true")
})
