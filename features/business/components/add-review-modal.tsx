"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <p className="type-eyebrow text-brand-deep-green/70">{isEarlyListing ? "Help start the page" : "Add your experience"}</p>
          <DialogTitle className="type-card-title mt-1 text-xl text-left">
            {isFirstReview ? "Write the first local review" : "Write a review"}
          </DialogTitle>
          <DialogDescription className="type-meta text-left">
            {prompt ??
              (isEarlyListing
                ? "The most helpful first review usually covers what to order, what the atmosphere feels like, and whether you would come back."
                : "Share the details that actually help the next person decide.")}
          </DialogDescription>
        </DialogHeader>

        <AddReviewForm
          flat
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
