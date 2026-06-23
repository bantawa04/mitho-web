"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMarkAllRead, useMarkRead, useNotifications, useUnreadCount } from "@/hooks/use-notifications"
import { getNotificationHref, getNotificationIcon } from "@/features/notifications/notification-registry"
import type { NotificationItem } from "@/types/notifications"

interface NotificationBellProps {
  viewAllHref: string
  className?: string
}

function relativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return ""
  }
}

export function NotificationBell({ viewAllHref, className }: NotificationBellProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const unreadCountQuery = useUnreadCount()
  const notificationsQuery = useNotifications({ status: "all", per_page: 8 })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const unreadCount = unreadCountQuery.data ?? 0
  const items = notificationsQuery.data?.items ?? []

  const handleRowClick = (item: NotificationItem) => {
    if (!item.readAt) {
      markRead.mutate(item.id)
    }
    setOpen(false)
    const href = getNotificationHref(item)
    if (href && href !== "#") {
      router.push(href)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className={cn(
            "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-deep-green/10 bg-white text-brand-dark-green shadow-sm transition-colors hover:border-brand-deep-green/18 hover:bg-muted",
            className,
          )}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[22rem] rounded-xl border-brand-deep-green/10 bg-white p-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-2 px-3 py-3">
          <div>
            <p className="font-semibold text-brand-dark-green">Notifications</p>
            {unreadCount > 0 ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{unreadCount} unread</p>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                markAllRead.mutate()
              }}
              disabled={markAllRead.isPending}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-deep-green transition-colors hover:bg-muted disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-0" />

        <ScrollArea className="max-h-[22rem]">
          {notificationsQuery.isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </div>
          ) : (
            <ul className="py-1">
              {items.map((item) => {
                const Icon = getNotificationIcon(item)
                const isUnread = !item.readAt
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleRowClick(item)}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted",
                        isUnread && "bg-brand-soft-beige/30",
                      )}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-brand-dark-green">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-brand-dark-green">{item.title}</span>
                        <span className="mt-0.5 block truncate text-xs leading-5 text-muted-foreground">{item.body}</span>
                        <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
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
        </ScrollArea>

        <DropdownMenuSeparator className="my-0" />
        <div className="p-2">
          <Link
            href={viewAllHref}
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-brand-deep-green transition-colors hover:bg-muted"
          >
            View all
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
