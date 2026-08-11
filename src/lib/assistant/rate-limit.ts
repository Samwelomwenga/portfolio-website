import { createHash } from "node:crypto"

import { assistantLimits } from "@/lib/assistant/limits"
import "server-only"

/**
 * Best-effort in-memory rate limiting for v1 (map effort: Option A).
 *
 * Counters live in module scope as fixed windows. On serverless this is
 * per-instance and therefore best-effort — a request spread across warm
 * instances can exceed the frozen caps — which is an accepted v1 trade for a
 * low-traffic recruiter portfolio (ticket 06 defers durable abuse infra until
 * real usage). The hard input controls (prompt char cap, token budget, provider
 * timeout) do not depend on this store and are always enforced exactly.
 *
 * `checkRateLimit` is the seam: when real abuse appears, a durable
 * implementation (e.g. Upstash Redis) can replace the internals behind this
 * signature without touching the route.
 */

const MINUTE_MS = 60_000
const DAY_MS = 86_400_000

/** Prune the store once it grows past this many live windows. */
const STORE_SWEEP_THRESHOLD = 5_000

type Window = { count: number, resetAt: number }

const store = new Map<string, Window>()

type Scope = "session" | "ip" | "site"

type ScopedRule = { scope: Scope, key: string, limit: number, windowMs: number }

export type RateLimitKeys = {
  /** Stable anonymous session id from the client, if present. */
  sessionId?: string
  /** Hashed client IP — never the raw address. */
  ipHash: string
}

export type RateLimitDecision
  = | { allowed: true }
    | { allowed: false, scope: Scope, retryAfterSeconds: number }

/** SHA-256 of the client IP, truncated — a stable key that is not the raw IP. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16)
}

function liveCount(key: string, now: number): number {
  const window = store.get(key)
  if (!window || window.resetAt <= now)
    return 0
  return window.count
}

function increment(key: string, windowMs: number, now: number): void {
  const window = store.get(key)
  if (!window || window.resetAt <= now)
    store.set(key, { count: 1, resetAt: now + windowMs })
  else
    window.count += 1
}

function sweep(now: number): void {
  if (store.size < STORE_SWEEP_THRESHOLD)
    return
  for (const [key, window] of store) {
    if (window.resetAt <= now)
      store.delete(key)
  }
}

function rulesFor(keys: RateLimitKeys): ScopedRule[] {
  const { perSession, perIpHash, siteWideSuccessPerDay } = assistantLimits
  const rules: ScopedRule[] = []

  if (keys.sessionId) {
    rules.push({ scope: "session", key: `s:m:${keys.sessionId}`, limit: perSession.perMinute, windowMs: MINUTE_MS })
    rules.push({ scope: "session", key: `s:d:${keys.sessionId}`, limit: perSession.perDay, windowMs: DAY_MS })
  }
  rules.push({ scope: "ip", key: `i:m:${keys.ipHash}`, limit: perIpHash.perMinute, windowMs: MINUTE_MS })
  rules.push({ scope: "ip", key: `i:d:${keys.ipHash}`, limit: perIpHash.perDay, windowMs: DAY_MS })
  rules.push({ scope: "site", key: "site:d", limit: siteWideSuccessPerDay, windowMs: DAY_MS })

  return rules
}

/**
 * Checks all applicable windows and, if none is exhausted, consumes one slot
 * from each atomically (all-or-nothing, so a later cap can't leave an earlier
 * counter incremented). The site-wide window is counted per accepted request —
 * a close proxy for successful calls that stays conservative under provider
 * failures.
 */
export function checkRateLimit(keys: RateLimitKeys, now: number = Date.now()): RateLimitDecision {
  sweep(now)
  const rules = rulesFor(keys)

  for (const rule of rules) {
    if (liveCount(rule.key, now) >= rule.limit) {
      const window = store.get(rule.key)
      const retryAfterSeconds = window ? Math.max(1, Math.ceil((window.resetAt - now) / 1000)) : 60
      return { allowed: false, scope: rule.scope, retryAfterSeconds }
    }
  }

  for (const rule of rules)
    increment(rule.key, rule.windowMs, now)

  return { allowed: true }
}
