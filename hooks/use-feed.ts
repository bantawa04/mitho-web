"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getFeed, type FeedPage } from "@/lib/api/feed"
import { queryKeys } from "@/lib/api/query-keys"

const FEED_PAGE_SIZE = 20

export function useFeed(types?: string) {
  return useInfiniteQuery<FeedPage>({
    queryKey: queryKeys.feed.list({ types }),
    queryFn: ({ pageParam }) => getFeed({ cursor: pageParam as string | undefined, perPage: FEED_PAGE_SIZE, types }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    staleTime: 1000 * 60,
  })
}
