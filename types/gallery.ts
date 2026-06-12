import type { Media, MediaType } from "@/types/media"

export type GalleryItemStatus = "pending" | "approved" | "rejected"

export interface BusinessGalleryItem {
  id: string
  media: Media
  title?: string
  sortOrder: number
  status: GalleryItemStatus
  moderatedBy?: string
  moderatedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface AdminGalleryItem extends BusinessGalleryItem {
  business: {
    id: string
    name: string
    slug: string
  }
}

export interface GalleryItemInput {
  mediaId: string
  title?: string
}

export interface AddGalleryItemsPayload {
  items: GalleryItemInput[]
}

export interface UpdateGalleryItemPayload {
  title?: string
}

export interface RejectGalleryItemPayload {
  rejectionReason: string
}

export interface ListAdminGalleryParams {
  page?: number
  perPage?: number
  status?: GalleryItemStatus | ""
  type?: MediaType | ""
  businessId?: string
  search?: string
}

export interface AdminGalleryListResponse {
  items: AdminGalleryItem[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
