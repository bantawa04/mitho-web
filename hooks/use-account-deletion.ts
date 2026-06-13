"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cancelAccountDeletion, getDeletionPreflight, releaseBusinessOwnership, requestAccountDeletion } from "@/lib/api/account-deletion"
import { queryKeys } from "@/lib/api/query-keys"
import { authQueryKeys } from "@/hooks/use-auth-session"
import { useAuthStore } from "@/store/authStore"
import type { RequestDeletionPayload } from "@/types/account-deletion"

export function useDeletionPreflight(enabled = true) {
  return useQuery({
    queryKey: queryKeys.accountDeletion.preflight,
    queryFn: getDeletionPreflight,
    enabled,
  })
}

export function useRequestAccountDeletion() {
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RequestDeletionPayload) => requestAccountDeletion(payload),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null)
      clearAuth()
    },
  })
}

export function useCancelAccountDeletion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelAccountDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.session })
    },
  })
}

export function useReleaseBusinessOwnership(businessId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => releaseBusinessOwnership(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountDeletion.preflight })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.mine })
    },
  })
}
