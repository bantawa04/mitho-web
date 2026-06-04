export type CuisineStatus = "active" | "disabled"
export type AdminCuisineStatusFilter = "all" | CuisineStatus

export interface AdminCuisineItem {
  id: string
  name: string
  slug: string
  status: CuisineStatus
  listingsCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateAdminCuisinePayload {
  name: string
  status?: CuisineStatus
}

export interface UpdateAdminCuisinePayload {
  name?: string
  status?: CuisineStatus
}
