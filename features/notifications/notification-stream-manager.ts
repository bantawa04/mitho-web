import { apiBaseUrl } from "@/config/api"
import type { NotificationItem } from "@/types/notifications"

const STREAM_URL = `${apiBaseUrl}/notifications/stream`
const CHANNEL_NAME = "notifications"
const LEADER_LOCK_NAME = "notif-sse-leader"
const MAX_BACKOFF_MS = 30_000
const BASE_BACKOFF_MS = 1_000

export type NotificationHandler = (item: NotificationItem) => void

const handlers = new Set<NotificationHandler>()

let started = false

// EventSource / reconnect state (used by the leader, or the fallback path).
let eventSource: EventSource | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let attempt = 0

// Leadership state.
let isLeader = false
let releaseLeadership: (() => void) | null = null

// Cross-tab fan-out channel.
let broadcastChannel: BroadcastChannel | null = null

function dispatch(item: NotificationItem): void {
  handlers.forEach((handler) => {
    handler(item)
  })
}

function parseNotification(data: string): NotificationItem | null {
  try {
    return JSON.parse(data) as NotificationItem
  } catch {
    return null
  }
}

function clearReconnectTimer(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

function closeEventSource(): void {
  clearReconnectTimer()
  if (eventSource) {
    eventSource.removeEventListener("notification", handleEventSourceMessage as EventListener)
    eventSource.close()
    eventSource = null
  }
}

/**
 * Handles a `notification` SSE event. Behaviour depends on the role:
 * - Leader: dispatch locally AND fan out the parsed item to follower tabs.
 * - Fallback (no coordination available): dispatch locally only.
 */
function handleEventSourceMessage(event: MessageEvent): void {
  const item = parseNotification(event.data)
  if (!item) return

  dispatch(item)

  // Only the leader fans out to other tabs; the fallback path has no channel.
  if (isLeader && broadcastChannel) {
    broadcastChannel.postMessage(item)
  }
}

function connectEventSource(): void {
  // Stop conditions: manager stopped, or (in leader mode) leadership relinquished.
  if (!started) return

  eventSource = new EventSource(STREAM_URL, { withCredentials: true })

  eventSource.addEventListener("notification", handleEventSourceMessage as EventListener)

  eventSource.onopen = () => {
    attempt = 0
  }

  eventSource.onerror = () => {
    // EventSource auto-reconnects, but we close and back off manually so the
    // delay is capped and predictable.
    eventSource?.close()
    eventSource = null

    if (!started) return

    const delay = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS)
    attempt += 1
    reconnectTimer = setTimeout(connectEventSource, delay)
  }
}

function becomeLeader(): void {
  isLeader = true
  attempt = 0
  connectEventSource()
}

function handleBroadcastMessage(event: MessageEvent): void {
  // Followers receive the already-structured-cloned NotificationItem object,
  // so there is no JSON to parse here. BroadcastChannel does not echo to the
  // sender, so the leader never reprocesses its own posts.
  const item = event.data as NotificationItem | null
  if (!item || typeof item !== "object") return
  dispatch(item)
}

function start(): void {
  if (started) return
  if (typeof window === "undefined" || typeof EventSource === "undefined") return

  started = true
  attempt = 0

  const canCoordinate =
    typeof BroadcastChannel !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.locks

  if (!canCoordinate) {
    // Fallback: no leader election. Open the EventSource directly in this tab,
    // reproducing the previous one-connection-per-tab behaviour for browsers
    // that lack Web Locks or BroadcastChannel.
    isLeader = false
    connectEventSource()
    return
  }

  // Set up the cross-tab fan-out channel for both leader and followers.
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME)
  broadcastChannel.onmessage = handleBroadcastMessage

  // Leader election: exactly one tab holds the exclusive lock at a time. The
  // request resolves into a promise that we keep pending for as long as this
  // tab should remain leader. Storing `release` lets `stop()` relinquish it;
  // a page unload auto-releases the held lock so a queued follower's pending
  // request resolves and it becomes the new leader.
  navigator.locks.request(LEADER_LOCK_NAME, { mode: "exclusive" }, () =>
    new Promise<void>((release) => {
      releaseLeadership = release
      becomeLeader()
    }),
  )
}

function stop(): void {
  if (!started) return
  started = false

  closeEventSource()

  if (releaseLeadership) {
    releaseLeadership()
    releaseLeadership = null
  }
  isLeader = false

  if (broadcastChannel) {
    broadcastChannel.onmessage = null
    broadcastChannel.close()
    broadcastChannel = null
  }

  attempt = 0
}

/**
 * Subscribes a handler to the shared notification stream. The first subscriber
 * starts the underlying connection/coordination; the last unsubscribe tears it
 * down. Ref-counting keeps this safe under React StrictMode double-mounts and
 * across multiple concurrent subscribers.
 */
export function subscribeNotificationStream(handler: NotificationHandler): () => void {
  handlers.add(handler)

  if (handlers.size === 1) {
    start()
  }

  return () => {
    handlers.delete(handler)
    if (handlers.size === 0) {
      stop()
    }
  }
}
