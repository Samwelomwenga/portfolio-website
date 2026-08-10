import { MotionConfig } from "motion/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import App from "./app"
import "./index.css"

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* reducedMotion="user" drops movement/scale for prefers-reduced-motion
        users while keeping opacity fades — the project-wide reduced-motion
        posture (see .scratch/section-animations/issues/02). */}
    <MotionConfig reducedMotion="user">
      {recaptchaSiteKey
        ? (
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
              <App />
            </GoogleReCaptchaProvider>
          )
        : (
            <App />
          )}
    </MotionConfig>
  </StrictMode>,
)
