"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bell, CircleAlert, Clock3, Mail, ShieldAlert, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useBusinessDetail, useBusinessHours, useMyBusiness } from "@/hooks/use-businesses"
import { useBusinessReviews, useUpsertBusinessReviewReply } from "@/hooks/use-reviews"
import { WeeklyBusinessHoursEditor } from "@/features/business/components/weekly-business-hours-editor"
import { BusinessEditForm } from "@/features/dashboard/screens/business-edit-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BusinessGallery } from "@/features/dashboard/components/business-gallery"
import { KeyMetrics } from "@/features/dashboard/components/key-metrics"
import { TrafficAnalytics } from "@/features/dashboard/components/traffic-analytics"
import type { BusinessLifecycleStatus } from "@/features/dashboard/data/dashboard-business-data"
import {
  deriveBusinessLifecycleStatus,
  getBusinessLifecyclePresentation,
} from "@/features/dashboard/utils/dashboard-business-utils"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoCard, MithoCardContent, MithoCardHeader } from "@/components/mitho/mitho-card"
import { ReviewProgress, StarRating } from "@/components/mitho/mitho-rating"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { reviewReplySchema, type ReviewReplyFormValues } from "@/lib/validators/reviews"
import type { ReviewItem } from "@/types/reviews"

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function canManageReply(role?: string, status?: string) {
  return status === "active" && (role === "owner" || role === "staff")
}

