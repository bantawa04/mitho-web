"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveAdminBusinessClaim,
  createBusinessClaim,
  getAdminBusinessClaim,
  getClaimableBusiness,
  listAdminBusinessClaims,
  rejectAdminBusinessClaim,
  searchClaimableBusinesses,
} from "@/lib/api/business-claims"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  BusinessClaimDecisionPayload,
  CreateBusinessClaimPayload,
  ListBusinessClaimsParams,
} from "@/types/business-claims"

export function useClaimableBusinesses(search: string) {
  const normalizedSearch = search.trim()
  return useQuery({
    queryKey: queryKeys.businessClaims.claimable(normalizedSearch),
    queryFn: () => searchClaimableBusinesses(normalizedSearch),
    enabled: normalizedSearch.length >= 2,
  })
}

export function useClaimableBusiness(id: string | null) {
  return useQuery({
    queryKey: queryKeys.businessClaims.claimableDetail(id),
    queryFn: () => getClaimableBusiness(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useCreateBusinessClaim() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ businessId, payload }: { businessId: string; payload: CreateBusinessClaimPayload }) =>
      createBusinessClaim(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businessClaims.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.businessClaims.all })
    },
  })
}

export function useAdminBusinessClaims(params: ListBusinessClaimsParams) {
  return useQuery({
    queryKey: queryKeys.admin.businessClaims.list(params),
    queryFn: () => listAdminBusinessClaims(params),
  })
}

export function useAdminBusinessClaim(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.businessClaims.detail(id),
    queryFn: () => getAdminBusinessClaim(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useApproveBusinessClaim() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BusinessClaimDecisionPayload }) =>
      approveAdminBusinessClaim(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.businessClaims.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
    },
  })
}

export function useRejectBusinessClaim() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BusinessClaimDecisionPayload }) =>
      rejectAdminBusinessClaim(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.businessClaims.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
    },
  })
}
