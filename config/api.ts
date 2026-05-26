import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "")

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
)

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 404) {
      if (typeof window === "undefined") {
        const navigation = await import("next/navigation")
        navigation.notFound()
      }

      if (typeof window !== "undefined") {
        window.location.assign("/404")
        return new Promise(() => {
          // Keep pending to avoid downstream UI flashes after navigation.
        })
      }
    }

    return Promise.reject(error)
  },
)

export default API
