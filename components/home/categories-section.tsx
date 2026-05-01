import { Utensils, Truck, Soup, Coffee, MapPin, Building2 } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { CategoryCard } from "@/components/ui/mitho-category-card"

const categories = [
  { icon: <Utensils className="h-6 w-6" />, label: "Restaurants", href: "#" },
  { icon: <Truck className="h-6 w-6" />, label: "Food Trucks", href: "#" },
  { icon: <Soup className="h-6 w-6" />, label: "Street Food", href: "#" },
  { icon: <Coffee className="h-6 w-6" />, label: "Cafes", href: "#" },
  { icon: <MapPin className="h-6 w-6" />, label: "Local Cuisine", href: "#" },
  { icon: <Building2 className="h-6 w-6" />, label: "Fine Dining", href: "#" },
]

export function CategoriesSection() {
  return (
    <MithoSection
      id="categories"
      eyebrow="Browse"
      title="Pick a craving, not a generic category"
      subtitle="Scan the kinds of places people in Nepal actually look for most."
      density="compact"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </div>
    </MithoSection>
  )
}
