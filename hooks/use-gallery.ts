"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addGalleryItems,
  deleteGalleryItem,
  listBusinessGallery,
  updateGalleryItem,
} from "@/lib/api/gallery"
import { queryKeys } from "@/lib/api/query-keys"
import type { AddGalleryItemsPayload, UpdateGalleryItemPayload } from "@/types/gallery"

export function useBusinessGallery(businessId: string) {
  return useQuery({
    queryKey: queryKeys.businesses.gallery(businessId),
    queryFn: () => listBusinessGallery(businessId),
    enabled: Boolean(businessId),
  })
}

export function useAddGalleryItems(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddGalleryItemsPayload) => addGalleryItems(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.gallery(businessId) })
    },
  })
}

export function useUpdateGalleryItem(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ attachmentId, payload }: { attachmentId: string; payload: UpdateGalleryItemPayload }) =>
      updateGalleryItem(businessId, attachmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.gallery(businessId) })
    },
  })
}

export function useDeleteGalleryItem(businessId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: string) => deleteGalleryItem(businessId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.gallery(businessId) })
    },
  })
}
