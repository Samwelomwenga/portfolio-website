import { LayoutGroup, motion } from "motion/react"
import { useId } from "react"

import { activeIndicatorTransition, pillMicroInteraction } from "@/lib/motion"

type FilterOption = {
  id: string
  label: string
}

type FilterBarProps = {
  options: readonly FilterOption[]
  active: string
  onChange: (id: string) => void
  label: string
}

/** Row of terminal filter chips shared by the project and blog surfaces. */
export function FilterBar({ options, active, onChange, label }: FilterBarProps) {
  const groupId = useId()

  return (
    <LayoutGroup id={groupId}>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => {
          const isActive = option.id === active
          return (
            <motion.button
              key={option.id}
              type="button"
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => onChange(option.id)}
              className="relative min-h-[2.125rem] overflow-hidden rounded-sm border border-border bg-surface px-2.5 text-xs font-extrabold tracking-[0.02em] text-muted transition-colors hover:border-line hover:text-fg data-[active=true]:border-line data-[active=true]:text-fg"
              {...pillMicroInteraction}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-sm bg-accent-soft"
                  transition={activeIndicatorTransition}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
