import { cn } from "@/lib/utils"

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
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.id === active
        return (
          <button
            key={option.id}
            type="button"
            data-active={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-[2.125rem] rounded-sm border border-border bg-surface px-2.5 text-xs font-extrabold tracking-[0.02em] text-muted transition-colors",
              isActive && "border-line bg-accent-soft text-fg",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
