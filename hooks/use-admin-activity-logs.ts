"use client"

import { useQuery } from "@tanstack/react-query"
import { listAdminActivityLogs } from "@/lib/api/admin-activity-logs"
import { queryKeys } from "@/lib/api/query-keys"
import type { ListAdminActivityLogsParams } from "@/types/admin-activity-logs"

export function useAdminActivityLogs(params: ListAdminActivityLogsParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.activityLogs.list(params),
    queryFn: () => listAdminActivityLogs(params),
    placeholderData: (prev) => prev,
  })
}
