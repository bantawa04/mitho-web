import API from "@/config/api"
import type { District, Municipality, Province } from "@/types/nepal-admin"
import type { ISuccessResponse } from "@/types/response"

export async function listProvinces(): Promise<Province[]> {
  const { data } = await API.get<ISuccessResponse<Province[]>>("/provinces")
  return data.data
}

export async function listDistrictsByProvince(provinceId: number): Promise<District[]> {
  const { data } = await API.get<ISuccessResponse<District[]>>(`/provinces/${provinceId}/districts`)
  return data.data
}

export async function listMunicipalitiesByDistrict(districtId: number): Promise<Municipality[]> {
  const { data } = await API.get<ISuccessResponse<Municipality[]>>(`/districts/${districtId}/municipalities`)
  return data.data
}
