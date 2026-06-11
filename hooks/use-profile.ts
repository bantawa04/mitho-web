"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  followUser,
  getPublicProfile,
  listPublicCreators,
  unfollowUser,
  type ListPublicCreatorsParams,
  type PublicProfileData,
} from "@/lib/api/profile"

interface UsePublicCreatorDirectoryParams extends ListPublicCreatorsParams {
  enabled?: boolean
}
import { queryKeys } from "@/lib/api/query-keys"

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.profiles.public(username),
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicCreatorDirectory({ enabled = true, ...params }: UsePublicCreatorDirectoryParams = {}) {
  return useQuery({
    queryKey: queryKeys.profiles.directory(params),
    queryFn: () => listPublicCreators(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
    enabled,
  })
}

export function useFollowUser(username: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.profiles.public(username)

  return useMutation({
    mutationFn: () => followUser(username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<PublicProfileData>(key)
      queryClient.setQueryData<PublicProfileData>(key, (old) =>
        old ? { ...old, isFollowedByCurrentUser: true, followerCount: old.followerCount + 1 } : old
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}

export function useUnfollowUser(username: string) {
  const queryClient = useQueryClient()
  const key = queryKeys.profiles.public(username)

  return useMutation({
    mutationFn: () => unfollowUser(username),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<PublicProfileData>(key)
      queryClient.setQueryData<PublicProfileData>(key, (old) =>
        old ? { ...old, isFollowedByCurrentUser: false, followerCount: Math.max(0, old.followerCount - 1) } : old
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  })
}
