import API from "@/config/api"
import type { EstablishmentType } from "@/types/establishment-types"
import type { ISuccessResponse } from "@/types/response"

export async function listEstablishmentTypes(): Promise<EstablishmentType[]> {
  const { data } = await API.get<ISuccessResponse<EstablishmentType[]>>("/establishment-types")
  return data.data
}
