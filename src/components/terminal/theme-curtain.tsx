import type { ThemeOption } from "@/hooks/use-terminal-theme"

import { motion } from "motion/react"
import { duration, easing } from "@/lib/motion"

type ThemeCurtainProps = {
  phase: "cover" | "reveal"
  swatches: ThemeOption["swatches"]
  onCovered: () => void
  onRevealed: () => void
}

const STRIP_COUNT = 9
const STRIP_DURATION = 0.28
const STRIP_DELAY = 0.04
const stripIndexes = Array.from({ length: STRIP_COUNT }, (_, index) => index)

/** Full-viewport staggered strip wipe used when terminal themes change. */
export function ThemeCurtain({ phase, swatches, onCovered, onRevealed }: ThemeCurtainProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] grid"
      style={{ gridTemplateColumns: `repeat(${STRIP_COUNT}, minmax(0, 1fr))` }}
    >
      {stripIndexes.map((index) => {
        const isLast = index === STRIP_COUNT - 1
        return (
          <motion.div
            key={index}
            className="origin-top"
            style={{
              background: `linear-gradient(135deg, ${swatches[0]} 0%, ${swatches[1]} 56%, ${swatches[2]} 100%)`,
              backgroundPosition: `${(index / (STRIP_COUNT - 1)) * 100}% 0%`,
              backgroundSize: `${STRIP_COUNT * 100}% 100%`,
              transformOrigin: phase === "cover" ? "top" : "bottom",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase === "cover" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: phase === "cover" ? STRIP_DURATION : duration.base,
              delay: index * STRIP_DELAY,
              ease: easing.inOut,
            }}
            onAnimationComplete={() => {
              if (!isLast) {
                return
              }
              if (phase === "cover") {
                onCovered()
                return
              }
              onRevealed()
            }}
          />
        )
      })}
    </div>
  )
}
