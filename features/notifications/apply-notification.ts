import type { QueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { toast } from "@/hooks/use-toast"
import type { NotificationItem, PaginatedNotifications } from "@/types/notifications"

/**
 * Applies a single incoming notification to the query caches and surfaces a
 * toast. This is the exact cache-mutation + toast logic that previously lived
 * inline in `useNotificationStream`, extracted so it can be reused by every tab
 * regardless of whether the notification arrived via EventSource (leader) or
 * BroadcastChannel (follower).
 */
export function applyNotification(queryClient: QueryClient, item: NotificationItem): void {
  // Optimistically bump the unread count cache.
  queryClient.setQueryData<number>(queryKeys.notifications.unreadCount(), (current) =>
    typeof current === "number" ? current + 1 : current,
  )

  // Optimistically prepend to any cached notification list.
  queryClient.setQueriesData<PaginatedNotifications>(
    { queryKey: queryKeys.notifications.all },
    (current) => {
      if (!current || !Array.isArray(current.items)) return current
      if (current.items.some((existing) => existing.id === item.id)) return current
      return {
        ...current,
        items: [item, ...current.items],
        meta: {
          ...current.meta,
          total: current.meta.total + 1,
          unreadCount: current.meta.unreadCount + 1,
        },
      }
    },
  )

  // Ensure server truth wins eventually.
  queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() })
  queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })

  if (item.title) {
    toast({ title: item.title, description: item.body || undefined })
  }
}
