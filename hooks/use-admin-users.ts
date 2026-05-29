"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteAdminUser,
  inviteAdminUser,
  listAdminUsers,
  replaceAdminUserRoles,
  type InviteAdminUserPayload,
  type ListAdminUsersParams,
} from "@/lib/api/admin-users"

export const adminUsersQueryKeys = {
  all: ["admin", "users"] as const,
  list: (params: ListAdminUsersParams) => ["admin", "users", "list", params] as const,
}

export function useAdminUsers(params: ListAdminUsersParams = {}) {
  return useQuery({
    queryKey: adminUsersQueryKeys.list(params),
    queryFn: () => listAdminUsers(params),
  })
}

export function useInviteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InviteAdminUserPayload) => inviteAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}

export function useReplaceAdminUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleIds }: { id: string; roleIds: string[] }) => replaceAdminUserRoles(id, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all })
    },
  })
}
