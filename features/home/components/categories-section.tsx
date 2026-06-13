"use client"

import { Utensils } from "lucide-react"
import { MithoSection } from "@/components/mitho/mitho-section"
import { CategoryCard, categoryIcons } from "@/components/mitho/mitho-category-card"
import { useEstablishmentTypes } from "@/hooks/use-establishment-types"

const DEFAULT_ICON = <Utensils className="h-6 w-6" />

function getIcon(slug: string) {
  return categoryIcons[slug as keyof typeof categoryIcons] ?? DEFAULT_ICON
}

export function CategoriesSection() {
  const { data: categories = [] } = useEstablishmentTypes()
  const active = categories.filter((c) => c.status === "active")

  return (
    <MithoSection
      id="categories"
      eyebrow="Browse"
      title="Start with the kind of meal you want"
      subtitle="Quick ways into the food people in Nepal actually search for, without digging through generic directory labels."
      density="compact"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((category) => (
          <CategoryCard
            key={category.slug}
            icon={getIcon(category.slug)}
            label={category.label}
            href={`/categories/${category.slug}`}
          />
        ))}
      </div>
    </MithoSection>
  )
}
