import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  ImportGooglePlacesPayload,
  ImportGooglePlacesResult,
  PlaceSearchResult,
  SearchGooglePlacesPayload,
} from "@/types/place-import"

function toSearchRequestBody(payload: SearchGooglePlacesPayload) {
  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
    radius_meters: payload.radiusMeters,
    categories: payload.categories,
    ...(payload.maxResults !== undefined ? { max_results: payload.maxResults } : {}),
  }
}

function toImportRequestBody(payload: ImportGooglePlacesPayload) {
  return {
    items: payload.items.map((item) => ({
      external_id: item.externalId,
      name: item.name,
      ...(item.phone !== undefined ? { phone: item.phone } : {}),
      ...(item.website !== undefined ? { website: item.website } : {}),
      ...(item.googleMapsUrl !== undefined ? { google_maps_url: item.googleMapsUrl } : {}),
      ...(item.formattedAddress !== undefined ? { formatted_address: item.formattedAddress } : {}),
      ...(item.latitude !== undefined ? { latitude: item.latitude } : {}),
      ...(item.longitude !== undefined ? { longitude: item.longitude } : {}),
      ...(item.establishmentTypeId !== undefined ? { establishment_type_id: item.establishmentTypeId } : {}),
      province_id: item.provinceId,
      district_id: item.districtId,
      municipality_id: item.municipalityId,
      ...(item.wardNo !== undefined ? { ward_no: item.wardNo } : {}),
      ...(item.area !== undefined ? { area: item.area } : {}),
      ...(item.addressNote !== undefined ? { address_note: item.addressNote } : {}),
    })),
  }
}

export async function searchGooglePlaces(payload: SearchGooglePlacesPayload): Promise<PlaceSearchResult[]> {
  const { data } = await API.post<ISuccessResponse<PlaceSearchResult[]>>("/admin/place-import/search", toSearchRequestBody(payload))
  return data.data
}

export async function importGooglePlaces(payload: ImportGooglePlacesPayload): Promise<ImportGooglePlacesResult> {
  const { data } = await API.post<ISuccessResponse<ImportGooglePlacesResult>>("/admin/place-import/import", toImportRequestBody(payload))
  return data.data
}
