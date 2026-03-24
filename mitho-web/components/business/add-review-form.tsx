"use client"

import * as React from "react"
import { ImageIcon, Video } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { StarRating } from "@/components/ui/mitho-rating"
import { MithoButton } from "@/components/ui/mitho-button"

export function AddReviewForm() {
  const [rating, setRating] = React.useState(0)
  const [review, setReview] = React.useState("")

  return (
    <section className="container mx-auto px-4 py-6" id="add-review">
      <MithoCard>
        <MithoCardHeader>
          <h2 className="text-xl font-bold">Write a Review</h2>
          <p className="text-muted-foreground text-sm mt-1">Share your experience with others</p>
        </MithoCardHeader>
        <MithoCardContent>
          <form className="space-y-5">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <StarRating rating={rating} onChange={setRating} interactive size="lg" />
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="review"
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 resize-none"
              />
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Add Photos or Videos</label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-input hover:border-brand-orange hover:bg-brand-orange/5 transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-input hover:border-brand-orange hover:bg-brand-orange/5 transition-colors"
                >
                  <Video className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Video</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <MithoButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
              Submit Review
            </MithoButton>
          </form>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
