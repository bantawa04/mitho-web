"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAdminCuisine,
  deleteAdminCuisine,
  listAdminCuisines,
  updateAdminCuisine,
} from "@/lib/api/admin-cuisines"
import { queryKeys } from "@/lib/api/query-keys"
import type { CreateAdminCuisinePayload, UpdateAdminCuisinePayload } from "@/types/admin-cuisines"

export function useAdminCuisines() {
  return useQuery({
    queryKey: queryKeys.admin.cuisines.list(),
    queryFn: listAdminCuisines,
  })
}

export function useCreateAdminCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAdminCuisinePayload) => createAdminCuisine(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.cuisines.all })
    },
  })
}

export function useUpdateAdminCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminCuisinePayload }) =>
      updateAdminCuisine(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.cuisines.all })
    },
  })
}

export function useDeleteAdminCuisine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminCuisine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.cuisines.all })
    },
  })
}
