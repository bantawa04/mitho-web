"use client"

import { useQuery } from "@tanstack/react-query"
import { getPublicProfile } from "@/lib/api/profile"
import { queryKeys } from "@/lib/api/query-keys"

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.profiles.public(username),
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })
}
