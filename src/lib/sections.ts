import type { SectionId } from "@/portfolio-data"
import { navItems } from "@/portfolio-data"

export const sectionIds = navItems.filter(item => item.ready).map(item => item.id) as readonly SectionId[]

export function isSectionId(value: string): value is SectionId {
  return (sectionIds as readonly string[]).includes(value)
}

export function isSectionReady(id: string): id is SectionId {
  return navItems.some(item => item.id === id && item.ready)
}

export function commandFor(id: SectionId): string {
  return navItems.find(item => item.id === id)?.command ?? "$"
}
