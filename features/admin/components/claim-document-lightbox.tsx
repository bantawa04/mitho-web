"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { getClaimDocumentDownloadUrl } from "@/lib/api/business-claims"
import type { Media } from "@/types/media"

interface ClaimDocumentLightboxProps {
  claimId: string
  documents: Media[]
  openIndex: number | null
  onOpenChange: (open: boolean) => void
  onIndexChange: (index: number) => void
}

export function ClaimDocumentLightbox({
  claimId,
  documents,
  openIndex,
  onOpenChange,
  onIndexChange,
}: ClaimDocumentLightboxProps) {
  const [urls, setUrls] = React.useState<Record<string, string>>({})
  const [failedIds, setFailedIds] = React.useState<Set<string>>(new Set())

  const isOpen = openIndex !== null
  const activeDoc = openIndex !== null ? documents[openIndex] ?? null : null
  const activeUrl = activeDoc ? urls[activeDoc.id] : undefined
  const hasFailed = activeDoc ? failedIds.has(activeDoc.id) : false
  const hasMultiple = documents.length > 1

  // Lazily resolve a short-lived signed URL for whichever document is in view.
  React.useEffect(() => {
    if (!activeDoc || urls[activeDoc.id] || failedIds.has(activeDoc.id)) return
    let cancelled = false
    getClaimDocumentDownloadUrl(claimId, activeDoc.id)
      .then((access) => {
        if (!cancelled) setUrls((prev) => ({ ...prev, [activeDoc.id]: access.url }))
      })
      .catch(() => {
        if (!cancelled) setFailedIds((prev) => new Set(prev).add(activeDoc.id))
      })
    return () => {
      cancelled = true
    }
  }, [activeDoc, claimId, urls, failedIds])

  const goTo = React.useCallback(
    (next: number) => {
      if (documents.length === 0) return
      onIndexChange((next + documents.length) % documents.length)
    },
    [documents.length, onIndexChange],
  )

  React.useEffect(() => {
    if (!isOpen || !hasMultiple || openIndex === null) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(openIndex + 1)
      if (event.key === "ArrowLeft") goTo(openIndex - 1)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, hasMultiple, openIndex, goTo])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-w-[min(94vw,1024px)] flex-col border-0 bg-transparent p-0 shadow-none sm:max-w-[min(94vw,1024px)]"
      >
        <DialogTitle className="sr-only">{activeDoc?.filename ?? "Document preview"}</DialogTitle>

        <div className="relative flex h-[80vh] w-full items-center justify-center">
          {activeDoc && activeUrl ? (
            // Private signed URL with no fixed host; next/image isn't a fit here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeUrl}
              alt={activeDoc.filename}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          ) : hasFailed ? (
            <p className="rounded-lg bg-black/70 px-4 py-3 text-sm text-white">
              Could not load this document. Close and try again.
            </p>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          )}

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-2 top-2 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/75"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={() => openIndex !== null && goTo(openIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/75"
                aria-label="Previous document"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => openIndex !== null && goTo(openIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition-colors hover:bg-black/75"
                aria-label="Next document"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}
        </div>

        {activeDoc ? (
          <div className="mt-3 flex items-center justify-center gap-3 text-sm text-white">
            <span className="max-w-[60vw] truncate" title={activeDoc.filename}>
              {activeDoc.filename}
              {hasMultiple ? ` · ${(openIndex ?? 0) + 1} of ${documents.length}` : ""}
            </span>
            {activeUrl ? (
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 transition-colors hover:bg-black/75"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open original
              </a>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
