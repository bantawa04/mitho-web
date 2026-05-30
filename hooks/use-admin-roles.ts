"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAdminRole,
  deleteAdminRole,
  listAdminPermissions,
  listAdminRoles,
  updateAdminRole,
  type UpsertRolePayload,
} from "@/lib/api/admin-roles"

export const adminRolesQueryKeys = {
  all: ["admin", "roles"] as const,
  list: () => ["admin", "roles", "list"] as const,
  permissions: () => ["admin", "permissions"] as const,
}

export function useAdminRoles() {
  return useQuery({
    queryKey: adminRolesQueryKeys.list(),
    queryFn: listAdminRoles,
  })
}

export function useAdminPermissions() {
  return useQuery({
    queryKey: adminRolesQueryKeys.permissions(),
    queryFn: listAdminPermissions,
  })
}

export function useCreateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertRolePayload) => createAdminRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesQueryKeys.all })
    },
  })
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpsertRolePayload }) => updateAdminRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useDeleteAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRolesQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}
