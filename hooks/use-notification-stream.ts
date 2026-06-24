"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { applyNotification } from "@/features/notifications/apply-notification"
import { subscribeNotificationStream } from "@/features/notifications/notification-stream-manager"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import type { NotificationItem } from "@/types/notifications"

/**
 * Keeps the notification caches warm for authenticated users by subscribing to
 * the shared, cross-tab notification stream. All tabs of a logged-in user share
 * a single SSE connection (Web Locks leader election + BroadcastChannel fan-out)
 * with a graceful per-tab fallback for browsers lacking that support.
 */
export function useNotificationStream() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthSnapshot()

  React.useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined" || typeof EventSource === "undefined") {
      return
    }

    const handler = (item: NotificationItem) => applyNotification(queryClient, item)
    return subscribeNotificationStream(handler)
  }, [isAuthenticated, queryClient])
}
