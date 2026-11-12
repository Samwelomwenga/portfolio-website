import { expect, test } from "@playwright/test"

test("social icons sit level with their link text", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "sidebar is desktop only")
  await page.goto("/")

  const links = page.locator("aside a[href^='http']")
  await expect(links.first()).toBeVisible()

  for (const link of await links.all()) {
    const label = (await link.textContent())?.trim() ?? ""
    const offset = await link.evaluate((el) => {
      const spans = [...el.children] as HTMLElement[]
      const icon = spans.find(span => span.querySelector("svg"))!
      const text = spans.filter(span => span.classList.contains("col-start-2"))
      const top = Math.min(...text.map(span => span.getBoundingClientRect().top))
      const bottom = Math.max(...text.map(span => span.getBoundingClientRect().bottom))
      const box = icon.getBoundingClientRect()
      return Math.abs((box.top + box.bottom) / 2 - (top + bottom) / 2)
    })
    expect.soft(offset, `${label} icon is off-center by ${offset}px`).toBeLessThanOrEqual(1)
  }
})
