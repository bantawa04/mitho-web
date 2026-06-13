import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  AdminReviewsResponse,
  BusinessReviewsResponse,
  CreateReviewPayload,
  ListAdminReviewsParams,
  ListBusinessReviewsParams,
  ListMyReviewsParams,
  MyBusinessReviewStatus,
  MyReviewsResponse,
  RejectReviewPayload,
  ResubmitReviewPayload,
  ReviewItem,
  UpsertReviewReplyPayload,
  UpdateReviewPayload,
} from "@/types/reviews"

function mapListParams(params?: ListBusinessReviewsParams) {
  if (!params) return undefined
  return {
    page: params.page,
    per_page: params.perPage,
    sort: params.sort,
  }
}

function mapAdminParams(params?: ListAdminReviewsParams) {
  if (!params) return undefined
  return {
    page: params.page,
    per_page: params.perPage,
    status: params.status || undefined,
    rejection_flag: params.rejectionFlag || undefined,
    business_id: params.businessId || undefined,
    search: params.search || undefined,
  }
}

function toSnakeCase(payload: CreateReviewPayload | ResubmitReviewPayload) {
  return {
    rating: payload.rating,
    body: payload.body,
    media_ids: payload.mediaIds ?? [],
  }
}

export async function listBusinessReviews(businessId: string, params?: ListBusinessReviewsParams): Promise<BusinessReviewsResponse> {
  const { data } = await API.get<ISuccessResponse<BusinessReviewsResponse>>(`/businesses/${businessId.trim()}/reviews`, {
    params: mapListParams(params),
  })
  return data.data
}

export async function getMyBusinessReview(businessId: string): Promise<MyBusinessReviewStatus> {
  const { data } = await API.get<ISuccessResponse<MyBusinessReviewStatus | null>>(`/businesses/${businessId.trim()}/reviews/me`)
  return data.data ?? { review: null, canReview: true }
}

export async function listMyReviews(params?: ListMyReviewsParams): Promise<MyReviewsResponse> {
  const { data } = await API.get<ISuccessResponse<MyReviewsResponse>>("/reviews/me", {
    params: params
      ? {
          page: params.page,
          per_page: params.perPage,
          status: params.status || undefined,
        }
      : undefined,
  })
  return data.data
}

export async function createBusinessReview(businessId: string, payload: CreateReviewPayload): Promise<ReviewItem> {
  const { data } = await API.post<ISuccessResponse<ReviewItem>>(`/businesses/${businessId.trim()}/reviews`, toSnakeCase(payload))
  return data.data
}

export async function updateReview(reviewId: string, payload: UpdateReviewPayload): Promise<ReviewItem> {
  const { data } = await API.put<ISuccessResponse<ReviewItem>>(`/reviews/${reviewId.trim()}`, toSnakeCase(payload))
  return data.data
}

export async function resubmitReview(reviewId: string, payload: ResubmitReviewPayload): Promise<ReviewItem> {
  const { data } = await API.put<ISuccessResponse<ReviewItem>>(`/reviews/${reviewId.trim()}/resubmit`, toSnakeCase(payload))
  return data.data
}

export async function upsertBusinessReviewReply(
  businessId: string,
  reviewId: string,
  payload: UpsertReviewReplyPayload,
): Promise<ReviewItem> {
  const { data } = await API.put<ISuccessResponse<ReviewItem>>(
    `/businesses/${businessId.trim()}/reviews/${reviewId.trim()}/reply`,
    { body: payload.body },
  )
  return data.data
}

export async function listAdminReviews(params?: ListAdminReviewsParams): Promise<AdminReviewsResponse> {
  const { data } = await API.get<ISuccessResponse<AdminReviewsResponse>>("/admin/reviews", {
    params: mapAdminParams(params),
  })
  return data.data
}

export async function getAdminReview(id: string): Promise<ReviewItem> {
  const { data } = await API.get<ISuccessResponse<ReviewItem>>(`/admin/reviews/${id.trim()}`)
  return data.data
}

export async function approveAdminReview(id: string): Promise<ReviewItem> {
  const { data } = await API.put<ISuccessResponse<ReviewItem>>(`/admin/reviews/${id.trim()}/approve`)
  return data.data
}

export async function rejectAdminReview(id: string, payload: RejectReviewPayload): Promise<ReviewItem> {
  const { data } = await API.put<ISuccessResponse<ReviewItem>>(`/admin/reviews/${id.trim()}/reject`, {
    rejection_flag: payload.rejectionFlag,
    moderation_note: payload.moderationNote,
  })
  return data.data
}

export async function deleteAdminReview(id: string): Promise<void> {
  await API.delete(`/admin/reviews/${id.trim()}`)
}
