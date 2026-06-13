"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  listBusinessMemberships,
  removeBusinessMembership,
  updateBusinessMembership,
} from "@/lib/api/business-memberships"
import { queryKeys } from "@/lib/api/query-keys"
import type { UpdateMembershipPayload } from "@/types/business-memberships"

export function useBusinessMemberships(businessId: string) {
  return useQuery({
    queryKey: queryKeys.businessMemberships.list(businessId),
    queryFn: () => listBusinessMemberships(businessId),
    enabled: !!businessId,
  })
}

export function useUpdateBusinessMembership(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, payload }: { membershipId: string; payload: UpdateMembershipPayload }) =>
      updateBusinessMembership(businessId, membershipId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessMemberships.list(businessId) })
    },
  })
}

export function useRemoveBusinessMembership(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (membershipId: string) => removeBusinessMembership(businessId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessMemberships.list(businessId) })
    },
  })
}
