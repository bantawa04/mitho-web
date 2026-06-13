export interface BusinessInvitation {
  id: string
  businessId: string
  businessName?: string
  email: string
  role: string
  status: string
  invitedByName?: string
  expiresAt: string
  createdAt: string
}

export interface MyInvitation {
  id: string
  businessId: string
  businessName: string
  role: string
  expiresAt: string
  createdAt: string
}

export interface CreateInvitePayload {
  email: string
}
