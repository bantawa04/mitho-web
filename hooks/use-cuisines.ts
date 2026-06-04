"use client"

import { useQuery } from "@tanstack/react-query"
import { listCuisines } from "@/lib/api/cuisines"
import { queryKeys } from "@/lib/api/query-keys"

export function useCuisines() {
  return useQuery({
    queryKey: queryKeys.cuisines.list(),
    queryFn: listCuisines,
  })
}
