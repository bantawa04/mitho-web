export type MediaType = "image" | "video" | "document"
export type MediaStatus = "pending" | "ready"
export type MediaVisibility = "public" | "private"

export interface Media {
  id: string
  ownerId: string
  ownerType: string
  filename: string
  mimeType: string
  mediaType: MediaType
  sizeBytes?: number
  publicUrl: string
  visibility?: MediaVisibility
  purpose?: string
  status: MediaStatus
  title?: string
  altText?: string
  createdAt: string
  updatedAt: string
}

export interface MediaUploadTicket {
  media: Media
  uploadUrl: string
  expiresAt: string
}

export interface CreateUploadPayload {
  filename: string
  mimeType: string
  sizeBytes?: number
}

export interface UpdateMediaPayload {
  title?: string
  altText?: string
}

export interface ListMediaParams {
  type?: MediaType
  scope?: string
}
