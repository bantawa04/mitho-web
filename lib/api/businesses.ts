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

function toSnakeCase(payload: CreateBusinessPayload | UpdateBusinessPayload) {
  const p = payload as Record<string, unknown>
  const out: Record<string, unknown> = {}
  if (p.name !== undefined) out.name = p.name
  if (p.description !== undefined) out.description = p.description
  if (p.status !== undefined) out.status = p.status
  if (p.listingStatus !== undefined) out.listing_status = p.listingStatus
  if (p.phone !== undefined) out.phone = p.phone
  if (p.phoneSecondary !== undefined) out.phone_secondary = p.phoneSecondary
  if (p.email !== undefined) out.email = p.email
  if (p.provinceId !== undefined) out.province_id = p.provinceId
  if (p.districtId !== undefined) out.district_id = p.districtId
  if (p.municipalityId !== undefined) out.municipality_id = p.municipalityId
  if (p.wardNo !== undefined) out.ward_no = p.wardNo
  if (p.area !== undefined) out.area = p.area
  if (p.nearestLandmark !== undefined) out.nearest_landmark = p.nearestLandmark
  if (p.addressNote !== undefined) out.address_note = p.addressNote
  if (p.latitude !== undefined) out.latitude = p.latitude
  if (p.longitude !== undefined) out.longitude = p.longitude
  if (p.googleMapsUrl !== undefined) out.google_maps_url = p.googleMapsUrl
  if (p.establishmentTypeId !== undefined) out.establishment_type_id = p.establishmentTypeId
  if (p.cuisineIds !== undefined) out.cuisine_ids = p.cuisineIds
  if (p.logoId !== undefined) out.logo_id = p.logoId
  if (p.bannerId !== undefined) out.banner_id = p.bannerId
  if (p.photos !== undefined) out.photos = p.photos
  if (p.signatureItems !== undefined) out.signature_items = p.signatureItems
  if (p.mealTypes !== undefined) out.meal_types = p.mealTypes
  if (p.menuUrl !== undefined) out.menu_url = p.menuUrl
  if (p.specialityNote !== undefined) out.speciality_note = p.specialityNote
  if (p.priceRange !== undefined) out.price_range = p.priceRange
  if (p.avgCostPerPerson !== undefined) out.avg_cost_per_person = p.avgCostPerPerson
  if (p.amenities !== undefined) out.amenities = p.amenities
  if (p.links !== undefined) out.links = p.links
  if (p.isFeatured !== undefined) out.is_featured = p.isFeatured
  if (p.sendClaimInvitation !== undefined) out.send_claim_invitation = p.sendClaimInvitation
  if (p.claimInvitationEmail !== undefined) out.claim_invitation_email = p.claimInvitationEmail ?? null
  return out
}

export async function listMyBusinesses(): Promise<MyBusinessEntry[]> {
  const { data } = await API.get<ISuccessResponse<MyBusinessEntry[]>>("/businesses/mine")
  return data.data
}

export async function listBusinesses(params?: ListBusinessesParams): Promise<Business[]> {
  const { data } = await API.get<ISuccessResponse<Business[]>>("/admin/businesses", { params })
  return data.data
}

export async function getBusiness(id: string): Promise<Business> {
  const { data } = await API.get<ISuccessResponse<Business>>(`/admin/businesses/${id.trim()}`)
  return data.data
}

export async function getBusinessDetail(id: string): Promise<Business> {
  const { data } = await API.get<ISuccessResponse<Business>>(`/businesses/${id.trim()}`)
  return data.data
}

function toSearchQueryParams(params: SearchBusinessesParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  const q = params.q?.trim()
  if (q) out.q = q
  if (params.establishmentTypeId) out.establishment_type_id = params.establishmentTypeId
  if (params.cuisineId) out.cuisine_id = params.cuisineId
  if (params.provinceId !== undefined) out.province_id = params.provinceId
  if (params.districtId !== undefined) out.district_id = params.districtId
  if (params.municipalityId !== undefined) out.municipality_id = params.municipalityId
  if (params.openNow) out.open_now = true
  if (params.sort) out.sort = params.sort
  if (params.page !== undefined) out.page = params.page
  if (params.perPage !== undefined) out.per_page = params.perPage
  return out
}

export async function searchBusinesses(params: SearchBusinessesParams = {}): Promise<BusinessSearchResponse> {
  const { data } = await API.get<ISuccessResponse<BusinessSearchResponse>>("/businesses/search", {
    params: toSearchQueryParams(params),
  })
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

export async function createBusiness(payload: CreateBusinessPayload): Promise<Business> {
  const { data } = await API.post<ISuccessResponse<Business>>("/businesses", toSnakeCase(payload))
  return data.data
}

export async function updateBusiness(id: string, payload: UpdateBusinessPayload): Promise<Business> {
  const { data } = await API.put<ISuccessResponse<Business>>(`/businesses/${id.trim()}`, toSnakeCase(payload))
  return data.data
}

export async function deleteBusiness(id: string): Promise<void> {
  await API.delete(`/businesses/${id.trim()}`)
}

export async function getBusinessHours(businessId: string): Promise<BusinessHour[]> {
  const { data } = await API.get<ISuccessResponse<BusinessHour[]>>(`/businesses/${businessId.trim()}/hours`)
  return data.data
}

export async function replaceBusinessHours(businessId: string, payload: ReplaceHoursPayload): Promise<void> {
  await API.put(`/businesses/${businessId.trim()}/hours`, payload)
}
