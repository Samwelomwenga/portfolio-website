import type { ClassValue } from "clsx"
import type { CSSProperties } from "react"
import type { StateColor } from "@/portfolio-data"
import { clsx } from "clsx"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Terminal cards, dots, and connectors pick their accent from the shared
 * state-color palette. Exposing it as a `--card-accent` custom property keeps
 * the color a single source of truth that utility classes can reference via
 * arbitrary values (e.g. `border-t-[color:var(--card-accent)]`).
 */
export function stateStyle(state: StateColor): CSSProperties {
  return { "--card-accent": `var(--state-${state})` } as CSSProperties
}
