import "server-only"

/**
 * Server-only curated recruiter Q&A.
 *
 * Per the portfolio source-of-truth decision, curated Q&A is allowed only as
 * server-side guidance backed by canonical portfolio facts — it introduces no
 * new facts of its own. It is never shipped to the client bundle (guarded by
 * `server-only`) and is emitted into the assistant context as `qa-<slug>`
 * units by `buildPortfolioContext()`.
 *
 * Each answer paraphrases facts already present in `portfolio-data.ts`; the
 * `grounds` list names the Source IDs each answer leans on, for traceability.
 */
export type RecruiterQA = {
  /** Stable slug — the builder emits `qa-<slug>`. */
  slug: string
  question: string
  answer: string
  /** Source IDs of the canonical facts this curated answer rests on. */
  grounds: readonly string[]
}

export const recruiterQA: readonly RecruiterQA[] = [
  {
    slug: "strongest-projects",
    question: "What are Samwel's strongest projects for a recruiter?",
    answer:
      "His featured projects are Chalk App, a React Native and ASP.NET Core app live on the Play Store that tracks pool games and settles money-match math; Laneway API, an ASP.NET Core and PostgreSQL REST API for a kanban board app, running in production on Terraform-managed infrastructure; and Weather App, a React and TypeScript forecast app built on the Open-Meteo APIs.",
    grounds: ["proj-chalk-app", "proj-laneway-api", "proj-weather-app"],
  },
  {
    slug: "cloud-experience",
    question: "Does Samwel have cloud experience?",
    answer:
      "He holds the AWS Certified Cloud Practitioner and Kubernetes & Cloud Native Associate (KCNA) certifications, built platform services and portals at Africa Cloud Space, and runs Laneway API on an Oracle Cloud VM provisioned with Terraform.",
    grounds: ["cert-aws-ccp", "cert-kcna", "exp-africa-cloud-space", "proj-laneway-api"],
  },
]
