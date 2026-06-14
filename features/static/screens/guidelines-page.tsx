import Link from "next/link"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { PageHero } from "@/features/static/components/page-hero"

const sections = [
  {
    id: "reviews",
    heading: "Writing reviews",
    paragraphs: [
      "Reviews on Mitho Cha should reflect a real, personal experience. Write about what you actually ate, what the service was like, and whether you'd go back. Specifics help other people decide.",
    ],
    dos: [
      "Describe specific dishes, drinks, or experiences",
      "Be honest even when the experience was mixed",
      "Share context that helps others — time of day, occasion, who you went with",
    ],
    donts: [
      "Don't review a place you haven't visited in person",
      "Don't post on behalf of a business (owner reviews are not allowed)",
      "Don't include personal details about staff members",
      "Don't post the same review more than once",
    ],
  },
  {
    id: "respect",
    heading: "Respectful community",
    paragraphs: [
      "We're building a community around food — something most people care deeply about. Disagreement is fine; disrespect is not.",
      "Content that targets individuals personally, uses discriminatory language, or is designed to harass will be removed and may result in account suspension.",
    ],
    dos: [],
    donts: [],
  },
  {
    id: "accuracy",
    heading: "Accuracy and honesty",
    paragraphs: [
      "Fake reviews — positive or negative — undermine the platform for everyone. Whether you're a business owner, a competitor, or just trying to game ratings, we take manipulation seriously.",
      "We use a combination of automated checks and human review to detect fake or incentivised reviews. Accounts found engaging in this behaviour will be removed.",
    ],
    dos: [],
    donts: [],
  },
  {
    id: "photos",
    heading: "Photos and media",
    paragraphs: [
      "Photos should be relevant to the business — food, atmosphere, the space. Only share photos you took yourself or have the right to share.",
    ],
    dos: [
      "Upload clear, well-lit photos of food and the venue",
      "Only share photos from your actual visit",
    ],
    donts: [
      "Don't upload stock photos, screenshots, or photos taken from the business's own social media",
      "Don't post photos that show other customers without their consent",
    ],
  },
  {
    id: "businesses",
    heading: "For business owners",
    paragraphs: [
      "Claiming and managing your listing gives you the ability to keep your details accurate, respond to feedback, and represent your business well. In return, we ask that you use these tools honestly.",
      "Offering incentives for positive reviews, flagging legitimate negative reviews as fake, or providing misleading information in your listing are all violations of these guidelines.",
    ],
    dos: [],
    donts: [],
  },
  {
    id: "enforcement",
    heading: "Enforcement",
    paragraphs: [
      "Content that violates these guidelines may be edited, hidden, or removed. In serious or repeated cases, accounts may be suspended.",
      "If you believe content on the platform violates these guidelines, contact us. We review every report and take action where warranted.",
    ],
    dos: [],
    donts: [],
  },
]

export function GuidelinesPage() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <PageHero
          eyebrow="Community"
          title="Community guidelines"
          subtitle="Mitho Cha works because people contribute honestly. These guidelines explain what we expect from everyone on the platform."
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Community guidelines" }]}
        />

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="gap-12 lg:grid lg:grid-cols-[200px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-24">
                <p className="type-eyebrow mb-4 text-brand-deep-green/60">On this page</p>
                <ul className="space-y-2 border-l border-border">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-sm text-muted-foreground transition-colors hover:border-brand-orange hover:text-brand-dark-green"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <article className="max-w-3xl space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="type-section-title mb-4 text-brand-dark-green">{section.heading}</h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph, i) => (
                      <p key={i} className="leading-7 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                    {(section.dos.length > 0 || section.donts.length > 0) && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {section.dos.length > 0 && (
                          <div className="rounded-lg border border-border bg-white p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-deep-green/60">
                              Do
                            </p>
                            <ul className="space-y-2">
                              {section.dos.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                                  <span className="mt-0.5 shrink-0 text-brand-deep-green">+</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {section.donts.length > 0 && (
                          <div className="rounded-lg border border-border bg-white p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-deep-green/60">
                              Don&apos;t
                            </p>
                            <ul className="space-y-2">
                              {section.donts.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                                  <span className="mt-0.5 shrink-0 text-destructive">−</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              ))}

              <div className="border-t border-border pt-8 text-sm text-muted-foreground">
                Questions about these guidelines?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-brand-deep-green underline decoration-brand-orange/50 underline-offset-4 transition-colors hover:text-brand-orange"
                >
                  Contact us
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
