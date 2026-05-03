import type { BusinessMenuItem } from "@/components/business/business-detail-types"

interface MenuHighlightsProps {
  isEarlyListing?: boolean
  items: BusinessMenuItem[]
  emptyMessage?: string
  menuLink?: string
}

export function MenuHighlights({ isEarlyListing = false, items, emptyMessage, menuLink }: MenuHighlightsProps) {
  const hasItems = items.length > 0

  return (
    <section className="container mx-auto px-4 py-10 md:py-12">
      <div className="mb-6">
        <p className="type-eyebrow text-brand-deep-green/70">What people come here for</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-section-title max-w-2xl text-brand-dark-green">A few standout dishes</h2>
          {hasItems && menuLink && (
            <a href={menuLink} className="text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange">
              View full menu
            </a>
          )}
        </div>
      </div>

      {hasItems ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-[1.5rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(10,70,53,0.12)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                {item.isPopular && (
                  <div className="absolute left-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                    Most mentioned
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-brand-dark-green">{item.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-soft-beige px-3 py-1 text-sm font-semibold text-brand-dark-green">
                    {item.price}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          className={
            isEarlyListing
              ? "rounded-[1.45rem] border border-dashed border-brand-deep-green/12 bg-white/70 p-5"
              : "rounded-[1.6rem] border border-brand-deep-green/10 bg-white/80 p-6 shadow-[0_10px_28px_rgba(10,70,53,0.06)]"
          }
        >
          <p className="text-lg font-semibold text-brand-dark-green">
            {isEarlyListing ? "Dish highlights will show up once locals start reviewing" : "Menu highlights are still missing"}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {emptyMessage ??
              (isEarlyListing
                ? "This listing is still early. Once people start mentioning standout dishes, the most useful menu highlights can appear here."
                : "This business has not added any dish highlights yet.")}
          </p>
        </div>
      )}
    </section>
  )
}
