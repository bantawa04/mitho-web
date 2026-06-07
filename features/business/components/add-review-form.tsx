"use client"

import * as React from "react"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, CircleAlert, ImagePlus, Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"
import { StarRating } from "@/components/mitho/mitho-rating"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import { useUploadMedia } from "@/hooks/use-media"
import { useCreateBusinessReview, useMyBusinessReview, useResubmitReview } from "@/hooks/use-reviews"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { addReviewSchema, type AddReviewFormValues } from "@/lib/validators/reviews"
import type { Media } from "@/types/media"

interface AddReviewFormProps {
  businessId: string
  businessName: string
  isEarlyListing?: boolean
  isFirstReview?: boolean
  prompt?: string
  onRequireAuth: () => void
}

interface StoredReviewDraft {
  rating: number
  body: string
  needsMediaReselect?: boolean
}

function draftKey(businessId: string) {
  return `review-draft:${businessId}`
}

export function AddReviewForm({
  businessId,
  businessName,
  isEarlyListing = false,
  isFirstReview = false,
  prompt,
  onRequireAuth,
}: AddReviewFormProps) {
  const { isAuthenticated } = useAuthSnapshot()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [retainedMedia, setRetainedMedia] = React.useState<Media[]>([])
  const [needsMediaReselect, setNeedsMediaReselect] = React.useState(false)
  const [hasInitializedRejectedDraft, setHasInitializedRejectedDraft] = React.useState(false)
  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      rating: 0,
      body: "",
    },
  })

  const reviewQuery = useMyBusinessReview(businessId, isAuthenticated)
  const createReview = useCreateBusinessReview(businessId)
  const resubmitReview = useResubmitReview()
  const uploadMedia = useUploadMedia()
  const watchedRating = form.watch("rating")
  const watchedBody = form.watch("body")
  const review = reviewQuery.data
  const selectedFilePreviews = React.useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  )

  React.useEffect(
    () => () => {
      selectedFilePreviews.forEach((item) => URL.revokeObjectURL(item.url))
    },
    [selectedFilePreviews],
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const raw = window.sessionStorage.getItem(draftKey(businessId))
    if (!raw) return

    try {
      const stored = JSON.parse(raw) as StoredReviewDraft
      form.reset({
        rating: stored.rating || 0,
        body: stored.body || "",
      })
      setNeedsMediaReselect(Boolean(stored.needsMediaReselect))
    } catch {
      window.sessionStorage.removeItem(draftKey(businessId))
    }
  }, [businessId, form])

  React.useEffect(() => {
    if (!review || review.status !== "rejected" || hasInitializedRejectedDraft) return
    form.reset({
      rating: review.rating,
      body: review.body,
    })
    setRetainedMedia(review.media ?? [])
    setHasInitializedRejectedDraft(true)
  }, [form, hasInitializedRejectedDraft, review])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const payload: StoredReviewDraft = {
      rating: watchedRating,
      body: watchedBody,
      needsMediaReselect,
    }
    if (!payload.body.trim() && !payload.rating) {
      window.sessionStorage.removeItem(draftKey(businessId))
      return
    }
    window.sessionStorage.setItem(draftKey(businessId), JSON.stringify(payload))
  }, [businessId, needsMediaReselect, watchedBody, watchedRating])

  const isLocked = review?.status === "pending" || review?.status === "approved"
  const isBusy = createReview.isPending || resubmitReview.isPending || uploadMedia.isPending

  async function onSubmit(values: AddReviewFormValues) {
    if (isLocked) return

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const payload: StoredReviewDraft = {
          rating: values.rating,
          body: values.body,
          needsMediaReselect: selectedFiles.length > 0,
        }
        window.sessionStorage.setItem(draftKey(businessId), JSON.stringify(payload))
      }
      onRequireAuth()
      return
    }

    try {
      const uploadedMediaIds: string[] = []
      for (const file of selectedFiles) {
        const media = await uploadMedia.mutateAsync({
          file,
          title: businessName,
          altText: `Review image for ${businessName}`,
        })
        uploadedMediaIds.push(media.id)
      }

      const payload = {
        rating: values.rating,
        body: values.body,
        mediaIds: [...retainedMedia.map((media) => media.id), ...uploadedMediaIds],
      }

      if (review?.status === "rejected") {
        await resubmitReview.mutateAsync({ id: review.id, payload })
      } else {
        await createReview.mutateAsync(payload)
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(draftKey(businessId))
      }
      form.reset({ rating: 0, body: "" })
      setSelectedFiles([])
      setRetainedMedia([])
      setNeedsMediaReselect(false)
      setHasInitializedRejectedDraft(false)
      toast({
        title: "Review submitted",
        description: "Your review is now waiting for moderation.",
      })
    } catch (error) {
      toast({
        title: "Could not submit review",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <section className="container mx-auto px-4 pb-14 pt-6" id="add-review">
      <MithoCard surface="customer" interactive="none">
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
        <MithoCardContent className="space-y-5">
          {review?.status === "pending" ? (
            <div className="rounded-[1.2rem] border border-brand-orange/20 bg-brand-orange/5 p-4 text-sm text-brand-dark-green">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-orange" />
                <div>
                  <p className="font-semibold">Review submitted for moderation</p>
                  <p className="mt-1 text-muted-foreground">We’ll publish it once an internal moderator approves it.</p>
                </div>
              </div>
            </div>
          ) : null}

          {review?.status === "approved" ? (
            <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="font-semibold">Your review is already live.</p>
                  <p className="mt-1">Editing approved reviews is not available yet.</p>
                </div>
              </div>
            </div>
          ) : null}

          {review?.status === "rejected" ? (
            <div className="rounded-[1.2rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="font-semibold">Your review needs changes before it can go live.</p>
                  {review.rejectionFlag ? <p className="mt-1 capitalize">{review.rejectionFlag.replaceAll("_", " ")}</p> : null}
                  {review.moderationNote ? <p className="mt-1 text-red-700/90">{review.moderationNote}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          {needsMediaReselect ? (
            <div className="rounded-[1.2rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4" />
                <p>You’re back on the review form. Please reselect any images before submitting again.</p>
              </div>
            </div>
          ) : null}

          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your rating *</FormLabel>
                    <FormControl>
                      <StarRating rating={field.value} onChange={field.onChange} interactive size="lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your review *</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={5}
                        disabled={isLocked || isBusy}
                        placeholder="Tell people what stood out: dishes worth ordering, service, portions, wait time, and whether you'd come back."
                        className="w-full resize-none rounded-[1.25rem] border border-brand-deep-green/12 bg-white/90 px-4 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/12 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Add images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []).slice(0, 5)
                      setSelectedFiles((current) => [...current, ...files].slice(0, 5))
                      setNeedsMediaReselect(false)
                      event.currentTarget.value = ""
                    }}
                  />
                  <MithoButton
                    type="button"
                    variant="outline-secondary"
                    disabled={isLocked || isBusy || retainedMedia.length + selectedFiles.length >= 5}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4" />
                    Add images
                  </MithoButton>
                  <p className="mt-2 text-xs text-muted-foreground">Up to 5 images, 10MB each.</p>
                </div>

                {retainedMedia.length > 0 || selectedFiles.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {retainedMedia.map((media) => (
                      <div key={media.id} className="overflow-hidden rounded-[1rem] border border-brand-deep-green/10 bg-white">
                        <img src={media.publicUrl} alt={media.altText || businessName} className="h-28 w-full object-cover" />
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="truncate text-muted-foreground">{media.filename}</span>
                          {!isLocked ? (
                            <button
                              type="button"
                              className="text-danger transition-colors hover:text-danger/80"
                              onClick={() => setRetainedMedia((current) => current.filter((item) => item.id !== media.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                    {selectedFilePreviews.map(({ file, url }, index) => (
                      <div key={`${file.name}-${index}`} className="overflow-hidden rounded-[1rem] border border-brand-deep-green/10 bg-white">
                        <img src={url} alt={file.name} className="h-28 w-full object-cover" />
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="truncate text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                          {!isLocked ? (
                            <button
                              type="button"
                              className="text-danger transition-colors hover:text-danger/80"
                              onClick={() => setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <MithoButton type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={isLocked || isBusy}>
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {review?.status === "rejected" ? "Resubmit review" : "Submit review"}
              </MithoButton>
            </form>
          </Form>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
