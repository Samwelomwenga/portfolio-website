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

  it("leads live projects with a verb-labelled primary link to the live product", () => {
    const actions = getProjectActions(project({
      status: "live",
      links: {
        github: "https://github.com/samwelomwenga/x",
        web: "https://example.com",
      },
    }))

    expect(actions.map(a => a.label)).toEqual(["Visit live site", "View code"])
    expect(actions.map(a => a.primary)).toEqual([true, false])
    expect(actions.every(a => !a.testingCta)).toBe(true)
  })

  it("makes a live Play Store link the primary download CTA", () => {
    const [store] = getProjectActions(project({
      status: "live",
      links: { playStore: "https://play.google.com/store/apps/details?id=com.omwenga.ChalkApp" },
    })) as [ProjectAction]

    expect(store.label).toBe("Download on Play Store")
    expect(store.primary).toBe(true)
  })

  it("ignores a tester group on a live project", () => {
    const actions = getProjectActions(project({
      status: "live",
      links: { testerGroup: "https://groups.google.com/g/x", web: "https://example.com" },
    }))

    expect(actions.map(a => a.key)).toEqual(["web"])
  })

  it.each([
    ["live", { github: "g", swagger: "s", web: "w", playStore: "p", appStore: "a" }, ["Download on Play Store", "Download on the App Store", "Visit live site", "Read API docs", "View code"]],
    ["live", { github: "g", swagger: "s" }, ["Read API docs", "View code"]],
    ["live", { github: "g" }, ["View code"]],
    ["testing", { testerGroup: "t", playStore: "p", appStore: "a", github: "g" }, ["Join tester group", "Open on Play Store", "Join TestFlight", "View code"]],
    ["testing", { appStore: "a", web: "w" }, ["Join TestFlight", "Visit live site"]],
  ] as const)("gives a %s project with %o one primary link and verb labels", (status, links, labels) => {
    const actions = getProjectActions(project({ status, links }))

    expect(actions.map(a => a.label)).toEqual(labels)
    expect(actions.map(a => a.primary)).toEqual(labels.map((_, i) => i === 0))
  })
})
