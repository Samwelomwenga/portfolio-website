import type { ProjectAction } from "@/lib/project-actions"
import type { ProjectItem } from "@/portfolio-data"
import { describe, expect, it } from "vitest"
import { getProjectActions } from "@/lib/project-actions"

function project(overrides: Partial<ProjectItem>): ProjectItem {
  return {
    title: "Test",
    blurb: "",
    kind: "mobile",
    typeLabel: "mobile",
    status: "testing",
    stack: [],
    state: "blue",
    featured: false,
    ...overrides,
  }
}

describe("getProjectActions", () => {
  it("returns nothing when there are no links", () => {
    expect(getProjectActions(project({ links: undefined }))).toEqual([])
  })

  it("sequences the tester group before the Play Store for testing projects", () => {
    const actions = getProjectActions(project({
      status: "testing",
      links: {
        testerGroup: "https://groups.google.com/g/chalk-app-testers",
        playStore: "https://play.google.com/store/apps/details?id=com.omwenga.ChalkApp",
      },
    }))

    expect(actions.map(a => a.key)).toEqual(["testerGroup", "playStore"])

    const [group, store] = actions as [ProjectAction, ProjectAction]
    expect(group.label).toBe("Join tester group")
    expect(group.primary).toBe(true)
    expect(group.testingCta).toBe(true)

    expect(store.label).toBe("Open on Play Store")
    expect(store.primary).toBe(false)
    expect(store.testingCta).toBe(true)
  })

  it("keeps a standalone testing Play Store as the primary join-testing CTA", () => {
    const [store] = getProjectActions(project({
      status: "testing",
      links: { playStore: "https://play.google.com/store/apps/details?id=com.omwenga.ChalkApp" },
    })) as [ProjectAction]

    expect(store.label).toBe("Join Android testing")
    expect(store.primary).toBe(true)
  })

  it("uses live labels and standard styling for live projects", () => {
    const actions = getProjectActions(project({
      status: "live",
      links: {
        github: "https://github.com/samwelomwenga/x",
        web: "https://example.com",
      },
    }))

    expect(actions.map(a => a.label)).toEqual(["code", "live site"])
    expect(actions.every(a => !a.testingCta)).toBe(true)
  })

  it("ignores a tester group on a live project", () => {
    const actions = getProjectActions(project({
      status: "live",
      links: { testerGroup: "https://groups.google.com/g/x", web: "https://example.com" },
    }))

    expect(actions.map(a => a.key)).toEqual(["web"])
  })
})
