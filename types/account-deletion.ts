export interface BlockerBusiness {
  businessId: string
  businessName: string
  resolutions: string[]
}

export interface DeletionBlocker {
  code: string
  message: string
  businesses: BlockerBusiness[]
}

export interface DeletionPreflight {
  allowed: boolean
  blockers: DeletionBlocker[]
}

export interface RequestDeletionPayload {
  reason?: string
}

export interface DeletionRequest {
  id: string
  userId: string
  mode: string
  status: string
  reason?: string | null
  requestedAt: string
  finalizeAt: string
  finalizedAt?: string | null
  cancelledAt?: string | null
}
