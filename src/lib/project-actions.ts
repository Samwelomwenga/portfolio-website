import type { ProjectItem, ProjectLinks } from "@/portfolio-data"
import { SiAppstore, SiGithub, SiGoogleplay, SiSwagger } from "@icons-pack/react-simple-icons"
import { Globe, Users } from "lucide-react"

export type ProjectActionKey = keyof ProjectLinks

const projectActionOrder = ["testerGroup", "playStore", "appStore", "web", "swagger", "github"] satisfies readonly ProjectActionKey[]

type ActionIcon = typeof SiGithub | typeof Globe

type ActionMeta = { label: string, Icon: ActionIcon, iconClass: string }

const liveActionMeta = {
  github: { label: "View code", Icon: SiGithub, iconClass: "text-fg" },
  swagger: { label: "Read API docs", Icon: SiSwagger, iconClass: "text-[#85EA2D]" },
  web: { label: "Visit live site", Icon: Globe, iconClass: "text-accent" },
  playStore: { label: "Download on Play Store", Icon: SiGoogleplay, iconClass: "text-[#00A0FF]" },
  appStore: { label: "Download on the App Store", Icon: SiAppstore, iconClass: "text-[#0D96F6]" },
} satisfies Partial<Record<ProjectActionKey, ActionMeta>>

const testingActionMeta = {
  testerGroup: { label: "Join tester group", Icon: Users, iconClass: "text-fg" },
  playStore: { label: "Join Android testing", Icon: SiGoogleplay, iconClass: "text-[#00A0FF]" },
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

  const actions = projectActionOrder.flatMap((key): Omit<ProjectAction, "primary">[] => {
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
      return [{ key, href, ...meta, testingCta: false }]
    }

    const meta = { ...testingActionMeta[key as keyof typeof testingActionMeta] }
    if (key === "playStore" && hasTesterGroup) {
      meta.label = "Open on Play Store"
    }

    return [{ key, href, ...meta, testingCta: true }]
  })

  return actions.map((action, index) => ({ ...action, primary: index === 0 }))
}
