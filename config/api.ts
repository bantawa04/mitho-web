import axios, { AxiosError } from "axios"

function buildApiBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!rawBaseUrl) return "/api"

  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")
  return normalizedBaseUrl.endsWith("/api") ? normalizedBaseUrl : `${normalizedBaseUrl}/api`
}

const API = axios.create({
  baseURL: buildApiBaseUrl(),
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
})

API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.set?.("Content-Type", undefined)
  }

  return config
})

API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
)

export default API
