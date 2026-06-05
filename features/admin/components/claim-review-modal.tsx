"use client"

import { useState, useEffect } from "react"
import { FileIcon } from "lucide-react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  useAdminBusinessClaim,
  useApproveBusinessClaim,
  useRejectBusinessClaim,
} from "@/hooks/use-business-claims"
import { getClaimDocumentDownloadUrl } from "@/lib/api/business-claims"
import type { BusinessClaim } from "@/types/business-claims"

function businessLocation(claim: BusinessClaim) {
  const business = claim.business
  if (!business) return "Location not provided"
  return [business.area, business.municipality?.name, business.district?.name, business.province?.name].filter(Boolean).join(", ")
}

function formatDate(value?: string) {
  if (!value) return "Not reviewed"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function ReviewBlock({ label, value, helper }: { label: string; value?: string; helper?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">{label}</p>
      <p className="mt-1.5 text-sm font-medium capitalize text-brand-dark-green">{value || "Not provided"}</p>
      {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  )
}

export function ClaimReviewModal({
  claimId,
  onOpenChange,
}: {
  claimId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const { data: claim, isLoading: isLoadingClaim } = useAdminBusinessClaim(claimId)
  
  const approveClaim = useApproveBusinessClaim()
  const rejectClaim = useRejectBusinessClaim()

  const [decision, setDecision] = useState<"approve" | "reject" | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  useEffect(() => {
    if (claimId) {
      setDecision(null)
      setReviewNote("")
    }
  }, [claimId])

  async function openDocument(cid: string, mediaId: string) {
    try {
      const access = await getClaimDocumentDownloadUrl(cid, mediaId)
      window.open(access.url, "_blank", "noopener,noreferrer")
    } catch {
      toast({ title: "Could not open document", description: "Please try again.", variant: "destructive" })
    }
  }

  async function handleSave() {
    if (!claimId) return
    if (!decision) {
      toast({ title: "Decision required", description: "Please select whether to approve or reject the claim.", variant: "destructive" })
      return
    }

    if (decision === "reject" && !reviewNote.trim()) {
      toast({ title: "Rejection reason required", description: "Please provide a reason for rejecting the claim.", variant: "destructive" })
      return
    }

    try {
      if (decision === "approve") {
        await approveClaim.mutateAsync({
          id: claimId,
          payload: { reviewNote: reviewNote.trim() || undefined },
        })
        toast({ title: "Claim approved", description: "The claimant now has owner access." })
      } else {
        await rejectClaim.mutateAsync({
          id: claimId,
          payload: { reviewNote: reviewNote.trim() || undefined },
        })
        toast({ title: "Claim rejected", description: "The claim has been rejected." })
      }
      onOpenChange(false)
    } catch {
      toast({ title: "Error", description: "Something went wrong saving your decision.", variant: "destructive" })
    }
  }

  const isSaving = approveClaim.isPending || rejectClaim.isPending

  return (
    <AdminModal
      open={claimId !== null}
      onOpenChange={onOpenChange}
      title="Review business request"
      description="Review the provided documents and verify the claimant's identity before making a decision."
      size="2xl"
      confirmLabel="Save"
      onConfirm={handleSave}
      isLoading={isSaving}
      isConfirmDisabled={claim?.status !== "pending" || !decision || (decision === "reject" && !reviewNote.trim())}
    >
      {isLoadingClaim ? (
        <p className="text-sm text-muted-foreground py-4">Loading request details...</p>
      ) : claim ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 pb-8 border-b border-brand-deep-green/10">
            <ReviewBlock label="Business" value={claim.business?.name ?? claim.businessId} helper={businessLocation(claim)} />
            <ReviewBlock label="Submitted by" value={claim.claimantName || claim.user?.name || "Unknown"} helper={claim.user?.email} />
            <ReviewBlock label="Role" value={claim.role.replaceAll("-", " ")} />
            <ReviewBlock label="PAN/VAT" value={claim.panVatNumber} />
            <ReviewBlock label="Business phone" value={claim.businessPhone} />
            <ReviewBlock label="Business email" value={claim.businessEmail} />
          </div>

          {claim.note ? (
            <div className="pb-8 border-b border-brand-deep-green/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Claimant note</p>
              <p className="mt-2 text-sm leading-6 text-brand-dark-green">{claim.note}</p>
            </div>
          ) : null}

          <div className={claim.status === "pending" ? "pb-8 border-b border-brand-deep-green/10" : ""}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55 mb-4">Verification Documents</p>
            <div className="flex flex-wrap gap-4">
              {claim.status !== "pending" && claim.documentsDeletedAt ? (
                <p className="text-sm text-muted-foreground">
                  Documents deleted after review on {formatDate(claim.documentsDeletedAt)}.
                </p>
              ) : claim.status === "pending" && (claim.documents ?? []).length > 0 ? (
                claim.documents?.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => openDocument(claim.id, document.id)}
                    className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-deep-green/14 bg-brand-soft-beige/20 p-4 transition-colors hover:bg-brand-soft-beige/50 hover:border-brand-deep-green/30 w-32 h-32 text-center"
                  >
                    <FileIcon className="h-8 w-8 text-brand-deep-green/40 group-hover:text-brand-deep-green/70 transition-colors" />
                    <span className="text-xs font-medium text-brand-dark-green line-clamp-2" title={document.filename}>
                      {document.filename}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No private documents attached.</p>
              )}
            </div>
          </div>

          {claim.status === "pending" && (
            <div className="space-y-6 pt-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55 mb-4">Decision</p>
                <RadioGroup 
                  value={decision ?? ""} 
                  onValueChange={(val) => setDecision(val as "approve" | "reject")}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="text-sm font-medium cursor-pointer">Approve</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="text-sm font-medium cursor-pointer">Decline</Label>
                  </div>
                </RadioGroup>
              </div>

              {decision === "reject" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="reject-reason" className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">
                    Reason for decline
                  </Label>
                  <Textarea
                    id="reject-reason"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Explain why this request is being declined..."
                    className="min-h-24 rounded-xl border-brand-deep-green/14 bg-white shadow-none focus-visible:ring-brand-deep-green/20"
                  />
                </div>
              )}
              {decision === "approve" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="approve-note" className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">
                    Internal Note (Optional)
                  </Label>
                  <Textarea
                    id="approve-note"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add an optional internal note about this approval..."
                    className="min-h-20 rounded-xl border-brand-deep-green/14 bg-white shadow-none focus-visible:ring-brand-deep-green/20"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4">Request not found.</p>
      )}
    </AdminModal>
  )
}
