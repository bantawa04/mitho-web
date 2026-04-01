const menuItems = [
  {
    name: "Steamed Momo",
    price: "Rs. 200",
    imageUrl: "/steamed-momo-nepali-dumplings.jpg",
    note: "The plate most reviewers mention first.",
    isPopular: true,
  },
  {
    name: "Dal Bhat Set",
    price: "Rs. 350",
    imageUrl: "/dal-bhat-nepali-meal-set.jpg",
    note: "Comforting, filling, and dependable.",
  },
  {
    name: "Thukpa",
    price: "Rs. 220",
    imageUrl: "/thukpa-tibetan-noodle-soup.jpg",
    note: "A strong pick on colder evenings.",
  },
  {
    name: "Sekuwa",
    price: "Rs. 400",
    imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
    note: "Worth it when you want something smoky.",
  },
]

export function MenuHighlights() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-12">
      <div className="mb-6">
        <p className="type-eyebrow text-brand-deep-green/70">What people come here for</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-section-title max-w-2xl text-brand-dark-green">A few standout dishes</h2>
          <a href="#" className="text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange">
            View full menu
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {menuItems.map((item) => (
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
    </section>
  )
}
