"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "motion/react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { publicEnv } from "@/lib/public-env"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {publicEnv.recaptchaSiteKey
        ? (
            <GoogleReCaptchaProvider reCaptchaKey={publicEnv.recaptchaSiteKey}>
              {children}
            </GoogleReCaptchaProvider>
          )
        : (
            children
          )}
    </MotionConfig>
  )
}
