import type { ClassValue } from "clsx"
import type { StateColor } from "@/portfolio-data"
import { clsx } from "clsx"

import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const stateAccentClasses = {
  yellow: "card-accent-yellow",
  pink: "card-accent-pink",
  green: "card-accent-green",
  blue: "card-accent-blue",
  cyan: "card-accent-cyan",
  orange: "card-accent-orange",
} satisfies Record<StateColor, string>

export function stateAccentClass(state: StateColor) {
  return stateAccentClasses[state]
}
