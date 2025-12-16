import { DishCard } from "@/components/ui/mitho-dish-card"

const menuItems = [
  { name: "Steamed Momo", price: "Rs. 200", imageUrl: "/steamed-momo-nepali-dumplings.jpg", isPopular: true },
  { name: "Chicken Chowmein", price: "Rs. 250", imageUrl: "/chicken-chowmein-noodles.jpg" },
  { name: "Dal Bhat Set", price: "Rs. 350", imageUrl: "/dal-bhat-nepali-meal-set.jpg", isPopular: true },
  { name: "Thukpa", price: "Rs. 220", imageUrl: "/thukpa-tibetan-noodle-soup.jpg" },
  { name: "Sekuwa", price: "Rs. 400", imageUrl: "/sekuwa-nepali-grilled-meat.jpg" },
  { name: "Sel Roti", price: "Rs. 80", imageUrl: "/sel-roti-nepali-ring-bread.jpg" },
]

export function MenuHighlights() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Menu Highlights</h2>
        <a href="#" className="text-brand-orange hover:underline text-sm font-medium">
          View Full Menu
        </a>
      </div>
      <div
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {menuItems.map((item) => (
          <DishCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  )
}
