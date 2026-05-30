"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAdminRole,
  deleteAdminRole,
  listAdminPermissions,
  listAdminRoles,
  updateAdminRole,
} from "@/lib/api/admin-roles"
import { queryKeys } from "@/lib/api/query-keys"
import type { UpsertRolePayload } from "@/types/admin-roles"

export function useAdminRoles() {
  return useQuery({
    queryKey: queryKeys.admin.roles.list(),
    queryFn: listAdminRoles,
  })
}

export function useAdminPermissions() {
  return useQuery({
    queryKey: queryKeys.admin.permissions.list(),
    queryFn: listAdminPermissions,
  })
}

export function useCreateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertRolePayload) => createAdminRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all })
    },
  })
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpsertRolePayload }) => updateAdminRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

export function useDeleteAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}
