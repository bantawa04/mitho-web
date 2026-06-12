"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveAdminGalleryItem,
  listAdminGallery,
  rejectAdminGalleryItem,
} from "@/lib/api/admin-gallery"
import { queryKeys } from "@/lib/api/query-keys"
import type { ListAdminGalleryParams, RejectGalleryItemPayload } from "@/types/gallery"

export function useAdminGallery(params: ListAdminGalleryParams) {
  return useQuery({
    queryKey: queryKeys.admin.gallery.list(params),
    queryFn: () => listAdminGallery(params),
  })
}

export function useApproveAdminGalleryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveAdminGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.gallery.all })
    },
  })
}

export function useRejectAdminGalleryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectGalleryItemPayload }) =>
      rejectAdminGalleryItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.gallery.all })
    },
  })
}
