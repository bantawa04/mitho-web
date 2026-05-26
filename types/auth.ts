export interface AuthUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  type: string
  status: string
  fullName?: string
  socialProvider?: string | null
}

export interface LoginWithGooglePayload {
  idToken: string
}
