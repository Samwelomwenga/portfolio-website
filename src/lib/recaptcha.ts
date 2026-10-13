type Grecaptcha = {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

let loading: Promise<Grecaptcha> | undefined

export function loadRecaptcha(siteKey: string): Promise<Grecaptcha> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.onload = () => {
      const { grecaptcha } = window as Window & { grecaptcha?: Grecaptcha }
      if (grecaptcha)
        grecaptcha.ready(() => resolve(grecaptcha))
      else
        reject(new Error("reCAPTCHA script loaded without grecaptcha"))
    }
    script.onerror = () => {
      loading = undefined
      script.remove()
      reject(new Error("reCAPTCHA script failed to load"))
    }
    document.head.append(script)
  })
  return loading
}

export async function getRecaptchaTokenOrEmpty(siteKey: string): Promise<string> {
  try {
    const grecaptcha = await loadRecaptcha(siteKey)
    return await grecaptcha.execute(siteKey, { action: "submit" })
  }
  catch {
    return ""
  }
}
