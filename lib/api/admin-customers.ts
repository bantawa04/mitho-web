import API from "@/config/api"
import type { ListAdminCustomersParams, PaginatedAdminCustomers } from "@/types/admin-customers"
import type { ISuccessResponse } from "@/types/response"

export async function listAdminCustomers(params: ListAdminCustomersParams = {}): Promise<PaginatedAdminCustomers> {
  const { data } = await API.get<ISuccessResponse<PaginatedAdminCustomers>>("/admin/customers", { params })
  return data.data
}
