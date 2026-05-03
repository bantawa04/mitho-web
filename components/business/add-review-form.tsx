"use client"

import * as React from "react"
import { ImageIcon, Video } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

interface AddReviewFormProps {
  isEarlyListing?: boolean
  isFirstReview?: boolean
  prompt?: string
}

export function AddReviewForm({ isEarlyListing = false, isFirstReview = false, prompt }: AddReviewFormProps) {
  const [rating, setRating] = React.useState(0)
  const [review, setReview] = React.useState("")

  return (
    <section className="container mx-auto px-4 pb-14 pt-6" id="add-review">
      <MithoCard surface="spotlight" interactive="none">
        <MithoCardHeader>
          <p className="type-eyebrow text-brand-deep-green/70">{isEarlyListing ? "Help start the page" : "Add your experience"}</p>
          <h2 className="type-card-title mt-2 text-xl">
            {isFirstReview ? "Write the first local review" : "Write a review"}
          </h2>
          <p className="type-meta mt-1">
            {prompt ??
              (isEarlyListing
                ? "The most helpful first review usually covers what to order, what the atmosphere feels like, and whether you would come back."
                : "Share the details that actually help the next person decide.")}
          </p>
        </MithoCardHeader>
        <MithoCardContent>
          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Your rating</label>
              <StarRating rating={rating} onChange={setRating} interactive size="lg" />
            </div>

            <div>
              <label htmlFor="review" className="mb-2 block text-sm font-medium">
                Your review
              </label>
              <textarea
                id="review"
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell people what stood out: dishes worth ordering, service, portions, wait time, and whether you'd come back."
                className="w-full resize-none rounded-[1.25rem] border border-brand-deep-green/12 bg-white/90 px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/12"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Add photos or videos</label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-[1rem] border border-dashed border-brand-deep-green/20 bg-white/75 px-4 py-3 transition-colors hover:border-brand-orange hover:bg-brand-orange/5"
                >
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-[1rem] border border-dashed border-brand-deep-green/20 bg-white/75 px-4 py-3 transition-colors hover:border-brand-orange hover:bg-brand-orange/5"
                >
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Video</span>
                </button>
              </div>
            </div>

            <MithoButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
              Submit Review
            </MithoButton>
          </form>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
