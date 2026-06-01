"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  listBusinesses,
  updateBusiness,
} from "@/lib/api/businesses"
import { queryKeys } from "@/lib/api/query-keys"
import type { CreateBusinessPayload, ListBusinessesParams, UpdateBusinessPayload } from "@/types/business"

export function useBusinesses(params?: ListBusinessesParams) {
  return useQuery({
    queryKey: queryKeys.businesses.list(params),
    queryFn: () => listBusinesses(params),
  })
}

export function useBusiness(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.businesses.detail(id ?? ""),
    queryFn: () => getBusiness(id!),
    enabled: Boolean(id),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(id) })
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
