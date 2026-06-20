import API from "@/config/api"
import type { ISuccessResponse } from "@/types/response"

export interface AdminSettingsAddress {
  addressLine: string
  area: string
  city: string
  state: string
  country: string
}

export interface AdminSettingsNotifications {
  newBusinessSignup: boolean
  claimRequest: boolean
  newReview: boolean
}

export interface AdminSettings {
  name: string
  email: string
  address: AdminSettingsAddress
  mobileNumber: string
  notifications: AdminSettingsNotifications
}

export interface UpdateAdminSettingsPayload {
  name: string
  address: AdminSettingsAddress
  mobileNumber: string
  notifications: AdminSettingsNotifications
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const { data } = await API.get<ISuccessResponse<AdminSettings>>("/admin/settings")
  return data.data
}

export async function updateAdminSettings(payload: UpdateAdminSettingsPayload): Promise<AdminSettings> {
  const { data } = await API.put<ISuccessResponse<AdminSettings>>("/admin/settings", payload)
  return data.data
}
