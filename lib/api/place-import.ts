import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  ImportGooglePlacesPayload,
  ImportGooglePlacesResult,
  PlaceSearchResult,
  SearchGooglePlacesPayload,
} from "@/types/place-import"

export async function searchGooglePlaces(payload: SearchGooglePlacesPayload): Promise<PlaceSearchResult[]> {
  const { data } = await API.post<ISuccessResponse<PlaceSearchResult[]>>("/admin/place-import/search", payload)
  return data.data
}

export async function importGooglePlaces(payload: ImportGooglePlacesPayload): Promise<ImportGooglePlacesResult> {
  const { data } = await API.post<ISuccessResponse<ImportGooglePlacesResult>>("/admin/place-import/import", payload)
  return data.data
}
