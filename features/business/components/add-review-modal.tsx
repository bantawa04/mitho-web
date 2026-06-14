"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddReviewForm } from "@/features/business/components/add-review-form"

interface AddReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId: string
  businessName: string
  isEarlyListing?: boolean
  isFirstReview?: boolean
  prompt?: string
  onRequireAuth: () => void
}

export function AddReviewModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  isEarlyListing,
  isFirstReview,
  prompt,
  onRequireAuth,
}: AddReviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>{isFirstReview ? "Write the first local review" : "Write a review"}</DialogTitle>
        </DialogHeader>
        <AddReviewForm
          businessId={businessId}
          businessName={businessName}
          isEarlyListing={isEarlyListing}
          isFirstReview={isFirstReview}
          prompt={prompt}
          onRequireAuth={() => {
            onOpenChange(false)
            onRequireAuth()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
