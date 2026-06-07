export interface AdminCustomerItem {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  status: string
  createdAt: string
  updatedAt: string
  socialProvider: string | null
  lastSignInAt: string | null
  profileComplete: boolean
  businessNames: string[]
  hasBusiness: boolean
  reviewsCount: number
}

export interface AdminCustomersMeta {
  page: number
  totalPages: number
  perPage: number
  totalItems: number
}

export interface PaginatedAdminCustomers {
  customers: AdminCustomerItem[]
  meta: AdminCustomersMeta
}

export interface ListAdminCustomersParams {
  page?: number
  per_page?: number
  query?: string
  status?: string
}
