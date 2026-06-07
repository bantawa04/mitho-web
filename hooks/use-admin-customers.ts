"use client"

import { useQuery } from "@tanstack/react-query"
import { listAdminCustomers } from "@/lib/api/admin-customers"
import { queryKeys } from "@/lib/api/query-keys"
import type { ListAdminCustomersParams } from "@/types/admin-customers"

export function useAdminCustomers(params: ListAdminCustomersParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.customers.list(params),
    queryFn: () => listAdminCustomers(params),
  })
}
