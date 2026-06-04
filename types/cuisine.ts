export type CuisineStatus = "active" | "disabled"

export interface Cuisine {
  id: string
  name: string
  slug: string
  status: CuisineStatus
  listingsCount?: number
  createdAt: string
  updatedAt: string
}
