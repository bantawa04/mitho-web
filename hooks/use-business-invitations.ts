"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptInvitation,
  createBusinessInvitation,
  declineInvitation,
  listBusinessInvitations,
  listMyInvitations,
  revokeBusinessInvitation,
} from "@/lib/api/business-invitations"
import { queryKeys } from "@/lib/api/query-keys"
import { authQueryKeys } from "@/hooks/use-auth-session"
import type { CreateInvitePayload } from "@/types/business-invitations"

export function useBusinessInvitations(businessId: string) {
  return useQuery({
    queryKey: queryKeys.businessInvitations.list(businessId),
    queryFn: () => listBusinessInvitations(businessId),
    enabled: !!businessId,
  })
}

export function useCreateBusinessInvitation(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInvitePayload) => createBusinessInvitation(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessInvitations.list(businessId) })
    },
  })
}

export function useRevokeBusinessInvitation(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invitationId: string) => revokeBusinessInvitation(businessId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessInvitations.list(businessId) })
    },
  })
}

export function useMyInvitations() {
  return useQuery({
    queryKey: queryKeys.businessInvitations.mine,
    queryFn: listMyInvitations,
  })
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acceptInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessInvitations.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.mine })
      queryClient.invalidateQueries({ queryKey: authQueryKeys.session })
    },
  })
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => declineInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessInvitations.mine })
      queryClient.invalidateQueries({ queryKey: authQueryKeys.session })
    },
  })
}
