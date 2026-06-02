import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  CreateUploadPayload,
  ListMediaParams,
  Media,
  MediaUploadTicket,
  UpdateMediaPayload,
} from "@/types/media"

export async function requestUpload(payload: CreateUploadPayload): Promise<MediaUploadTicket> {
  const { data } = await API.post<ISuccessResponse<MediaUploadTicket>>("/media", payload)
  return data.data
}

export async function uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }
}

export async function confirmUpload(id: string): Promise<Media> {
  const { data } = await API.post<ISuccessResponse<Media>>(`/media/${id}/confirm`)
  return data.data
}

export async function listMedia(params?: ListMediaParams): Promise<Media[]> {
  const { data } = await API.get<ISuccessResponse<Media[]>>("/media", { params })
  return data.data
}

export async function updateMedia(id: string, payload: UpdateMediaPayload): Promise<Media> {
  const { data } = await API.patch<ISuccessResponse<Media>>(`/media/${id}`, payload)
  return data.data
}

export async function deleteMedia(id: string): Promise<void> {
  await API.delete(`/media/${id}`)
}
