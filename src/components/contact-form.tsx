import { useForm, ValidationError } from "@formspree/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const formId = import.meta.env.VITE_FORMSPREE_FORM_ID as string

const labelClass = "text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-muted"
const fieldClass = "min-h-[2.875rem] rounded-sm border-border bg-panel px-3 text-fg shadow-none focus-visible:border-line focus-visible:ring-0"

export function ContactForm() {
  const [state, handleSubmit] = useForm(formId)
  const hasErrors = Array.isArray(state.errors) ? state.errors.length > 0 : Boolean(state.errors)

  return (
    <form
      className="grid gap-3.5 rounded-md border border-border bg-surface p-[clamp(1.125rem,2.4vw,1.75rem)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="name" className={labelClass}>name</Label>
        <Input id="name" name="name" autoComplete="name" required placeholder="Your name" className={fieldClass} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="email" className={labelClass}>email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className={fieldClass} />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-xs font-bold text-danger" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="message" className={labelClass}>message</Label>
        <Textarea id="message" name="message" required rows={6} placeholder="Write a short note" className={`${fieldClass} min-h-[13.125rem] resize-y`} />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="text-xs font-bold text-danger" />
      </div>

      <Button
        type="submit"
        disabled={state.submitting}
        className="min-h-[2.375rem] w-full rounded-sm border border-accent bg-accent px-3 text-xs font-black tracking-[0.02em] text-[color:var(--bg)] hover:bg-accent/90 sm:w-auto sm:justify-self-start"
      >
        {state.submitting ? "sending" : "send message"}
      </Button>

      <p className="min-h-[1.375rem] text-xs text-muted" aria-live="polite">
        {state.succeeded && "Message sent. Thank you."}
        {hasErrors && !state.succeeded && "Something went wrong. Try again."}
      </p>
    </form>
  )
}
