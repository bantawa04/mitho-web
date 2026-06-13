"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  getBusinessDetail,
  getBusinessHours,
  listBusinesses,
  listMyBusinesses,
  replaceBusinessHours,
  searchBusinesses,
  updateBusiness,
} from "@/lib/api/businesses"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  CreateBusinessPayload,
  ListBusinessesParams,
  ReplaceHoursPayload,
  SearchBusinessesParams,
  UpdateBusinessPayload,
} from "@/types/business"

export function useMyBusinesses() {
  return useQuery({
    queryKey: queryKeys.businesses.mine,
    queryFn: listMyBusinesses,
  })
}

export function useMyBusiness(id: string | undefined) {
  const cleanId = id?.trim()
  const query = useMyBusinesses()
  const entry = cleanId ? (query.data ?? []).find((e) => e.business.id === cleanId) : undefined
  return { ...query, entry }
}

export function useBusinesses(params?: ListBusinessesParams) {
  return useQuery({
    queryKey: queryKeys.businesses.list(params),
    queryFn: () => listBusinesses(params),
  })
}

export function useBusinessSearch(params: SearchBusinessesParams) {
  return useQuery({
    queryKey: queryKeys.businesses.search(params),
    queryFn: () => searchBusinesses(params),
    // Keep previous page/result set on screen during background refetch
    // so filter/pagination changes don't flash an empty list.
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  })
}

export function useBusiness(id: string | undefined) {
  const cleanId = id?.trim()
  return useQuery({
    queryKey: queryKeys.businesses.detail(cleanId ?? ""),
    queryFn: () => getBusiness(cleanId!),
    enabled: Boolean(cleanId),
  })
}

export function useBusinessDetail(id: string | undefined) {
  const cleanId = id?.trim()
  return useQuery({
    queryKey: queryKeys.businesses.detail(cleanId ?? ""),
    queryFn: () => getBusinessDetail(cleanId!),
    enabled: Boolean(cleanId),
  })
}

export function useCreateBusiness() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBusinessPayload) => createBusiness(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
    },
  })
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBusinessPayload }) =>
      updateBusiness(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(id.trim()) })
    },
  })
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBusiness(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
    },
  })
}

export function useBusinessHours(businessId: string) {
  const cleanBusinessId = businessId.trim()
  return useQuery({
    queryKey: queryKeys.businesses.hours(cleanBusinessId),
    queryFn: () => getBusinessHours(cleanBusinessId),
    enabled: Boolean(cleanBusinessId),
  })
}

export function useReplaceBusinessHours(businessId: string) {
  const cleanBusinessId = businessId.trim()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReplaceHoursPayload) => replaceBusinessHours(cleanBusinessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.hours(cleanBusinessId) })
    },
  })
}
