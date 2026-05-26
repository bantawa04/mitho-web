import axios from "axios"
import API from "@/config/api"
import type { AuthUser, LoginWithGooglePayload } from "@/types/auth"
import type { ISuccessResponse } from "@/types/response"

export async function loginWithGoogle(payload: LoginWithGooglePayload): Promise<AuthUser> {
  const { data } = await API.post<ISuccessResponse<AuthUser>>("/auth/google", payload)
  return data.data
}

export async function fetchCurrentSession(): Promise<AuthUser | null> {
  try {
    const { data } = await API.get<ISuccessResponse<AuthUser>>("/auth/me")
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return null
      }

      // Session hydration should fail soft when the API is unreachable
      // so the app can still render as signed out instead of surfacing a
      // root-level bootstrap error.
      if (!error.response) {
        return null
      }
    }

    throw error
  }
}

export async function logoutSession(): Promise<void> {
  try {
    await API.post<ISuccessResponse<null>>("/auth/logout")
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return
    }

    throw error
  }
}
