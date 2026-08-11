/**
 * Parsing for the model's leading control line.
 *
 * The prompt/eval contract (§B/§C) requires the model to emit a single control
 * line as the very first line of its output, then the visitor-facing answer on
 * the next line:
 *
 *   ⟦meta disposition=<one of five> sources=<comma-separated ids, or - if none>⟧
 *
 * The route strips this line from the visible stream and re-surfaces the parsed
 * result as message metadata. This module is pure (no `server-only`) so the
 * eval suite (I6) can unit-test it directly.
 */

/**
 * The five *content* dispositions the model may emit. `degraded`/`offline` are
 * transport states owned by the route and client, not dispositions — they never
 * appear on the control line.
 */
export const DISPOSITIONS = [
  "grounded",
  "needs_contact",
  "off_topic",
  "declined",
  "adversarial",
] as const

export type Disposition = (typeof DISPOSITIONS)[number]

/** Parsed control line: the disposition plus the Source IDs the answer relied on. */
export type AssistantMeta = {
  disposition: Disposition
  sourceIds: string[]
}

const DISPOSITION_SET: ReadonlySet<string> = new Set(DISPOSITIONS)

/**
 * Matches the frozen control line, tolerant of surrounding whitespace. The
 * answer text follows on the next line and is not captured here.
 */
const META_LINE = /^\s*⟦meta\s+disposition=([a-z_]+)\s+sources=(.+?)⟧\s*$/

function isDisposition(value: string): value is Disposition {
  return DISPOSITION_SET.has(value)
}

/**
 * Parses the model's leading control line into a typed `AssistantMeta`, or
 * returns `null` when the line is absent or malformed.
 *
 * A `null` here is a contract violation, not a recoverable state: the route
 * treats it as a degraded response rather than guessing a disposition or
 * leaking the unparsed line to the client.
 */
export function parseMetaLine(line: string): AssistantMeta | null {
  const match = META_LINE.exec(line)
  if (!match)
    return null

  const disposition = match[1]
  const rawSources = match[2]
  if (disposition === undefined || rawSources === undefined || !isDisposition(disposition))
    return null

  const sources = rawSources.trim()
  const sourceIds = sources === "-"
    ? []
    : sources.split(",").map(id => id.trim()).filter(Boolean)

  return { disposition, sourceIds }
}
