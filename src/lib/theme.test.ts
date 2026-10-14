import type { EffectiveMode } from "@/lib/theme"
import { readFileSync } from "node:fs"
import postcss from "postcss"
import { describe, expect, it } from "vitest"
import { getThemeOption, themeFamilies, themeOptions } from "@/lib/theme"

const paletteTokens = [
  "accent",
  "panel-bg",
  "surface0",
  "surface1",
  "surface-dim",
  "overlay0",
  "overlay1",
  "text",
  "subtext0",
  "mauve",
  "green",
  "yellow",
  "red",
  "blue",
  "teal",
  "peach",
]

const modes: EffectiveMode[] = ["dark", "light"]

function paletteBlocks() {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
  const blocks = new Map<string, Set<string>>()

  postcss.parse(css).walkRules((rule) => {
    const declared = new Set<string>()
    rule.walkDecls(/^--theme-/, (decl) => {
      declared.add(decl.prop.slice("--theme-".length))
    })

    for (const selector of rule.selectors) {
      const match = selector.trim().match(/^:root\[data-theme="([^"]+)"\]\[data-effective-mode="(dark|light)"\]$/)
      if (match) {
        blocks.set(`${match[1]}/${match[2]}`, declared)
      }
    }
  })

  return blocks
}

describe("theme mode pairs", () => {
  const blocks = paletteBlocks()

  for (const family of themeFamilies) {
    describe(family.id, () => {
      for (const mode of modes) {
        it(`has a ${mode} option`, () => {
          const option = getThemeOption(family.id, mode)

          expect(option.theme).toBe(family.id)
          expect(option.mode).toBe(mode)
        })

        it(`has a ${mode} palette block that sets every token`, () => {
          const declared = blocks.get(`${family.id}/${mode}`)

          expect(declared, `missing :root[data-theme="${family.id}"][data-effective-mode="${mode}"]`).toBeDefined()
          expect([...declared!].sort()).toEqual([...paletteTokens].sort())
        })
      }
    })
  }

  it("lists every option under a family", () => {
    const familyVariants = new Set(themeFamilies.flatMap(family => [family.dark, family.light]))

    expect(themeOptions.filter(option => !familyVariants.has(option.id))).toEqual([])
  })
})
