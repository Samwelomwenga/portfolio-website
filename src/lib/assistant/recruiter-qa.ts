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
      "His two featured builds are the Learning Portal Redesign — a Next.js parent and student portal with AI-powered revision tools, personalized learning pathways, analytics, and gamification — and the eTIMS Integration, which wired Kenya's eTIMS e-invoicing into internal software with .NET Core.",
    grounds: ["proj-learning-portal-redesign", "proj-etims-integration"],
  },
  {
    slug: "cloud-experience",
    question: "Does Samwel have cloud experience?",
    answer:
      "He holds the AWS Certified Cloud Practitioner and Kubernetes & Cloud Native Associate (KCNA) certifications, and builds platform services and portals at Africa Cloud Space.",
    grounds: ["cert-aws-ccp", "cert-kcna", "exp-africa-cloud-space"],
  },
  {
    slug: "fintech-fit",
    question: "Is Samwel a fit for a fintech or payments backend role?",
    answer:
      "His eTIMS Integration connected Kenya's eTIMS e-invoicing to internal software with .NET Core, EF Core, and Postgres — tax-compliance and invoicing domain work that overlaps payments and compliance backends. He has not listed a role titled fintech, so treat this as adjacent, transferable experience rather than a stated fintech background.",
    grounds: ["proj-etims-integration", "skills-frameworks"],
  },
]
