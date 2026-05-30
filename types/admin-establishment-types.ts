export type EstablishmentTypeStatus = "active" | "disabled"
export type AdminEstablishmentTypeStatusFilter = "all" | EstablishmentTypeStatus

export interface AdminEstablishmentTypeItem {
  id: string
  slug: string
  label: string
  status: EstablishmentTypeStatus
  listingsCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateAdminEstablishmentTypePayload {
  label: string
  status?: EstablishmentTypeStatus
}

export interface UpdateAdminEstablishmentTypePayload {
  label?: string
  status?: EstablishmentTypeStatus
}
