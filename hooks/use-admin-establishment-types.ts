"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAdminEstablishmentType,
  deleteAdminEstablishmentType,
  listAdminEstablishmentTypes,
  updateAdminEstablishmentType,
} from "@/lib/api/admin-establishment-types"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  CreateAdminEstablishmentTypePayload,
  UpdateAdminEstablishmentTypePayload,
} from "@/types/admin-establishment-types"

export function useAdminEstablishmentTypes() {
  return useQuery({
    queryKey: queryKeys.admin.establishmentTypes.list(),
    queryFn: listAdminEstablishmentTypes,
  })
}

export function useCreateAdminEstablishmentType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAdminEstablishmentTypePayload) => createAdminEstablishmentType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.establishmentTypes.all })
    },
  })
}

export function useUpdateAdminEstablishmentType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminEstablishmentTypePayload }) =>
      updateAdminEstablishmentType(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.establishmentTypes.all })
    },
  })
}

export function useDeleteAdminEstablishmentType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminEstablishmentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.establishmentTypes.all })
    },
  })
}
