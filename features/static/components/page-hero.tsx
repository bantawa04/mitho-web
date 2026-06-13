import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
}

export function PageHero({ eyebrow, title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-surface-soft">
      <div className="container mx-auto px-4 py-10 md:py-14">
        {breadcrumb && breadcrumb.length > 0 && <MithoBreadcrumb items={breadcrumb} className="mb-6" />}
        {eyebrow && <p className="type-eyebrow mb-3 text-brand-orange">{eyebrow}</p>}
        <h1 className="type-page-title text-brand-dark-green">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  )
}
