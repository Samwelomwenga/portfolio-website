import { expect, test } from "@playwright/test"

const isRecaptchaRequest = (url: string) => /google\.com\/recaptcha|recaptcha\.net|gstatic\.com\/recaptcha/.test(url)

test("reCAPTCHA loads only after the visitor engages the contact form", async ({ page }) => {
  const recaptchaUrls: string[] = []
  page.on("request", (request) => {
    if (isRecaptchaRequest(request.url()))
      recaptchaUrls.push(request.url())
  })

  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(5_000)
  expect(recaptchaUrls).toEqual([])

  await page.getByLabel("name").focus()
  await expect.poll(() => recaptchaUrls.length).toBeGreaterThan(0)
})

test("contact form submits a reCAPTCHA token to Formspree", async ({ page }) => {
  let body = ""
  await page.route(/formspree\.io/, async (route) => {
    body = route.request().postDataBuffer()?.toString() ?? ""
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" },
      body: JSON.stringify({ next: "https://formspree.io/thanks" }),
    })
  })

  await page.goto("/")
  await page.getByLabel("name").fill("Test")
  await page.getByLabel("email").fill("test@example.com")
  await page.getByLabel("message").fill("Hello")
  await page.getByRole("button", { name: "send message" }).click()

  await expect(page.getByText("Message sent. Thank you.")).toBeVisible({ timeout: 15_000 })
  expect(body).toMatch(/name="g-recaptcha-response"\r\n\r\n[\w-]{20,}/)
})
