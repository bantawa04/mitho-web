import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"
import type {
  ImportPlaceImportCandidatePayload,
  ListPlaceImportCandidatesParams,
  MatchPlaceImportCandidatePayload,
  PlaceImportBatch,
  PlaceImportCandidate,
  RejectPlaceImportCandidatePayload,
  SearchPlaceImportPayload,
  UpdatePlaceImportCandidatePayload,
} from "@/types/place-import"

function mapSearchPayload(payload: SearchPlaceImportPayload) {
  return {
    query: payload.query,
    latitude: payload.latitude,
    longitude: payload.longitude,
    radius_meters: payload.radiusMeters,
    max_results: payload.maxResults,
  }
}

function mapCandidatePayload(payload: UpdatePlaceImportCandidatePayload) {
  return {
    name: payload.name,
    phone: payload.phone,
    website: payload.website,
    formatted_address: payload.formattedAddress,
    address_line_1: payload.addressLine1,
    address_line_2: payload.addressLine2,
    province_id: payload.provinceId,
    district_id: payload.districtId,
    municipality_id: payload.municipalityId,
    ward_no: payload.wardNo,
    latitude: payload.latitude,
    longitude: payload.longitude,
    establishment_type_id: payload.establishmentTypeId,
    admin_notes: payload.adminNotes,
  }
}

export async function searchPlaceImportBatch(payload: SearchPlaceImportPayload): Promise<PlaceImportBatch> {
  const { data } = await API.post<ISuccessResponse<PlaceImportBatch>>("/admin/place-import/batches/search", mapSearchPayload(payload))
  return data.data
}

export async function listPlaceImportBatches(): Promise<PlaceImportBatch[]> {
  const { data } = await API.get<ISuccessResponse<PlaceImportBatch[]>>("/admin/place-import/batches")
  return data.data
}

export async function getPlaceImportBatch(id: string): Promise<PlaceImportBatch> {
  const { data } = await API.get<ISuccessResponse<PlaceImportBatch>>(`/admin/place-import/batches/${id.trim()}`)
  return data.data
}

export async function listPlaceImportCandidates(params: ListPlaceImportCandidatesParams): Promise<PlaceImportCandidate[]> {
  const requestParams = {
    batch_id: params.batchId,
    status: params.status,
    duplicate_status: params.duplicateStatus,
    search: params.search,
  }
  const { data } = await API.get<ISuccessResponse<PlaceImportCandidate[]>>("/admin/place-import/candidates", {
    params: requestParams,
  })
  return data.data
}

export async function getPlaceImportCandidate(id: string): Promise<PlaceImportCandidate> {
  const { data } = await API.get<ISuccessResponse<PlaceImportCandidate>>(`/admin/place-import/candidates/${id.trim()}`)
  return data.data
}

export async function updatePlaceImportCandidate(id: string, payload: UpdatePlaceImportCandidatePayload): Promise<PlaceImportCandidate> {
  const { data } = await API.put<ISuccessResponse<PlaceImportCandidate>>(`/admin/place-import/candidates/${id.trim()}`, mapCandidatePayload(payload))
  return data.data
}

export async function matchPlaceImportCandidate(id: string, payload: MatchPlaceImportCandidatePayload): Promise<PlaceImportCandidate> {
  const { data } = await API.post<ISuccessResponse<PlaceImportCandidate>>(`/admin/place-import/candidates/${id.trim()}/match-business`, {
    business_id: payload.businessId,
    note: payload.note,
  })
  return data.data
}

export async function importPlaceImportCandidate(id: string, payload?: ImportPlaceImportCandidatePayload): Promise<PlaceImportCandidate> {
  const { data } = await API.post<ISuccessResponse<PlaceImportCandidate>>(`/admin/place-import/candidates/${id.trim()}/import`, {
    force_duplicate_override: payload?.forceDuplicateOverride ?? false,
  })
  return data.data
}

export async function rejectPlaceImportCandidate(id: string, payload?: RejectPlaceImportCandidatePayload): Promise<PlaceImportCandidate> {
  const { data } = await API.post<ISuccessResponse<PlaceImportCandidate>>(`/admin/place-import/candidates/${id.trim()}/reject`, {
    note: payload?.note,
  })
  return data.data
}
