export interface BusinessMembership {
  id: string
  businessId: string
  userId: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface UpdateMembershipPayload {
  role?: "owner" | "staff"
  status?: "active" | "suspended"
}
