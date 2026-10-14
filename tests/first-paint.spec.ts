import { expect, test } from "@playwright/test"

test.use({ javaScriptEnabled: false })

test("hero copy is visible in the server HTML before hydration", async ({ page }) => {
  await page.goto("/")
  const intro = page.locator("#screen-home p.max-w-\\[62ch\\]")
  await expect(intro).toHaveCount(1)

  const hiddenAncestors = await intro.evaluate((element) => {
    const hidden: string[] = []
    for (let node: Element | null = element; node; node = node.parentElement) {
      if (getComputedStyle(node).opacity === "0")
        hidden.push(node.outerHTML.slice(0, 120))
    }
    return hidden
  })
  expect(hiddenAncestors).toEqual([])
})
