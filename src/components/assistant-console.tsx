"use client"

import type { UIMessage } from "ai"

import type { AssistantMeta } from "@/lib/assistant/meta"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { StatusPill } from "@/components/terminal/status-pill"
import { buttonMicroInteraction, pillMicroInteraction } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { assistantPrompts } from "@/portfolio-data"

/** The client-side message type, carrying the route's `disposition`/`sourceIds` metadata. */
type AssistantUIMessage = UIMessage<AssistantMeta>

/** Transport state driving the header pill and the failure notice — distinct from a content disposition. */
type TransportState = "online" | "thinking" | "degraded" | "offline"

const pillTone: Record<TransportState, "default" | "done" | "warn"> = {
  online: "done",
  thinking: "default",
  degraded: "warn",
  offline: "warn",
}

/** Flatten a UI message's text parts into the plain prose we render and send upstream. */
function messageText(message: AssistantUIMessage): string {
  return message.parts
    .filter(part => part.type === "text")
    .map(part => (part as { text: string }).text)
    .join("")
}

/**
 * Fetch wrapper that turns the route's non-2xx transport states into typed
 * errors so the UI can tell a rate-limit (`degraded`) apart from any other
 * failure (`offline`). A 200 with a stream-level error is masked to `"offline"`
 * by the route, so its error message already reads as such.
 */
async function assistantFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init)
  if (!response.ok)
    throw new Error(response.status === 429 ? "rate_limited" : "unavailable")
  return response
}

/**
 * The real portfolio assistant: a terminal console wired to `POST /api/assistant`.
 * Answers stream token-by-token from Gemini; the assistant only speaks from
 * Samwel's portfolio and never fabricates a fallback when the backend is down.
 */
