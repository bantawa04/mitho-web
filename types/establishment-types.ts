export type EstablishmentTypeStatus = "active" | "disabled"

export interface EstablishmentType {
  id: string
  slug: string
  label: string
  status: EstablishmentTypeStatus
  listingsCount?: number
  createdAt: string
  updatedAt: string
}
