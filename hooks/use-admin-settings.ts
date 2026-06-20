"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAdminSettings, updateAdminSettings } from "@/lib/api/admin-settings"
import { queryKeys } from "@/lib/api/query-keys"
import type { AdminSettings, UpdateAdminSettingsPayload } from "@/lib/api/admin-settings"

export function useAdminSettings() {
  return useQuery({
    queryKey: queryKeys.admin.settings.detail(),
    queryFn: getAdminSettings,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAdminSettingsPayload) => updateAdminSettings(payload),
    onSuccess: (settings: AdminSettings) => {
      queryClient.setQueryData(queryKeys.admin.settings.detail(), settings)
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.all })
    },
  })
}
