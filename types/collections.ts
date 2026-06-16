import type { Media } from "@/types/media"

export type CollectionVisibility = "private" | "public"
export type CollectionSort = "recent" | "alpha" | "size"

export interface CollectionOwner {
  id: string
  name: string
  username?: string | null
  avatarUrl?: string | null
}

export interface CollectionProvenance {
  copiedFromCollectionId?: string | null
  copiedFromUserId?: string | null
  copiedFromUsername?: string | null
  copiedAt?: string | null
}

export interface CollectionBusinessRecord {
  id: string
  name: string
  slug: string
  location: string
  category: string
  publicHref: string
  image?: Media | null
}

export interface CollectionItemRecord {
  id: string
  businessId: string
  note?: string | null
  position: number
  isUnavailable: boolean
  business?: CollectionBusinessRecord | null
}

export interface CollectionRecord {
  id: string
  title: string
  description?: string | null
  visibility: CollectionVisibility
  owner: CollectionOwner
  provenance?: CollectionProvenance | null
  itemCount: number
  coverImages: Media[]
  items: CollectionItemRecord[]
  hasBusiness?: boolean
  createdAt: string
  updatedAt: string
}

export interface CollectionCandidate {
  id: string
  businessName: string
  location: string
  category: string
  note: string
  imageUrl: string
  publicHref: string
  businessId: string
}

export interface CollectionsListResponse {
  items: CollectionRecord[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface ListCollectionsParams {
  page?: number
  perPage?: number
  search?: string
  sort?: CollectionSort
  businessId?: string
  includeItems?: boolean
}

export interface CreateCollectionPayload {
  title: string
  description?: string
  visibility: CollectionVisibility
  initialItem?: {
    businessId: string
    note?: string
  }
}

export interface UpdateCollectionPayload {
  title: string
  description?: string
  visibility: CollectionVisibility
}

export interface AddCollectionItemPayload {
  businessId: string
  note?: string
}

export interface UpdateCollectionItemPayload {
  note?: string
}

export interface ReorderCollectionItemsPayload {
  itemIds: string[]
}
