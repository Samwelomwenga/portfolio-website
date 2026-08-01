import type { ReactNode } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { duration, easing, spring } from "@/lib/motion"

const formId = import.meta.env.VITE_FORMSPREE_FORM_ID as string

const labelClass = "text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-muted"
const fieldClass = "min-h-[2.875rem] rounded-sm border-border bg-panel px-3 text-fg shadow-none focus-visible:border-line focus-visible:ring-0"

/** Small fade+rise swap for the submit-state message and button label. */
const swap = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: duration.fast, ease: easing.out },
}

/** Announced copy + colour per non-idle submit state. */
const statusFeedback = {
  submitting: { message: "Sending…", className: "text-muted" },
  success: { message: "Message sent. Thank you.", className: "text-success" },
  error: { message: "Something went wrong. Try again.", className: "text-danger" },
} as const

/**
 * Wraps a field group and leans it in gently while it holds focus — a subtle
 * `spring.soft` transform-only response layered over the existing CSS border/ring
 * (guardrail 02-B). onFocus/onBlur bubble from the inner control, so the label and
 * input scale together. Reduced motion drops the scale via the root <MotionConfig>.
 */
function Field({ children }: { children: ReactNode }) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div
      className="grid gap-1.5"
      initial={false}
      animate={{ scale: focused ? 1.01 : 1 }}
      transition={spring.soft}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </motion.div>
  )
}

export function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  // Formspree resolves this function at submit time and sends the token as the
  // g-recaptcha-response field (verified against the Custom reCAPTCHA secret).
  const [state, handleSubmit] = useForm(formId, {
    data: { "g-recaptcha-response": executeRecaptcha },
  })
  const hasErrors = Array.isArray(state.errors) ? state.errors.length > 0 : Boolean(state.errors)
  // Submit lifecycle: idle → submitting → success/error. Motion swaps the message
  // in, but colour + copy + the aria-live region carry the signal on their own
  // (guardrail 02-A — motion is never the only channel), so every non-idle state
  // is announced, not just the button label.
  const status = state.succeeded
    ? "success"
    : hasErrors
      ? "error"
      : state.submitting
        ? "submitting"
        : "idle"
  const feedback = status === "idle" ? null : statusFeedback[status]

  return (
    <form
      aria-label="Contact form"
      className="grid gap-3.5 rounded-md border border-border bg-surface p-[clamp(1.125rem,2.4vw,1.75rem)]"
      onSubmit={handleSubmit}
    >
      <Field>
        <Label htmlFor="name" className={labelClass}>name</Label>
        <Input id="name" name="name" autoComplete="name" required placeholder="Your name" className={fieldClass} />
      </Field>

      <Field>
        <Label htmlFor="email" className={labelClass}>email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className={fieldClass} />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-xs font-bold text-danger" />
      </Field>

      <Field>
        <Label htmlFor="message" className={labelClass}>message</Label>
        <Textarea id="message" name="message" required rows={6} placeholder="Write a short note" className={`${fieldClass} min-h-[13.125rem] resize-y`} />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="text-xs font-bold text-danger" />
      </Field>

      <Button
        type="submit"
        disabled={state.submitting}
        className="min-h-[2.375rem] w-full rounded-sm border border-accent bg-accent px-3 text-xs font-black tracking-[0.02em] text-[color:var(--bg)] hover:bg-accent/90 sm:w-auto sm:justify-self-start"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={state.submitting ? "sending" : "send"} {...swap}>
            {state.submitting ? "sending" : "send message"}
          </motion.span>
        </AnimatePresence>
      </Button>

      <div className="min-h-[1.375rem] text-xs" role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {feedback && (
            <motion.p key={status} className={feedback.className} {...swap}>
              {feedback.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
