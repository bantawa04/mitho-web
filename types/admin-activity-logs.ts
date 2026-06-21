export type AdminActivityLogScope = "Businesses" | "Reviews" | "Users"

export const adminActivityLogScopeOptions: AdminActivityLogScope[] = ["Businesses", "Reviews", "Users"]

export interface AdminActivityLogItem {
  id: string
  actorName: string
  actorRole: string
  action: string
  actionLabel: string
  scope: AdminActivityLogScope
  targetLabel: string
  summary: string
  occurredAt: string
}

export interface AdminActivityLogMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface PaginatedAdminActivityLogs {
  items: AdminActivityLogItem[]
  meta: AdminActivityLogMeta
}

export interface ListAdminActivityLogsParams {
  page?: number
  per_page?: number
  scope?: AdminActivityLogScope
  search?: string
}
