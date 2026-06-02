"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  confirmUpload,
  deleteMedia,
  listMedia,
  requestUpload,
  updateMedia,
  uploadFileToR2,
} from "@/lib/api/media"
import { queryKeys } from "@/lib/api/query-keys"
import type { ListMediaParams, Media, UpdateMediaPayload } from "@/types/media"

export function useMedia(params?: ListMediaParams) {
  return useQuery({
    queryKey: queryKeys.media.list(params),
    queryFn: () => listMedia(params),
  })
}

interface UploadMediaInput {
  file: File
  title?: string
  altText?: string
}

export function useUploadMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, title, altText }: UploadMediaInput): Promise<Media> => {
      const ticket = await requestUpload({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      })

      await uploadFileToR2(ticket.uploadUrl, file)

      const confirmed = await confirmUpload(ticket.media.id)

      if ((title || altText) && (confirmed.title !== title || confirmed.altText !== altText)) {
        return updateMedia(confirmed.id, { title, altText })
      }

      return confirmed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all })
    },
  })
}

export function useUpdateMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMediaPayload }) =>
      updateMedia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all })
    },
  })
}
