"use client"

import * as React from "react"
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
  flat?: boolean
}

interface StoredReviewDraft {
  title: string
  rating: number
  body: string
  tips: string
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
  flat = false,
}: AddReviewFormProps) {
  const { isAuthenticated } = useAuthSnapshot()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [retainedMedia, setRetainedMedia] = React.useState<Media[]>([])
  const [needsMediaReselect, setNeedsMediaReselect] = React.useState(false)
  const [hasInitializedServerDraft, setHasInitializedServerDraft] = React.useState(false)
  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: {
      title: "",
      rating: 0,
      body: "",
      tips: "",
    },
  })

  const reviewQuery = useMyBusinessReview(businessId, isAuthenticated)
  const createReview = useCreateBusinessReview(businessId)
  const resubmitReview = useResubmitReview()
  const uploadMedia = useUploadMedia()
  const review = reviewQuery.data?.review ?? null
  const canReview = reviewQuery.data?.canReview ?? true
  const canReviewAgainAt = reviewQuery.data?.canReviewAgainAt ?? null
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
    if (!review || hasInitializedServerDraft) return
    if (review.status !== "rejected") return
    form.reset({
      title: review.title,
      rating: review.rating,
      body: review.body,
      tips: review.tips ?? "",
    })
    setRetainedMedia(review.media ?? [])
    setHasInitializedServerDraft(true)
  }, [form, hasInitializedServerDraft, review])

  const isCooldownLocked = review?.status === "approved" && !canReview
  const isPendingLocked = review?.status === "pending"
  const isLocked = isCooldownLocked || isPendingLocked
  const isBusy = createReview.isPending || resubmitReview.isPending || uploadMedia.isPending
  const cooldownDateLabel = canReviewAgainAt
    ? new Date(canReviewAgainAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : null

  async function onSubmit(values: AddReviewFormValues) {
    if (isLocked) return

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const payload: StoredReviewDraft = {
          title: values.title,
          rating: values.rating,
          body: values.body,
          tips: values.tips ?? "",
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
        title: values.title,
        rating: values.rating,
        body: values.body,
        tips: values.tips,
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
      form.reset({ title: "", rating: 0, body: "", tips: "" })
      setSelectedFiles([])
      setRetainedMedia([])
      setNeedsMediaReselect(false)
      setHasInitializedServerDraft(false)
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

  const formBody = (
    <div className="space-y-5">
      {isPendingLocked ? (
        <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-4 text-sm text-brand-dark-green">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-orange" />
            <div>
              <p className="font-semibold">Your review is awaiting moderation.</p>
              <p className="mt-1 text-muted-foreground">You can write another once it has been reviewed.</p>
            </div>
          </div>
        </div>
      ) : null}

      {isCooldownLocked ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-semibold">Your review is live.</p>
              <p className="mt-1">
                {cooldownDateLabel
                  ? `You can write a new review for this place on ${cooldownDateLabel}.`
                  : "You can write a new review for this place after the cooldown period."}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {review?.status === "rejected" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="text"
                    disabled={isLocked || isBusy}
                    placeholder="Sum up your visit in a few words"
                    className="w-full rounded-xl border border-border bg-white/90 px-4 py-3 text-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Tell people what stood out: dishes worth ordering, service, portions, wait time, and whether you’d come back."
                    className="w-full resize-none rounded-xl border border-border bg-white/90 px-4 py-3 text-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tips for others (optional)</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    disabled={isLocked || isBusy}
                    placeholder="Quick hints for other customers — what to order, best time to go, parking, etc."
                    className="w-full resize-none rounded-xl border border-border bg-white/90 px-4 py-3 text-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Quick hints for other customers — what to order, best time to go, parking, etc. (max 500 characters)
                </p>
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
              <div className="flex flex-wrap gap-3">
                {retainedMedia.map((media) => (
                  <div key={media.id} className="relative">
                    <img
                      src={media.publicUrl}
                      alt={media.altText || businessName}
                      className="h-24 w-24 rounded-lg border border-border object-cover"
                    />
                    {!isLocked ? (
                      <button
                        type="button"
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-danger transition-colors hover:text-danger/80"
                        onClick={() => setRetainedMedia((current) => current.filter((item) => item.id !== media.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
                {selectedFilePreviews.map(({ file, url }, index) => (
                  <div key={`${file.name}-${index}`} className="relative">
                    <img src={url} alt={file.name} className="h-24 w-24 rounded-lg border border-border object-cover" />
                    {!isLocked ? (
                      <button
                        type="button"
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-danger transition-colors hover:text-danger/80"
                        onClick={() => setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
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
    </div>
  )

  if (flat) {
    return formBody
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
          {formBody}
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
