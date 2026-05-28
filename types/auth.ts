export interface AuthUserProfile {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
  status: string
  fullName?: string
  socialProvider?: string | null
}

export interface SessionBusinessMembership {
  id: string
  businessId: string
  role: string
  status: string
}

export interface AuthUser {
  user: AuthUserProfile
  staffRoles: string[]
  staffPermissions: string[]
  businessMemberships: SessionBusinessMembership[]
}

export interface LoginWithGooglePayload {
  idToken: string
}
