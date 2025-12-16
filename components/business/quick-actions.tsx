"use client"
import { PenLine, Bookmark, Share2 } from "lucide-react"
import { MithoButton } from "@/components/ui/mitho-button"

interface QuickActionsProps {
  onWriteReview?: () => void
  onSave?: () => void
  onShare?: () => void
  isSaved?: boolean
}

export function QuickActions({ onWriteReview, onSave, onShare, isSaved = false }: QuickActionsProps) {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3">
        <MithoButton variant="primary" leftIcon={<PenLine className="h-4 w-4" />} onClick={onWriteReview}>
          Write a Review
        </MithoButton>
        <MithoButton
          variant={isSaved ? "primary" : "outline-primary"}
          leftIcon={<Bookmark className={isSaved ? "fill-white" : ""} />}
          onClick={onSave}
        >
          {isSaved ? "Saved" : "Save"}
        </MithoButton>
        <MithoButton variant="ghost" leftIcon={<Share2 className="h-4 w-4" />} onClick={onShare}>
          Share
        </MithoButton>
      </div>
    </section>
  )
}
