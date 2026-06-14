"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveAdminReview,
  createBusinessReview,
  deleteAdminReview,
  getAdminReview,
  getMyBusinessReview,
  listAdminReviews,
  listBusinessReviews,
  listBusinessTips,
  listMyReviews,
  rejectAdminReview,
  resubmitReview,
  upsertBusinessReviewReply,
  updateReview,
} from "@/lib/api/reviews"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  CreateReviewPayload,
  ListAdminReviewsParams,
  ListBusinessReviewsParams,
  ListBusinessTipsParams,
  ListMyReviewsParams,
  RejectReviewPayload,
  ResubmitReviewPayload,
  UpsertReviewReplyPayload,
  UpdateReviewPayload,
} from "@/types/reviews"

export function useBusinessReviews(businessId: string | undefined, params?: ListBusinessReviewsParams, enabled = true) {
  const cleanBusinessId = businessId?.trim()
  return useQuery({
    queryKey: queryKeys.reviews.list(cleanBusinessId ?? "", params),
    queryFn: () => listBusinessReviews(cleanBusinessId!, params),
    enabled: Boolean(cleanBusinessId) && enabled,
  })
}

export function useBusinessTips(businessId: string | undefined, params?: ListBusinessTipsParams, enabled = true) {
  const cleanBusinessId = businessId?.trim()
  return useQuery({
    queryKey: queryKeys.reviews.tips(cleanBusinessId ?? "", params),
    queryFn: () => listBusinessTips(cleanBusinessId!, params),
    enabled: Boolean(cleanBusinessId) && enabled,
  })
}

export function useMyBusinessReview(businessId: string | undefined, enabled = true) {
  const cleanBusinessId = businessId?.trim()
  return useQuery({
    queryKey: queryKeys.reviews.mine(cleanBusinessId ?? ""),
    queryFn: () => getMyBusinessReview(cleanBusinessId!),
    enabled: Boolean(cleanBusinessId) && enabled,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  })
}

export function useCreateBusinessReview(businessId: string) {
  const queryClient = useQueryClient()
  const cleanBusinessId = businessId.trim()
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createBusinessReview(cleanBusinessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(cleanBusinessId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    },
  })
}

export function useMyReviews(params?: ListMyReviewsParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.reviews.myList(params),
    queryFn: () => listMyReviews(params),
    enabled,
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) => updateReview(id, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(review.businessId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    },
  })
}

export function useResubmitReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResubmitReviewPayload }) => resubmitReview(id, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(review.businessId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    },
  })
}

export function useUpsertBusinessReviewReply(businessId: string) {
  const queryClient = useQueryClient()
  const cleanBusinessId = businessId.trim()
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: UpsertReviewReplyPayload }) =>
      upsertBusinessReviewReply(cleanBusinessId, reviewId, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(cleanBusinessId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(cleanBusinessId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.myList() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.all })
      queryClient.setQueryData(queryKeys.reviews.mine(review.businessId), { review, canReview: true })
    },
  })
}

export function useAdminReviews(params: ListAdminReviewsParams) {
  return useQuery({
    queryKey: queryKeys.admin.reviews.list(params),
    queryFn: () => listAdminReviews(params),
  })
}

export function useAdminReview(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.reviews.detail(id),
    queryFn: () => getAdminReview(id!),
    enabled: Boolean(id),
  })
}

export function useApproveAdminReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveAdminReview(id),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(review.businessId) })
    },
  })
}

export function useRejectAdminReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectReviewPayload }) => rejectAdminReview(id, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.mine(review.businessId) })
    },
  })
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAdminReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reviews.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all })
    },
  })
}
