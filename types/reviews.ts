import type { Media } from "@/types/media"

export type ReviewStatus = "pending" | "approved" | "rejected"
export type ReviewSort = "latest" | "oldest" | "highest" | "lowest"
export type ReviewRejectionFlag =
  | "spam_or_fake"
  | "abusive_or_harassing"
  | "off_topic"
  | "duplicate"
  | "conflict_of_interest"
  | "inappropriate_media"
  | "other"

export interface ReviewAuthor {
  id: string
  name: string
  username?: string | null
  avatarUrl?: string | null
}

export interface ReviewItem {
  id: string
  businessId: string
  businessName?: string
  userId: string
  rating: number
  body: string
  status: ReviewStatus
  rejectionFlag?: ReviewRejectionFlag | null
  moderationNote?: string | null
  moderatedBy?: string | null
  moderatedAt?: string | null
  createdAt: string
  updatedAt: string
  author: ReviewAuthor
  media: Media[]
}

export interface ReviewRatingsSummary {
  averageRating: number
  totalReviews: number
  ratings: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface BusinessReviewsResponse {
  items: ReviewItem[]
  meta: PaginationMeta
  summary: ReviewRatingsSummary
}

export interface CreateReviewPayload {
  rating: number
  body: string
  mediaIds?: string[]
}

export interface ResubmitReviewPayload extends CreateReviewPayload {}

export interface RejectReviewPayload {
  rejectionFlag: ReviewRejectionFlag
  moderationNote?: string
}

export interface ListBusinessReviewsParams {
  page?: number
  perPage?: number
  sort?: ReviewSort
}

export interface ListAdminReviewsParams {
  page?: number
  perPage?: number
  status?: ReviewStatus | ""
  rejectionFlag?: ReviewRejectionFlag | ""
  businessId?: string
  search?: string
}

export interface AdminReviewsResponse {
  items: ReviewItem[]
  meta: PaginationMeta
}
