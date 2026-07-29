type PromptLineProps = {
  section: string
  command: string
}

/** The `portfolio  <section> $ <command>` header shown atop every screen. */
export function PromptLine({ section, command }: PromptLineProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[0.8125rem] leading-snug text-muted">
      <b className="font-extrabold text-success">portfolio</b>
      <span className="font-extrabold text-accent">{section}</span>
      <code className="min-w-0 truncate">{command}</code>
    </div>
  )
}
