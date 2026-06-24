export interface NotificationItem {
  id: string
  type: string
  audience: "admin" | "business" | "user"
  title: string
  body: string
  entityType: string
  entityId: string
  businessId: string | null
  data: Record<string, unknown>
  readAt: string | null
  createdAt: string
}

export interface NotificationsMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
  unreadCount: number
}

export interface PaginatedNotifications {
  items: NotificationItem[]
  meta: NotificationsMeta
}

export interface ListNotificationsParams {
  status?: "unread" | "all"
  page?: number
  per_page?: number
}
