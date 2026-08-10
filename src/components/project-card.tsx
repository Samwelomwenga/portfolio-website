import type { ProjectItem, ProjectLinks } from "@/portfolio-data"
import { SiAppstore, SiGithub, SiGoogleplay, SiSwagger } from "@icons-pack/react-simple-icons"
import { Globe } from "lucide-react"
import { motion } from "motion/react"
import { RollingText } from "@/components/motion/rolling-text"
import { StatusPill } from "@/components/terminal/status-pill"
import { buttonMicroInteraction } from "@/lib/motion"
import { skillIcons } from "@/lib/skill-icons"
import { cn, stateAccentClass } from "@/lib/utils"
import { projectStatusMeta } from "@/portfolio-data"

type ProjectCardProps = {
  project: ProjectItem
}

const stackBadgeLimit = 6

type ProjectActionKey = keyof ProjectLinks

const projectActionOrder = ["github", "swagger", "web", "playStore", "appStore"] satisfies readonly ProjectActionKey[]

const liveActionMeta = {
  github: { label: "code", Icon: SiGithub, iconClass: "text-[#181717]" },
  swagger: { label: "API docs", Icon: SiSwagger, iconClass: "text-[#85EA2D]" },
  web: { label: "live site", Icon: Globe, iconClass: "text-accent" },
  playStore: { label: "Play Store", Icon: SiGoogleplay, iconClass: "text-[#414141]" },
  appStore: { label: "App Store", Icon: SiAppstore, iconClass: "text-[#0D96F6]" },
} satisfies Record<ProjectActionKey, {
  label: string
  Icon: typeof SiGithub | typeof Globe
  iconClass: string
}>

const testingActionMeta = {
  playStore: { label: "Join Android testing", Icon: SiGoogleplay, iconClass: "text-[#414141]" },
  appStore: { label: "Join TestFlight", Icon: SiAppstore, iconClass: "text-[#0D96F6]" },
} satisfies Pick<typeof liveActionMeta, "playStore" | "appStore">

type ProjectAction = {
  key: ProjectActionKey
  href: string
  label: string
  Icon: typeof SiGithub | typeof Globe
  iconClass: string
  testingCta: boolean
}

function getProjectActions(project: ProjectItem): ProjectAction[] {
  if (!project.links) {
    return []
  }

  return projectActionOrder.flatMap((key) => {
    const href = project.links?.[key]
    if (!href) {
      return []
    }

    const testingCta = project.status === "testing" && (key === "playStore" || key === "appStore")
    const meta = testingCta ? testingActionMeta[key] : liveActionMeta[key]

    return [{ key, href, ...meta, testingCta }]
  })
}

/**
 * Project pane: browser-framed screenshot well over a metadata body. Wrapped by
 * <TiltCard> in the grid, so it reveals via the shared `cardReveal` variant and
 * leans toward the pointer on hover (chip/card grid archetype, ticket 07 —
 * mirrors the Skills section). The blurb rolls in word by word.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const status = projectStatusMeta[project.status]
  const actions = getProjectActions(project)
  return (
    <article
      aria-label={project.title}
      className={cn(
        stateAccentClass(project.state),
        "grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-md border border-border bg-surface",
      )}
    >
      <div className="project-preview-header border-t-4 border-t-[color:var(--card-accent)] border-b border-b-border p-3.5">
        <div className="grid min-h-[11.875rem] grid-rows-[1.75rem_minmax(0,1fr)] overflow-hidden rounded-md border border-border bg-shell">
          <div className="flex items-center gap-1.5 border-b border-border bg-surface/80 px-2.5">
            <span className="size-[0.4375rem] rounded-full bg-state-yellow" />
            <span className="size-[0.4375rem] rounded-full bg-state-pink" />
            <span className="size-[0.4375rem] rounded-full bg-state-green" />
          </div>
          <div className="project-preview-placeholder grid min-h-[10.125rem] place-items-center border border-dashed text-[0.75rem] font-extrabold tracking-[0.08em] text-muted uppercase">
            project screenshot
          </div>
        </div>
      </div>

      <div className="grid content-start gap-3.5 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <StatusPill>{project.typeLabel}</StatusPill>
        </div>
        <div className="grid gap-1.5">
          <h3 className="text-xl leading-tight">{project.title}</h3>
          <p className="text-sm text-muted">
            <RollingText text={project.blurb} split="words" />
          </p>
        </div>

        <ProjectStackList project={project} />
        <ProjectActionList project={project} actions={actions} />
      </div>
    </article>
  )
}

function ProjectStackList({ project }: { project: ProjectItem }) {
  const visibleStack = project.stack.slice(0, stackBadgeLimit)
  const hiddenCount = project.stack.length - visibleStack.length

  if (visibleStack.length === 0) {
    return null
  }

  return (
    <ul aria-label={`${project.title} tech stack`} className="flex flex-wrap gap-1.5">
      {visibleStack.map(tag => (
        <ProjectStackBadge key={tag} tag={tag} />
      ))}
      {hiddenCount > 0 && (
        <li className="inline-flex min-h-8 items-center rounded-sm border border-dashed border-border px-2 text-xs font-bold text-muted">
          {`+${hiddenCount} more`}
        </li>
      )}
    </ul>
  )
}

function ProjectStackBadge({ tag }: { tag: string }) {
  const icon = skillIcons[tag]

  return (
    <li data-project-skill={tag} className="inline-flex min-h-8 items-center gap-1.5 rounded-sm border border-border bg-shell py-1 pr-2.5 pl-1 text-xs font-bold text-fg">
      {icon && (
        <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-white/95">
          <icon.Icon aria-hidden="true" className={cn("size-3.5", icon.iconClass)} focusable="false" title="" />
        </span>
      )}
      <span>{tag}</span>
    </li>
  )
}

function ProjectActionList({ project, actions }: { project: ProjectItem, actions: ProjectAction[] }) {
  if (actions.length === 0) {
    return null
  }

  const testingActions = actions.filter(action => action.testingCta)
  const standardActions = actions.filter(action => !action.testingCta)

  return (
    <div aria-label={`${project.title} links`} className="grid gap-2">
      {testingActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {testingActions.map(action => (
            <ProjectActionLink key={action.key} action={action} />
          ))}
        </div>
      )}

      {standardActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {standardActions.map(action => (
            <ProjectActionLink key={action.key} action={action} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectActionLink({ action }: { action: ProjectAction }) {
  const Icon = action.Icon

  return (
    <motion.a
      href={action.href}
      target="_blank"
      rel="noreferrer"
      aria-label={action.label}
      className={cn(
        "inline-flex min-h-8 max-w-full items-center justify-center gap-1.5 rounded-sm border px-2.5 text-xs font-extrabold transition-colors",
        action.testingCta
          ? "border-[color:var(--card-accent)] bg-[color:var(--card-accent)] text-[color:var(--bg)]"
          : "border-border bg-shell text-fg hover:border-fg",
      )}
      {...buttonMicroInteraction}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-3.5 shrink-0", action.testingCta ? "text-[color:var(--bg)]" : action.iconClass)}
        focusable="false"
        title=""
      />
      <span className="min-w-0 truncate">{action.label}</span>
    </motion.a>
  )
}