export function AssistantConsole() {
  const prefersReducedMotion = useReducedMotion()
  const [input, setInput] = useState("")

  // A stable anonymous session id lets the server rate-limit per visitor
  // without any account or persisted identity.
  const [sessionId] = useState(() => crypto.randomUUID())

  // The React Compiler (enabled in next.config) memoizes this on `sessionId`,
  // so the transport is created once per session without a manual `useMemo`.
  const transport = new DefaultChatTransport<AssistantUIMessage>({
    api: "/api/assistant",
    fetch: assistantFetch,
    headers: { "x-assistant-session": sessionId },
    // The route expects a plain `{ role, content }[]`, not UI messages with
    // parts. Drop any empty (errored) assistant turns so a prior failure
    // never poisons the next request.
    prepareSendMessagesRequest: ({ messages }) => ({
      body: {
        messages: messages
          .map(message => ({ role: message.role, content: messageText(message) }))
          .filter(turn => turn.content.trim() !== ""),
      },
    }),
  })

  const { messages, sendMessage, status, error } = useChat<AssistantUIMessage>({ transport })

  const busy = status === "submitted" || status === "streaming"
  const transportState: TransportState
    = status === "error"
      ? (error?.message === "rate_limited" ? "degraded" : "offline")
      : busy
        ? "thinking"
        : "online"

  const transcriptRef = useRef<HTMLDivElement | null>(null)
  // Keep the newest turn in view as answers stream in.
  useEffect(() => {
    const node = transcriptRef.current
    if (node)
      node.scrollTop = node.scrollHeight
  }, [messages, status])

  function ask(prompt: string) {
    const clean = prompt.trim()
    if (!clean || busy)
      return
    setInput("")
    void sendMessage({ text: clean })
  }

  const lastMessageId = messages.at(-1)?.id

  return (
    <section
      aria-labelledby="assistant-console-title"
      className="grid max-h-[38.75rem] grid-rows-[auto_minmax(0,1fr)_auto_auto] overflow-hidden rounded-md border border-line bg-panel shadow-[0_1.5rem_5rem_color-mix(in_oklch,black_32%,transparent)] wide:max-h-[38.75rem]"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface/50 px-3.5 py-3">
        <div
          className="grid size-9 shrink-0 place-items-center rounded-full border border-success/50 bg-surface text-[0.75rem] font-black tracking-[0.02em] text-fg"
          aria-hidden="true"
        >
          SO
        </div>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <strong id="assistant-console-title" className="truncate text-[0.8125rem] tracking-[0.01em]">personal ai assistant</strong>
          <span className="truncate text-[0.6875rem] text-muted">portfolio helper · grounded answers</span>
        </div>
        <StatusPill tone={pillTone[transportState]}>{transportState}</StatusPill>
      </div>

      <div
        ref={transcriptRef}
        className="grid min-h-[17.5rem] content-start gap-3 overflow-auto p-3.5 text-[0.8125rem] leading-relaxed term-scrollbar"
        aria-live="polite"
      >
        {messages.length === 0 && status !== "error" && (
          <div className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-muted">
            <span className="mt-2 size-2 rounded-full bg-state-orange shadow-[0_0_0_0.25rem_color-mix(in_oklch,var(--state-orange)_18%,transparent)]" aria-hidden="true" />
            <p className="min-w-0">
              <strong className="mb-0.5 block text-xs tracking-[0.08em] text-fg uppercase">Assistant</strong>
              <span className="text-muted">Ask about Samwel&apos;s projects, stack, experience, or how to reach him.</span>
            </p>
          </div>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-muted">
                <span className="font-black text-accent">›</span>
                <p className="min-w-0">{messageText(message)}</p>
              </div>
            )
          }

          const text = messageText(message)
          if (text === "")
            return null

          const streaming = status === "streaming" && message.id === lastMessageId
          const needsContact = message.metadata?.disposition === "needs_contact"

          return (
            <div key={message.id} className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-muted">
              <span className="mt-2 size-2 rounded-full bg-state-orange shadow-[0_0_0_0.25rem_color-mix(in_oklch,var(--state-orange)_18%,transparent)]" aria-hidden="true" />
              <p className="min-w-0">
                <strong className="mb-0.5 block text-xs tracking-[0.08em] text-fg uppercase">Assistant</strong>
                <span className={cn("text-muted", streaming && !prefersReducedMotion && "typed-caret")}>{text}</span>
                {needsContact && !streaming && (
                  <a href="#contact" className="mt-1 inline-block font-extrabold text-accent hover:underline">Ask Samwel →</a>
                )}
              </p>
            </div>
          )
        })}

        {status === "error" && (
          <div className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2 text-warn">
            <span className="mt-2 size-2 rounded-full bg-warn" aria-hidden="true" />
            <p className="min-w-0">
              <strong className="mb-0.5 block text-xs tracking-[0.08em] uppercase">Assistant</strong>
              <span>
                {transportState === "degraded"
                  ? "Assistant is catching its breath — please try again in a moment."
                  : "Assistant is offline right now — I won't guess an answer."}
              </span>
              <a href="#contact" className="mt-1 inline-block font-extrabold text-accent hover:underline">Ask Samwel →</a>
            </p>
          </div>
        )}

        {messages.length > 0 && (
          <div
            className={cn(
              "status-pulse flex items-center gap-2 pt-0.5 text-xs",
              busy ? "text-warn" : "text-success",
            )}
            data-ready={!busy}
          >
            {busy ? "Working" : "Ready for next prompt"}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border bg-surface/40 px-3.5 pb-3">
        {assistantPrompts.map(chip => (
          <motion.button
            key={chip.label}
            type="button"
            disabled={busy}
            onClick={() => ask(chip.prompt)}
            className="mt-3 min-h-8 rounded-sm border border-border bg-surface px-2.5 text-[0.6875rem] font-extrabold tracking-[0.02em] text-muted transition-colors hover:border-line hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
            {...pillMicroInteraction}
          >
            {chip.label}
          </motion.button>
        ))}
      </div>

      <form
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-border bg-panel px-3.5 py-3"
        onSubmit={(event) => {
          event.preventDefault()
          ask(input)
        }}
      >
        <span className="font-black text-accent">›</span>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Ask the portfolio assistant..."
          aria-label="Ask the portfolio assistant"
          className="min-h-[2.375rem] w-full rounded-sm border border-border bg-surface px-2.5 text-xs text-fg outline-none focus:border-line focus:shadow-[0_0_0_0.125rem_color-mix(in_oklch,var(--accent)_24%,transparent)]"
        />
        <motion.button
          type="submit"
          disabled={busy || input.trim() === ""}
          className="min-h-[2.375rem] rounded-sm border border-accent bg-accent px-3 text-xs font-black tracking-[0.02em] text-[color:var(--bg)] disabled:cursor-not-allowed disabled:opacity-50"
          {...buttonMicroInteraction}
        >
          run
        </motion.button>
      </form>
    </section>
  )
}
