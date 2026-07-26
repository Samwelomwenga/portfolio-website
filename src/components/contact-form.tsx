import { useForm, ValidationError } from "@formspree/react"
import { Send } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const formId = import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined

export function ContactForm() {
  const isConfigured = Boolean(formId)
  const [state, handleSubmit] = useForm(formId ?? "missing-form-id")
  const hasErrors = Array.isArray(state.errors) ? state.errors.length > 0 : Boolean(state.errors)

  return (
    <form
      className="contact-form"
      onSubmit={isConfigured
        ? handleSubmit
        : (event) => {
            event.preventDefault()
          }}
    >
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required placeholder="Your name" />
        </div>
        <div className="field">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="Your email" />
          <ValidationError field="email" prefix="Email" errors={state.errors} className="field-error" />
        </div>
      </div>
      <div className="field">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={4} placeholder="Tell me about your project" />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="field-error" />
      </div>
      <div className="form-footer">
        <p className="form-status" aria-live="polite">
          {!isConfigured && "Set VITE_FORMSPREE_FORM_ID to enable submissions."}
          {isConfigured && state.succeeded && "Message sent. Thank you."}
          {isConfigured && hasErrors && !state.succeeded && "Something went wrong. Try again."}
        </p>
        <Button className="send-button" type="submit" disabled={!isConfigured || state.submitting}>
          <motion.span
            animate={state.submitting ? { x: [0, 4, 0] } : { x: 0 }}
            transition={{ repeat: state.submitting ? Infinity : 0, duration: 0.8 }}
          >
            <Send aria-hidden="true" />
          </motion.span>
          {state.submitting ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  )
}
