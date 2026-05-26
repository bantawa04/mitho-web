import axios from "axios"
import API from "@/config/api"
import type { AuthUser, LoginWithGooglePayload } from "@/types/auth"
import type { ISuccessResponse } from "@/types/response"

export const loginWithGoogle = async (payload: LoginWithGooglePayload): Promise<AuthUser> => {
  const { data } = await API.post<ISuccessResponse<AuthUser>>("/auth/google", payload)
  return data.data
}

export const fetchCurrentSession = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await API.get<ISuccessResponse<AuthUser>>("/auth/me")
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }

    throw error
  }
}

export const logoutSession = async (): Promise<void> => {
  try {
    await API.post<ISuccessResponse<null>>("/auth/logout")
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return
    }

    throw error
  }
}
