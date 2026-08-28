import type { ProjectItem, ProjectLinks } from "@/portfolio-data"
import { SiAppstore, SiGithub, SiGoogleplay, SiSwagger } from "@icons-pack/react-simple-icons"
import { Globe, Users } from "lucide-react"

export type ProjectActionKey = keyof ProjectLinks

const projectActionOrder = ["github", "swagger", "web", "testerGroup", "playStore", "appStore"] satisfies readonly ProjectActionKey[]

type ActionIcon = typeof SiGithub | typeof Globe

type ActionMeta = { label: string, Icon: ActionIcon, iconClass: string }

const liveActionMeta = {
  github: { label: "code", Icon: SiGithub, iconClass: "text-fg" },
  swagger: { label: "API docs", Icon: SiSwagger, iconClass: "text-[#85EA2D]" },
  web: { label: "live site", Icon: Globe, iconClass: "text-accent" },
  playStore: { label: "Play Store", Icon: SiGoogleplay, iconClass: "text-[#414141]" },
  appStore: { label: "App Store", Icon: SiAppstore, iconClass: "text-[#0D96F6]" },
} satisfies Partial<Record<ProjectActionKey, ActionMeta>>

const testingActionMeta = {
  testerGroup: { label: "Join tester group", Icon: Users, iconClass: "text-fg" },
  playStore: { label: "Join Android testing", Icon: SiGoogleplay, iconClass: "text-[#414141]" },
  appStore: { label: "Join TestFlight", Icon: SiAppstore, iconClass: "text-[#0D96F6]" },
} satisfies Partial<Record<ProjectActionKey, ActionMeta>>

const testingKeys = new Set<ProjectActionKey>(["testerGroup", "playStore", "appStore"])

export type ProjectAction = ActionMeta & {
  key: ProjectActionKey
  href: string
  testingCta: boolean
  primary: boolean
}

export function getProjectActions(project: ProjectItem): ProjectAction[] {
  if (!project.links) {
    return []
  }

  const isTesting = project.status === "testing"
  const hasTesterGroup = isTesting && Boolean(project.links.testerGroup)
  let primaryTestingAssigned = false

  return projectActionOrder.flatMap((key): ProjectAction[] => {
    const href = project.links?.[key]
    if (!href) {
      return []
    }

    const testingCta = isTesting && testingKeys.has(key)
    if (!testingCta) {
      const meta = liveActionMeta[key as keyof typeof liveActionMeta]
      if (!meta) {
        return []
      }
      return [{ key, href, ...meta, testingCta: false, primary: false }]
    }

    const meta = { ...testingActionMeta[key as keyof typeof testingActionMeta] }
    if (key === "playStore" && hasTesterGroup) {
      meta.label = "Open on Play Store"
    }

    const primary = !primaryTestingAssigned
    primaryTestingAssigned = true
    return [{ key, href, ...meta, testingCta: true, primary }]
  })
}
