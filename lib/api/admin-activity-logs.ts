import API from "@/config/api"
import type { ListAdminActivityLogsParams, PaginatedAdminActivityLogs } from "@/types/admin-activity-logs"
import type { ISuccessResponse } from "@/types/response"

export async function listAdminActivityLogs(
  params: ListAdminActivityLogsParams = {},
): Promise<PaginatedAdminActivityLogs> {
  const { data } = await API.get<ISuccessResponse<PaginatedAdminActivityLogs>>("/admin/activity-logs", { params })
  return data.data
}
