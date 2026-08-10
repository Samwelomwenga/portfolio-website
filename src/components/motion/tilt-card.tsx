import type { ReactNode } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import { useRef } from "react"

import { cardReveal } from "@/lib/motion"

/** Max lean in degrees when the pointer is at a card edge. */
const MAX_TILT = 8
/** Perspective (px) applied to the card so the lean reads as depth, not skew. */
const PERSPECTIVE = 800
/** Smooth settle for the lean — enough damping that it doesn't wobble. */
const tiltSpring = { stiffness: 200, damping: 18, mass: 0.4 }

type TiltCardProps = {
  children: ReactNode
  className?: string
}

/**
 * A card that leans toward the pointer in 3D — `rotateX`/`rotateY` on the
 * compositor, springed for a smooth settle (after the tilt-card example on
 * motion.dev). It still reveals via the shared `cardReveal` variant, so it
 * staggers in like any other <Stagger> child. Reduced-motion users get the
 * reveal with no lean.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion()
  // Pointer position within the card, normalised to -0.5…0.5 from the centre.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), tiltSpring)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), tiltSpring)
  // Cache the card's untransformed bounds on enter so per-move reads don't pick
  // up the tilt transform (getBoundingClientRect includes it once leaning).
  const boundsRef = useRef<DOMRect | null>(null)

  if (prefersReducedMotion) {
    return (
      <motion.div variants={cardReveal} className={className}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardReveal}
      onPointerEnter={(event) => {
        boundsRef.current = event.currentTarget.getBoundingClientRect()
      }}
      onPointerMove={(event) => {
        const bounds = boundsRef.current
        if (!bounds) {
          return
        }
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
      }}
      onPointerLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: PERSPECTIVE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
