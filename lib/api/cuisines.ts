import API from "@/config/api"
import type { Cuisine } from "@/types/cuisine"
import type { ISuccessResponse } from "@/types/response"

export async function listCuisines(): Promise<Cuisine[]> {
  const { data } = await API.get<ISuccessResponse<Cuisine[]>>("/cuisines")
  return data.data
}
