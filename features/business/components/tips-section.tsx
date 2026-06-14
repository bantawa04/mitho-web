"use client"

import { MithoPagination } from "@/components/mitho/mitho-pagination"
import { MithoCard, MithoCardContent } from "@/components/mitho/mitho-card"
import { StarRating } from "@/components/mitho/mitho-rating"
import type { BusinessTip } from "@/types/reviews"

interface TipsSectionProps {
  tips: BusinessTip[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function TipsSection({
  tips,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  emptyMessage,
}: TipsSectionProps) {
  const hasTips = tips.length > 0

  return (
    <section className="container mx-auto px-4 py-6">
      {isLoading ? (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-xl border border-border bg-white/70" />
          ))}
        </div>
      ) : hasTips ? (
        <>
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold text-brand-dark-green">Tips from locals</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Quick pointers from people who&apos;ve been there, like what to order or when to go.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white px-5">
            {tips.map((tip) => (
              <div key={tip.id} className="border-b border-border py-5 last:border-0">
                <TipCard tip={tip} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
          )}
        </>
      ) : (
        <div className="pb-2 pt-1">
          <MithoCard surface="customer" interactive="none">
            <MithoCardContent className="p-6">
              <p className="text-lg font-semibold text-brand-dark-green">No tips shared yet</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {emptyMessage ?? "No one has shared a quick tip for this place yet. Your tip could help the next visitor."}
              </p>
            </MithoCardContent>
          </MithoCard>
        </div>
      )}
    </section>
  )
}

function TipCard({ tip }: { tip: BusinessTip }) {
  const authorName = tip.authorName ?? "A local"
  const formattedDate = formatTipDate(tip.createdAt)

  return (
    <div className="flex items-start gap-3">
      <img
        src={tip.authorAvatar || "/placeholder.svg"}
        alt={authorName}
        className="h-10 w-10 shrink-0 rounded-full border-2 border-brand-soft-beige object-cover"
      />
      <div className="flex-1">
        <p className="leading-relaxed text-foreground">{tip.tips}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-brand-dark-green">{authorName}</span>
          {typeof tip.rating === "number" && (
            <>
              <span aria-hidden="true">·</span>
              <StarRating rating={tip.rating} size="sm" />
            </>
          )}
          {formattedDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formattedDate}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTipDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
