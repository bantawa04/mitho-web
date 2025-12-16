import { Utensils, Truck, Soup, Coffee, MapPin, Building2 } from "lucide-react"
import { MithoSection } from "@/components/ui/mitho-section"
import { CategoryCard } from "@/components/ui/mitho-category-card"

const categories = [
  { icon: <Utensils className="h-6 w-6" />, label: "Restaurants", href: "/categories/restaurants" },
  { icon: <Truck className="h-6 w-6" />, label: "Food Trucks", href: "/categories/food-trucks" },
  { icon: <Soup className="h-6 w-6" />, label: "Street Food", href: "/categories/street-food" },
  { icon: <Coffee className="h-6 w-6" />, label: "Cafes", href: "/categories/cafes" },
  { icon: <MapPin className="h-6 w-6" />, label: "Local Cuisine", href: "/categories/local" },
  { icon: <Building2 className="h-6 w-6" />, label: "Fine Dining", href: "/categories/fine-dining" },
]

export function CategoriesSection() {
  return (
    <MithoSection
      title="Explore Local Flavors"
      subtitle="Browse eateries by category"
      className="bg-brand-soft-beige/20"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </div>
    </MithoSection>
  )
}
