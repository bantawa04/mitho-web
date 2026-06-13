import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"

export type FeedItemType = "review.published" | "collection.published" | "collection.copied"

export interface FeedActor {
  id: string
  name: string
  username: string
  avatarUrl: string | null
}

export interface FeedReview {
  id: string
  businessName: string
  businessSlug: string
  publicHref: string
  rating: number
  excerpt: string
}

export interface FeedCollection {
  id: string
  title: string
  ownerUsername: string
  publicHref: string
  coverImages: string[]
  placeCount: number
}

export interface FeedItem {
  id: string
  type: FeedItemType
  occurredAt: string
  actor: FeedActor
  review?: FeedReview
  collection?: FeedCollection
}

export interface FeedPage {
  items: FeedItem[]
  nextCursor: string | null
}

export interface GetFeedParams {
  cursor?: string
  perPage?: number
  types?: string
}

export async function getFeed(params: GetFeedParams = {}): Promise<FeedPage> {
  const { data } = await API.get<ISuccessResponse<FeedPage>>("/feed", {
    params: {
      cursor: params.cursor,
      per_page: params.perPage,
      types: params.types,
    },
  })
  return data.data
}
