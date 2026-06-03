"use client"

import { useQuery } from "@tanstack/react-query"
import { listEstablishmentTypes } from "@/lib/api/establishment-types"
import { queryKeys } from "@/lib/api/query-keys"

export function useEstablishmentTypes() {
  return useQuery({
    queryKey: queryKeys.establishmentTypes.list(),
    queryFn: listEstablishmentTypes,
  })
}
