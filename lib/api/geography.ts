import API from "@/config/api"
import type { GeographyResolution } from "@/types/nepal-admin"
import type { ISuccessResponse } from "@/types/response"

export async function resolveProvince(provinceSlug: string): Promise<GeographyResolution> {
  const { data } = await API.get<ISuccessResponse<GeographyResolution>>(
    `/geography/${provinceSlug}`,
  )
  return data.data
}

export async function resolveDistrict(provinceSlug: string, districtSlug: string): Promise<GeographyResolution> {
  const { data } = await API.get<ISuccessResponse<GeographyResolution>>(
    `/geography/${provinceSlug}/${districtSlug}`,
  )
  return data.data
}

export async function resolveMunicipality(
  provinceSlug: string,
  districtSlug: string,
  municipalitySlug: string,
): Promise<GeographyResolution> {
  const { data } = await API.get<ISuccessResponse<GeographyResolution>>(
    `/geography/${provinceSlug}/${districtSlug}/${municipalitySlug}`,
  )
  return data.data
}
