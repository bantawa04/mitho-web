import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  Business,
  BusinessHour,
  BusinessSearchResponse,
  CreateBusinessPayload,
  ListBusinessesParams,
  MyBusinessEntry,
  PublicBusiness,
  ReplaceHoursPayload,
  SearchBusinessesParams,
  UpdateBusinessPayload,
} from "@/types/business"

export async function listMyBusinesses(): Promise<MyBusinessEntry[]> {
  const { data } =
    await API.get<ISuccessResponse<MyBusinessEntry[]>>("/businesses/mine")
  return data.data
}

export async function listBusinesses(
  params?: ListBusinessesParams,
): Promise<Business[]> {
  const { data } = await API.get<ISuccessResponse<Business[]>>(
    "/admin/businesses",
    { params },
  )
  return data.data
}

export async function getBusiness(id: string): Promise<Business> {
  const { data } = await API.get<ISuccessResponse<Business>>(
    `/admin/businesses/${id.trim()}`,
  )
  return data.data
}

export async function getBusinessDetail(id: string): Promise<Business> {
  const { data } = await API.get<ISuccessResponse<Business>>(
    `/businesses/${id.trim()}`,
  )
  return data.data
}

function toSearchQueryParams(
  params: SearchBusinessesParams,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  const q = params.q?.trim()
  if (q) out.q = q
  if (params.establishmentTypeId)
    out.establishment_type_id = params.establishmentTypeId
  if (params.cuisineId) out.cuisine_id = params.cuisineId
  if (params.provinceId !== undefined) out.province_id = params.provinceId
  if (params.districtId !== undefined) out.district_id = params.districtId
  if (params.municipalityId !== undefined)
    out.municipality_id = params.municipalityId
  if (params.openNow) out.open_now = true
  if (params.latitude !== undefined) out.latitude = params.latitude
  if (params.longitude !== undefined) out.longitude = params.longitude
  if (params.radiusKm !== undefined) out.radius_km = params.radiusKm
  if (params.sort) out.sort = params.sort
  if (params.page !== undefined) out.page = params.page
  if (params.perPage !== undefined) out.per_page = params.perPage
  return out
}

export async function searchBusinesses(
  params: SearchBusinessesParams = {},
): Promise<BusinessSearchResponse> {
  const { data } = await API.get<ISuccessResponse<BusinessSearchResponse>>(
    "/businesses/search",
    {
      params: toSearchQueryParams(params),
    },
  )
  return data.data
}

export async function getPublicBusinessByPath(params: {
  province: string
  district: string
  city: string
  business: string
}): Promise<PublicBusiness> {
  const { province, district, city, business } = params
  const { data } = await API.get<ISuccessResponse<PublicBusiness>>(
    `/businesses/public/${province}/${district}/${city}/${business}`,
  )
  return data.data
}

export async function createBusiness(
  payload: CreateBusinessPayload,
): Promise<Business> {
  const { data } = await API.post<ISuccessResponse<Business>>(
    "/businesses",
    payload,
  )
  return data.data
}

export async function updateBusiness(
  id: string,
  payload: UpdateBusinessPayload,
): Promise<Business> {
  const { data } = await API.put<ISuccessResponse<Business>>(
    `/businesses/${id.trim()}`,
    payload,
  )
  return data.data
}

export async function deleteBusiness(id: string): Promise<void> {
  await API.delete(`/businesses/${id.trim()}`)
}

export async function getBusinessHours(
  businessId: string,
): Promise<BusinessHour[]> {
  const { data } = await API.get<ISuccessResponse<BusinessHour[]>>(
    `/businesses/${businessId.trim()}/hours`,
  )
  return data.data
}

export async function replaceBusinessHours(
  businessId: string,
  payload: ReplaceHoursPayload,
): Promise<void> {
  await API.put(`/businesses/${businessId.trim()}/hours`, payload)
}
