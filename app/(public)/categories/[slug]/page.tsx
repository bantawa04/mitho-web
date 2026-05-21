import { notFound } from "next/navigation"
import { CategoryDetailPage } from "@/features/discovery/categories/category-detail-page"
import { CATEGORY_METADATA, isCategorySlug } from "@/content/taxonomy/category-taxonomy"

interface CategoryRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CATEGORY_METADATA.map((category) => ({ slug: category.slug }))
}

export default async function CategoryDetailRoute({ params }: CategoryRouteProps) {
  const { slug } = await params

  if (!isCategorySlug(slug)) {
    notFound()
  }

  return <CategoryDetailPage slug={slug} />
}
