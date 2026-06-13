import type { FeedActor } from "@/lib/api/feed"

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Date.now() - then
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return "just now"
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export function ActorAvatar({ actor, size = 44 }: { actor: FeedActor; size?: number }) {
  if (actor.avatarUrl) {
    return (
      <img
        src={actor.avatarUrl}
        alt={actor.name}
        style={{ height: size, width: size }}
        className="shrink-0 rounded-full border-2 border-brand-soft-beige object-cover"
      />
    )
  }
  const initial = actor.name ? actor.name[0].toUpperCase() : "?"
  return (
    <div
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-brand-soft-beige bg-brand-deep-green/10 text-base font-semibold text-brand-deep-green"
    >
      {initial}
    </div>
  )
}
