"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPlaceImportBatch,
  getPlaceImportCandidate,
  importPlaceImportCandidate,
  listPlaceImportBatches,
  listPlaceImportCandidates,
  matchPlaceImportCandidate,
  rejectPlaceImportCandidate,
  searchPlaceImportBatch,
  updatePlaceImportCandidate,
} from "@/lib/api/place-import"
import { queryKeys } from "@/lib/api/query-keys"
import type {
  ImportPlaceImportCandidatePayload,
  ListPlaceImportCandidatesParams,
  MatchPlaceImportCandidatePayload,
  RejectPlaceImportCandidatePayload,
  SearchPlaceImportPayload,
  UpdatePlaceImportCandidatePayload,
} from "@/types/place-import"

export function usePlaceImportBatches() {
  return useQuery({
    queryKey: queryKeys.admin.placeImport.batches.list(),
    queryFn: listPlaceImportBatches,
  })
}

export function usePlaceImportBatch(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.placeImport.batches.detail(id),
    queryFn: () => getPlaceImportBatch(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useSearchPlaceImportBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SearchPlaceImportPayload) => searchPlaceImportBatch(payload),
    onSuccess: (batch) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.batches.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.candidates.all })
      queryClient.setQueryData(queryKeys.admin.placeImport.batches.detail(batch.id), batch)
    },
  })
}

export function usePlaceImportCandidates(params: ListPlaceImportCandidatesParams) {
  return useQuery({
    queryKey: queryKeys.admin.placeImport.candidates.list(params),
    queryFn: () => listPlaceImportCandidates(params),
  })
}

export function usePlaceImportCandidate(id: string | null) {
  return useQuery({
    queryKey: queryKeys.admin.placeImport.candidates.detail(id),
    queryFn: () => getPlaceImportCandidate(id ?? ""),
    enabled: Boolean(id),
  })
}

export function useUpdatePlaceImportCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlaceImportCandidatePayload }) =>
      updatePlaceImportCandidate(id, payload),
    onSuccess: (candidate) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.candidates.all })
      queryClient.setQueryData(queryKeys.admin.placeImport.candidates.detail(candidate.id), candidate)
    },
  })
}

export function useMatchPlaceImportCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MatchPlaceImportCandidatePayload }) =>
      matchPlaceImportCandidate(id, payload),
    onSuccess: (candidate) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.candidates.all })
      queryClient.setQueryData(queryKeys.admin.placeImport.candidates.detail(candidate.id), candidate)
    },
  })
}

export function useImportPlaceImportCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ImportPlaceImportCandidatePayload }) =>
      importPlaceImportCandidate(id, payload),
    onSuccess: (candidate) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.candidates.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
      queryClient.setQueryData(queryKeys.admin.placeImport.candidates.detail(candidate.id), candidate)
    },
  })
}

export function useRejectPlaceImportCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RejectPlaceImportCandidatePayload }) =>
      rejectPlaceImportCandidate(id, payload),
    onSuccess: (candidate) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.placeImport.candidates.all })
      queryClient.setQueryData(queryKeys.admin.placeImport.candidates.detail(candidate.id), candidate)
    },
  })
}
