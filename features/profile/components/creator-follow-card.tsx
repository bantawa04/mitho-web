"use client"

import Link from "next/link"
import { UserCheck, UserPlus } from "lucide-react"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useFollowUser, useUnfollowUser } from "@/hooks/use-profile"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import type { PublicCreatorItem } from "@/lib/api/profile"

export function CreatorFollowCard({ item }: { item: PublicCreatorItem }) {
  const { authUser } = useAuthSnapshot()
  const currentUsername = authUser?.user.username
  const isOwnCard = !!currentUsername && currentUsername === item.username

  const followMutation = useFollowUser(item.username)
  const unfollowMutation = useUnfollowUser(item.username)
  const isToggling = followMutation.isPending || unfollowMutation.isPending

  const handleToggle = () => {
    if (isOwnCard || isToggling) return
    if (item.isFollowedByCurrentUser) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-brand-deep-green/10 bg-white p-5 transition-colors duration-200 hover:border-brand-deep-green/18">
      <div className="flex items-start gap-3">
        <Link href={`/users/${item.username}`} className="flex min-w-0 flex-1 items-start gap-3">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="h-12 w-12 shrink-0 rounded-full border-2 border-brand-soft-beige object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-soft-beige bg-brand-deep-green/10 text-base font-semibold text-brand-deep-green">
              {item.name ? item.name[0].toUpperCase() : "?"}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-brand-dark-green">{item.name}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep-green/58">
              @{item.username}
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MithoBadge variant="muted">{item.followerCount} followers</MithoBadge>
        <MithoBadge variant="neutral">{item.collectionCount} collections</MithoBadge>
        <MithoBadge variant="muted">{item.reviewCount} reviews</MithoBadge>
      </div>

      {!isOwnCard ? (
        <div className="mt-4">
          <MithoButton
            type="button"
            variant={item.isFollowedByCurrentUser ? "outline-secondary" : "secondary"}
            size="sm"
            className="w-full"
            disabled={isToggling}
            onClick={handleToggle}
          >
            {item.isFollowedByCurrentUser ? (
              <>
                <UserCheck className="h-4 w-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Follow
              </>
            )}
          </MithoButton>
        </div>
      ) : null}
    </div>
  )
}
