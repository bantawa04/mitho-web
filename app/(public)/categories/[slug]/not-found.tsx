import { NotFoundPage } from "@/features/static/screens/not-found-page"

export default function CategoryNotFound() {
  return (
    <NotFoundPage
      eyebrow="Category not found"
      title="This category guide is not ready yet."
      description="Try heading back to the main category list or open the broader search page to keep browsing local food picks."
      primaryHref="/#categories"
      primaryLabel="Back to categories"
      secondaryHref="/explore"
      secondaryLabel="Open broader search"
    />
  )
}
