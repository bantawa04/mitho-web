import { NotFoundPage } from "@/features/static/screens/not-found-page"

export default function CityNotFound() {
  return (
    <NotFoundPage
      eyebrow="City not found"
      title="This city guide is not ready yet."
      description="Try heading back to the broader search page or to the home page while we keep expanding the city guides."
      primaryHref="/explore"
      primaryLabel="Open broader search"
      secondaryHref="/"
      secondaryLabel="Back to home"
    />
  )
}
