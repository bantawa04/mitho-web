"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { apiBaseUrl } from "@/config/api"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { toast } from "@/hooks/use-toast"
import type { NotificationItem, PaginatedNotifications } from "@/types/notifications"

const STREAM_URL = `${apiBaseUrl}/notifications/stream`
const MAX_BACKOFF_MS = 30_000
const BASE_BACKOFF_MS = 1_000

/**
 * Opens an authenticated SSE connection to the notifications stream and keeps
 * the notification caches warm. Only connects when the user is authenticated.
 */
export function useNotificationStream() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthSnapshot()

  React.useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined" || typeof EventSource === "undefined") {
      return
    }

    let eventSource: EventSource | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let attempt = 0
    let cancelled = false

    const handleNotification = (event: MessageEvent) => {
      let item: NotificationItem
      try {
        item = JSON.parse(event.data) as NotificationItem
      } catch {
        return
      }

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

    const connect = () => {
      if (cancelled) return

      eventSource = new EventSource(STREAM_URL, { withCredentials: true })

      eventSource.addEventListener("notification", handleNotification as EventListener)

      eventSource.onopen = () => {
        attempt = 0
      }

      eventSource.onerror = () => {
        // EventSource auto-reconnects, but we close and back off manually so the
        // delay is capped and predictable.
        eventSource?.close()
        eventSource = null

        if (cancelled) return

        const delay = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS)
        attempt += 1
        reconnectTimer = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      cancelled = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (eventSource) {
        eventSource.removeEventListener("notification", handleNotification as EventListener)
        eventSource.close()
      }
    }
  }, [isAuthenticated, queryClient])
}
