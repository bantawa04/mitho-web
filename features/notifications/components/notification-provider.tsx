"use client"

import type { ReactNode } from "react"
import { useNotificationStream } from "@/hooks/use-notification-stream"

/**
 * Side-effect-only provider that keeps the realtime notification stream open
 * for authenticated users. Renders children untouched.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  useNotificationStream()
  return <>{children}</>
}
