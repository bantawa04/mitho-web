import { MithoSection } from "@/components/ui/mitho-section"
import { CategoryCard } from "@/components/ui/mitho-category-card"
import { CATEGORY_METADATA, getCategoryIcon } from "@/components/categories/category-taxonomy"

export function CategoriesSection() {
  return (
    <MithoSection
      id="categories"
      eyebrow="Browse"
      title="Start with the kind of meal you want"
      subtitle="Quick ways into the food people in Nepal actually search for, without digging through generic directory labels."
      density="compact"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_METADATA.map((category) => (
          <CategoryCard
            key={category.slug}
            icon={getCategoryIcon(category.iconKey)}
            label={category.label}
            href={`/categories/${category.slug}`}
          />
        ))}
      </div>
    </MithoSection>
  )
}
