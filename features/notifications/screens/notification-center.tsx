"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useMarkAllRead, useMarkRead, useNotifications, useUnreadCount } from "@/hooks/use-notifications"
import { getNotificationHref, getNotificationIcon } from "@/features/notifications/notification-registry"
import type { ListNotificationsParams, NotificationItem } from "@/types/notifications"

const PER_PAGE = 20

function relativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ""
  }
}

export function NotificationCenter() {
  const router = useRouter()
  const [status, setStatus] = React.useState<NonNullable<ListNotificationsParams["status"]>>("all")
  const [page, setPage] = React.useState(1)

  const notificationsQuery = useNotifications({ status, page, per_page: PER_PAGE })
  const unreadCountQuery = useUnreadCount()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const items = notificationsQuery.data?.items ?? []
  const totalPages = notificationsQuery.data?.meta.totalPages ?? 1
  const total = notificationsQuery.data?.meta.total ?? 0
  const unreadCount = unreadCountQuery.data ?? 0

  React.useEffect(() => {
    setPage(1)
  }, [status])

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1)
  }, [page, totalPages])

  const handleRowClick = (item: NotificationItem) => {
    if (!item.readAt) markRead.mutate(item.id)
    const href = getNotificationHref(item)
    if (href && href !== "#") router.push(href)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-dark-green">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending || unreadCount === 0}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-brand-deep-green/10 bg-white px-3 py-2 text-sm font-medium text-brand-deep-green shadow-sm transition-colors hover:bg-muted disabled:opacity-50 sm:self-auto"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </button>
      </div>

      <Tabs
        value={status}
        onValueChange={(value) => setStatus(value as ListNotificationsParams["status"] as "all" | "unread")}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 overflow-hidden rounded-xl border border-brand-deep-green/10 bg-white shadow-sm">
        {notificationsQuery.isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notificationsQuery.isError ? (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            Could not load notifications. Reload the page and try again.
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-muted-foreground">
            <Bell className="h-8 w-8 opacity-40" />
            <p className="text-sm">
              {status === "unread" ? "No unread notifications." : "No notifications yet."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-brand-deep-green/10">
            {items.map((item) => {
              const Icon = getNotificationIcon(item)
              const isUnread = !item.readAt
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleRowClick(item)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-muted",
                      isUnread && "bg-brand-soft-beige/30",
                    )}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-brand-dark-green">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-brand-dark-green">{item.title}</span>
                      <span className="mt-0.5 block text-sm leading-5 text-muted-foreground">{item.body}</span>
                      <span className="mt-1.5 block text-xs font-medium text-muted-foreground">
                        {relativeTime(item.createdAt)}
                      </span>
                    </span>
                    {isUnread ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-orange" aria-label="Unread" />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-brand-deep-green/10 bg-white px-3 py-2 text-sm font-medium text-brand-dark-green shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-brand-deep-green/10 bg-white px-3 py-2 text-sm font-medium text-brand-dark-green shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
