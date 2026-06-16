"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { importGooglePlaces, searchGooglePlaces } from "@/lib/api/place-import"
import { queryKeys } from "@/lib/api/query-keys"
import type { ImportGooglePlacesPayload, SearchGooglePlacesPayload } from "@/types/place-import"

export function useSearchGooglePlaces() {
  return useMutation({
    mutationFn: (payload: SearchGooglePlacesPayload) => searchGooglePlaces(payload),
  })
}

export function useImportGooglePlaces() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ImportGooglePlacesPayload) => importGooglePlaces(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
    },
  })
}
