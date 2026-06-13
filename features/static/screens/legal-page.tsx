import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { legalDocs } from "@/features/static/data/legal-content"

export function LegalPage({ doc }: { doc: "privacy" | "terms" }) {
  const content = legalDocs[doc]

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main>
        <section className="border-b border-border bg-surface-soft">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: content.title }]} className="mb-6" />
            <h1 className="type-page-title text-brand-dark-green">{content.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: {content.lastUpdated}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{content.intro}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="gap-12 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <nav aria-label="Table of contents" className="sticky top-24">
                <p className="type-eyebrow mb-4 text-brand-deep-green/60">On this page</p>
                <ul className="space-y-2 border-l border-border">
                  {content.sections.map((section) => (
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

            <article className="max-w-3xl">
              {content.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24 pb-10">
                  <h2 className="type-section-title mb-4 text-brand-dark-green">{section.heading}</h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index} className="leading-7 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="ml-5 list-disc space-y-2 text-muted-foreground">
                        {section.bullets.map((bullet, index) => (
                          <li key={index} className="leading-7">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