function ReviewReplyEditor({
  businessId,
  review,
  disabled,
  onCancel,
  onSaved,
}: {
  businessId: string
  review: ReviewItem
  disabled: boolean
  onCancel: () => void
  onSaved: () => void
}) {
  const { toast } = useToast()
  const mutation = useUpsertBusinessReviewReply(businessId)
  const form = useForm<ReviewReplyFormValues>({
    resolver: zodResolver(reviewReplySchema),
    defaultValues: {
      body: review.reply?.body ?? "",
    },
  })

  React.useEffect(() => {
    form.reset({ body: review.reply?.body ?? "" })
  }, [form, review.id, review.reply?.body])

  async function onSubmit(values: ReviewReplyFormValues) {
    try {
      await mutation.mutateAsync({
        reviewId: review.id,
        payload: {
          body: values.body,
        },
      })
      toast({
        title: review.reply ? "Reply updated" : "Reply posted",
        description: review.reply ? "Your updated response is now visible." : "Your response is now visible on the review.",
      })
      onSaved()
    } catch (error) {
      toast({
        title: "Could not save reply",
        description: extractApiErrorMessage(error),
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 rounded-lg border border-border bg-surface-business-inset p-4">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Write a calm, helpful response for this customer."
                  disabled={mutation.isPending || disabled}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <MithoButton size="sm" type="submit" disabled={mutation.isPending || disabled}>
            {mutation.isPending ? "Saving..." : review.reply ? "Update reply" : "Send reply"}
          </MithoButton>
          <MithoButton variant="ghost" size="sm" type="button" onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </MithoButton>
        </div>
      </form>
    </Form>
  )
}

function ReviewsOverview({ businessId }: { businessId: string }) {
  const [page, setPage] = React.useState(1)
  const [activeReplyId, setActiveReplyId] = React.useState<string | null>(null)
  const { data: business, isLoading: businessLoading } = useBusinessDetail(businessId)
  const { entry, isLoading: membershipLoading } = useMyBusiness(businessId)
  const canReply = canManageReply(entry?.membershipRole, entry?.membershipStatus)
  const isReplyEligibleBusiness = business?.listingStatus === "published" && business?.ownershipStatus === "claimed"
  const reviewsQuery = useBusinessReviews(
    businessId,
    { page, perPage: 5, sort: "latest" },
    isReplyEligibleBusiness,
  )
  const summary = reviewsQuery.data?.summary

  React.useEffect(() => {
    setPage(1)
  }, [businessId])

  if (businessLoading || membershipLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
      </div>
    )
  }

  if (!business) {
    return (
      <MithoCard>
        <MithoCardContent className="p-6">
          <p className="text-sm text-muted-foreground">Unable to load business reviews right now.</p>
        </MithoCardContent>
      </MithoCard>
    )
  }

  if (!isReplyEligibleBusiness) {
    return (
      <MithoCard>
        <MithoCardHeader>
          <h2 className="type-section-title text-foreground">Customer reviews</h2>
        </MithoCardHeader>
        <MithoCardContent className="space-y-2 p-6 pt-0">
          <p className="text-sm font-semibold text-foreground">Replies unlock after claim and publish.</p>
          <p className="text-sm leading-6 text-muted-foreground">
            This workspace can reply only when business is claimed and listing is published.
          </p>
        </MithoCardContent>
      </MithoCard>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="type-section-title text-foreground">Customer reviews</h2>
            <p className="type-meta mt-1">Read public feedback and respond as owner or staff.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-col items-center justify-center gap-2 lg:min-w-[200px]">
            <span className="text-5xl font-bold text-foreground">{(summary?.averageRating ?? business.ratingAvg ?? 0).toFixed(1)}</span>
            <StarRating rating={summary?.averageRating ?? business.ratingAvg ?? 0} size="lg" />
            <span className="text-sm text-muted-foreground">{summary?.totalReviews ?? business.ratingCount} reviews</span>
          </div>

          {summary ? (
            <div className="flex-1 space-y-2">
              <ReviewProgress stars={5} count={summary.ratings[5]} total={summary.totalReviews} />
              <ReviewProgress stars={4} count={summary.ratings[4]} total={summary.totalReviews} />
              <ReviewProgress stars={3} count={summary.ratings[3]} total={summary.totalReviews} />
              <ReviewProgress stars={2} count={summary.ratings[2]} total={summary.totalReviews} />
              <ReviewProgress stars={1} count={summary.ratings[1]} total={summary.totalReviews} />
            </div>
          ) : (
            <div className="flex-1 rounded-lg border border-border bg-white p-4 text-sm text-muted-foreground">
              Rating breakdown appears once published reviews are available.
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-border bg-white p-4 shadow-sm">
          {!canReply ? (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Only active owners and staff can publish public replies.
            </div>
          ) : null}

          {reviewsQuery.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-32 animate-pulse rounded-lg border border-border bg-muted/40" />
              ))}
            </div>
          ) : reviewsQuery.isError ? (
            <div className="rounded-lg border border-danger/15 bg-danger/5 p-4 text-sm text-danger">
              Could not load reviews right now.
            </div>
          ) : (reviewsQuery.data?.items.length ?? 0) > 0 ? (
            <div className="space-y-3">
              {reviewsQuery.data?.items.map((review) => {
                const isEditing = activeReplyId === review.id
                return (
                  <div key={review.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                        {review.author.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{review.author.name}</span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="ml-auto text-xs text-muted-foreground">{formatReviewDate(review.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.body}</p>

                        {review.reply ? (
                          <div className="mt-3 rounded-lg border border-brand-deep-green/10 bg-[#fffdf8] p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-brand-deep-green">Current reply</span>
                              <span className="text-xs text-muted-foreground">{formatReviewDate(review.reply.updatedAt)}</span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-foreground">{review.reply.body}</p>
                          </div>
                        ) : null}

                        {canReply ? (
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setActiveReplyId((current) => (current === review.id ? null : review.id))}
                              className="text-sm font-semibold text-brand-deep-green transition-colors hover:text-foreground"
                            >
                              {review.reply ? "Edit reply" : "Reply to review"}
                            </button>
                          </div>
                        ) : null}

                        {isEditing ? (
                          <ReviewReplyEditor
                            businessId={businessId}
                            review={review}
                            disabled={!canReply}
                            onCancel={() => setActiveReplyId(null)}
                            onSaved={() => {
                              setActiveReplyId(null)
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              No published reviews yet.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function ReviewsRoutePage({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6 pb-12">
      <ReviewsOverview businessId={businessId} />
    </div>
  )
}

export function PhotosRoutePage({ businessId }: { businessId: string }) {
  return (
    <div className="space-y-6 pb-12">
      <BusinessGallery businessId={businessId} />
    </div>
  )
}

export function AnalyticsRoutePage() {
  return (
    <div className="space-y-6 pb-12">
      <KeyMetrics />
      <TrafficAnalytics />
    </div>
  )
}

export function BusinessInfoRoutePage({ businessId }: { businessId: string }) {
  const { data: business, isLoading } = useBusinessDetail(businessId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Unable to load business details.</p>
      </div>
    )
  }

  return <BusinessEditForm businessId={business.id} business={business} />
}
export function HoursRoutePage({ businessId }: { businessId: string }) {
  const { data, isLoading, dataUpdatedAt } = useBusinessHours(businessId)

  return (
    <div className="space-y-6 pb-12">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
        </div>
      ) : (
        <WeeklyBusinessHoursEditor businessId={businessId} initialHours={data ?? []} key={`${businessId}-${dataUpdatedAt}`} />
      )}
    </div>
  )
}

function SettingsContent({ initialLifecycleStatus }: { initialLifecycleStatus: BusinessLifecycleStatus }) {
  const [notificationPreferences, setNotificationPreferences] = React.useState([
    {
      id: "new-reviews",
      title: "New reviews",
      description: "Get notified when a new review is posted so you can respond quickly.",
      enabled: true,
    },
    {
      id: "reply-reminders",
      title: "Reply reminders",
      description: "Receive reminders for reviews that have not been answered yet.",
      enabled: true,
    },
  ])
  const [settingsSaved, setSettingsSaved] = React.useState(false)
  const [lifecycleStatus, setLifecycleStatus] = React.useState<BusinessLifecycleStatus>(initialLifecycleStatus)
  const [isRemovalDialogOpen, setIsRemovalDialogOpen] = React.useState(false)
  const [removalReason, setRemovalReason] = React.useState("duplicate")
  const [removalNote, setRemovalNote] = React.useState("")
  const [removalRequested, setRemovalRequested] = React.useState(false)
  const lifecyclePresentation = getBusinessLifecyclePresentation(lifecycleStatus)

  const updateNotificationPreference = (id: string, enabled: boolean) => {
    setSettingsSaved(false)
    setNotificationPreferences((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-6">
        <section id="notification-preferences">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="type-section-title text-foreground">Notification preferences</h2>
              <p className="type-meta mt-1">Choose which updates should reach the owner or staff.</p>
            </div>
          </div>

          <div className="space-y-2">
            {notificationPreferences.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={item.enabled}
                  onCheckedChange={(checked) => updateNotificationPreference(item.id, checked)}
                  aria-label={item.title}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {settingsSaved ? <span className="text-sm font-medium text-success">Settings updated in this mock flow.</span> : null}
            <MithoButton onClick={() => setSettingsSaved(true)}>Save settings</MithoButton>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="type-section-title text-foreground">Business status & removal</h2>
              <p className="type-meta mt-1">Use lifecycle controls here instead of deleting or hiding a published listing directly.</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-business-inset px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${lifecyclePresentation.tone}`}>
                  {lifecyclePresentation.label}
                </span>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{lifecyclePresentation.description}</p>
              </div>
              {removalRequested ? (
                <span className="rounded-md bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  Removal requested
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
            <div className="divide-y divide-border">
              {lifecycleStatus === "active" ? (
                <>
                  <LifecycleActionRow
                    icon={<Clock3 className="h-4 w-4" />}
                    title="Temporarily close business"
                    description="Keep the listing public, but clearly show customers that the business is temporarily closed until you reopen it."
                    action={
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <MithoButton variant="outline-secondary" size="sm">Close temporarily</MithoButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Temporarily close this business?</AlertDialogTitle>
                            <AlertDialogDescription>
                              The listing will stay visible on Mitho and customers will see that the business is temporarily closed. You can reopen it later from this same settings page.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setLifecycleStatus("temporarily_closed")
                                setSettingsSaved(true)
                              }}
                            >
                              Close temporarily
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    }
                  />

                  <LifecycleActionRow
                    icon={<ShieldAlert className="h-4 w-4" />}
                    iconClassName="bg-danger/10 text-danger"
                    title="Mark permanently closed"
                    description="Use this when the business is no longer operating. The public listing remains visible as historical place data."
                    action={
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <MithoButton variant="outline-danger" size="sm">Mark closed</MithoButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Mark this business permanently closed?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Customers will continue to see the listing, but it will be labeled permanently closed. This is more serious than a temporary closure and should only be used when the business is no longer operating.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep active</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-danger text-danger-foreground hover:bg-danger/90"
                              onClick={() => {
                                setLifecycleStatus("permanently_closed")
                                setSettingsSaved(true)
                              }}
                            >
                              Mark permanently closed
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    }
                  />
                </>
              ) : null}

              {lifecycleStatus === "temporarily_closed" ? (
                <>
                  <LifecycleActionRow
                    icon={<Clock3 className="h-4 w-4" />}
                    iconClassName="bg-success/10 text-success"
                    title="Reopen business"
                    description="Remove the temporary closure label and return the listing to its normal active state."
                    action={
                      <MithoButton
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          setLifecycleStatus("active")
                          setSettingsSaved(true)
                        }}
                      >
                        Reopen
                      </MithoButton>
                    }
                  />

                  <LifecycleActionRow
                    icon={<ShieldAlert className="h-4 w-4" />}
                    iconClassName="bg-danger/10 text-danger"
                    title="Mark permanently closed"
                    description="Escalate from temporary closure when the business will not reopen."
                    action={
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <MithoButton variant="outline-danger" size="sm">Mark closed</MithoButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Convert this to permanently closed?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will keep the listing public as a permanently closed business record instead of a reversible temporary closure.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep temporarily closed</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-danger text-danger-foreground hover:bg-danger/90"
                              onClick={() => {
                                setLifecycleStatus("permanently_closed")
                                setSettingsSaved(true)
                              }}
                            >
                              Mark permanently closed
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    }
                  />
                </>
              ) : null}

              {lifecycleStatus === "permanently_closed" ? (
                <div className="flex items-start gap-3 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Permanent closure is now the public-facing status.</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      If this was set by mistake, handle the correction through support or a future admin workflow rather than ordinary day-to-day settings.
                    </p>
                  </div>
                </div>
              ) : null}

              <Dialog open={isRemovalDialogOpen} onOpenChange={setIsRemovalDialogOpen}>
                <LifecycleActionRow
                  icon={<Trash2 className="h-4 w-4" />}
                  iconClassName="bg-danger/10 text-danger"
                  title="Request listing removal"
                  description="Use this for duplicates, incorrect listings, or other cases that should be reviewed instead of deleted immediately."
                  action={
                    <MithoButton
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setIsRemovalDialogOpen(true)}
                    >
                      Request removal
                    </MithoButton>
                  }
                />
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Request listing removal</DialogTitle>
                    <DialogDescription>
                      Published businesses are not hard-deleted directly from the dashboard. Submit the reason here so the removal can be reviewed safely.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <label className="space-y-2">
                      <span className="block text-xs font-semibold text-muted-foreground">Reason</span>
                      <select
                        value={removalReason}
                        onChange={(event) => setRemovalReason(event.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="duplicate">Duplicate listing</option>
                        <option value="incorrect">Incorrect or mistaken listing</option>
                        <option value="draft-mistake">Created by mistake before proper setup</option>
                        <option value="other">Other review-needed reason</option>
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs font-semibold text-muted-foreground">Optional note</span>
                      <textarea
                        rows={4}
                        value={removalNote}
                        onChange={(event) => setRemovalNote(event.target.value)}
                        placeholder="Share any context that will help support or admin review the request."
                        className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <div className="rounded-lg border border-border bg-surface-business-inset px-4 py-4 text-sm leading-6 text-muted-foreground">
                      Removal requests are meant for safe review workflows. The public listing may stay visible until the request is reviewed and approved.
                    </div>
                  </div>
                  <DialogFooter>
                    <MithoButton variant="outline-secondary" onClick={() => setIsRemovalDialogOpen(false)}>
                      Cancel
                    </MithoButton>
                    <MithoButton
                      variant="danger"
                      onClick={() => {
                        setRemovalRequested(true)
                        setSettingsSaved(true)
                        setIsRemovalDialogOpen(false)
                      }}
                    >
                      Submit removal request
                    </MithoButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function LifecycleActionRow({
  icon,
  iconClassName = "bg-muted text-muted-foreground",
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  iconClassName?: string
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0 pl-[52px] sm:pl-0">{action}</div>
    </div>
  )
}

export function SettingsRoutePage({ businessId }: { businessId: string }) {
  const { entry, isLoading } = useMyBusiness(businessId)

  if (isLoading || !entry) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-deep-green/20 border-t-brand-deep-green/60" />
      </div>
    )
  }

  return <SettingsContent initialLifecycleStatus={deriveBusinessLifecycleStatus(entry)} />
}
