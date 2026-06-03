"use client"

import { useQuery } from "@tanstack/react-query"
import { listDistrictsByProvince, listMunicipalitiesByDistrict, listProvinces } from "@/lib/api/nepal-admin"
import { queryKeys } from "@/lib/api/query-keys"

export function useProvinces() {
  return useQuery({
    queryKey: queryKeys.nepalAdmin.provinces.list(),
    queryFn: listProvinces,
  })
}

export function useDistricts(provinceId: number | null) {
  return useQuery({
    queryKey: queryKeys.nepalAdmin.districts.list(provinceId),
    queryFn: () => listDistrictsByProvince(provinceId!),
    enabled: provinceId !== null,
  })
}

export function useMunicipalities(districtId: number | null) {
  return useQuery({
    queryKey: queryKeys.nepalAdmin.municipalities.list(districtId),
    queryFn: () => listMunicipalitiesByDistrict(districtId!),
    enabled: districtId !== null,
  })
}
