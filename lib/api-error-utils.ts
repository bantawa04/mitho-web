import axios from "axios"

type ApiValidationErrors = Record<string, string[] | string>

interface ApiErrorPayload {
  message?: string
  error?: string
  errors?: ApiValidationErrors
}

export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined

    if (payload?.errors) {
      const firstField = Object.values(payload.errors)[0]
      if (Array.isArray(firstField) && firstField[0]) return firstField[0]
      if (typeof firstField === "string") return firstField
    }

    if (payload?.message) return payload.message
    if (payload?.error) return payload.error
  }

  return error instanceof Error ? error.message : fallback
}
