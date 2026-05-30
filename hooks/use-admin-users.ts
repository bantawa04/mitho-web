"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteAdminUser,
  inviteAdminUser,
  listAdminUsers,
  replaceAdminUserRoles,
  updateAdminUser,
} from "@/lib/api/admin-users"
import { queryKeys } from "@/lib/api/query-keys"
import type { InviteAdminUserPayload, ListAdminUsersParams, UpdateAdminUserPayload } from "@/types/admin-users"

export function useAdminUsers(params: ListAdminUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params),
    queryFn: () => listAdminUsers(params),
  })
}

export function useInviteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InviteAdminUserPayload) => inviteAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserPayload }) => updateAdminUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}

export function useReplaceAdminUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) => replaceAdminUserRoles(id, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
    },
  })
}
