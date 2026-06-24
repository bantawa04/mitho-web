import API from "@/config/api"
import type { ListNotificationsParams, PaginatedNotifications } from "@/types/notifications"
import type { ISuccessResponse } from "@/types/response"

export async function listNotifications(params: ListNotificationsParams = {}): Promise<PaginatedNotifications> {
  const { data } = await API.get<ISuccessResponse<PaginatedNotifications>>("/notifications", { params })
  return data.data
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await API.get<ISuccessResponse<{ count: number }>>("/notifications/unread-count")
  return data.data.count
}

export async function markNotificationRead(id: string): Promise<void> {
  await API.post<ISuccessResponse<unknown>>(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await API.post<ISuccessResponse<unknown>>("/notifications/read-all")
}
