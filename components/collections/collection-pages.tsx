"use client"

import Link from "next/link"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Copy,
  Globe,
  GripVertical,
  Lock,
  MapPin,
  PencilLine,
  Plus,
  Search,
  Share2,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  buildCopiedCollection,
  buildDraftCollection,
  createCollectionId,
  currentCustomer,
  getCollectionCoverImages,
  getCollectionPlaceCount,
  type CollectionRecord,
  type CollectionVisibility,
} from "@/components/collections/collection-data"
import { GoogleSignInDialog } from "@/components/auth/google-sign-in-dialog"
import { CollectionShowcaseCard } from "@/components/collections/collection-showcase-card"
import { ProfileNavigation } from "@/components/profile/profile-navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleSwitch } from "@/components/ui/mitho-toggle-switch"
import { Textarea } from "@/components/ui/textarea"
import { collectionSchema, collectionVisibilityOptions, type CollectionFormValues } from "@/lib/validators/collection"
import { cn } from "@/lib/utils"

const sectionCardClass =
  "rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_12px_30px_rgba(10,70,53,0.05)]"
const inputClassName =
  "h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-12 w-full rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className={sectionCardClass}>
      <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
        <p className="type-eyebrow text-brand-deep-green/68">{eyebrow}</p>
        <h1 className="type-page-title mt-3 text-brand-dark-green">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="px-6 py-5 sm:px-8">
        <ProfileNavigation />
      </div>
    </section>
  )
}

function VisibilityBadge({ visibility }: { visibility: CollectionVisibility }) {
  return visibility === "public" ? (
    <MithoBadge variant="neutral" className="gap-1">
      <Globe className="h-3.5 w-3.5" />
      Public
    </MithoBadge>
  ) : (
    <MithoBadge variant="muted" className="gap-1">
      <Lock className="h-3.5 w-3.5" />
      Private
    </MithoBadge>
  )
}

export function CollectionCard({ collection, href }: { collection: CollectionRecord; href: string }) {
  return (
    <CollectionShowcaseCard collection={collection} href={href} showStatus />
  )
}

function CollectionDeckCover({
  collection,
  className,
  size = "card",
}: {
  collection: CollectionRecord
  className?: string
  size?: "card" | "hero"
}) {
  const coverImages = getCollectionCoverImages(collection)
  const centerImage = coverImages[0]
  const leftImage = coverImages[1]
  const rightImage = coverImages[2]
  const dimensions =
    size === "hero"
      ? {
          frame: "h-52 max-w-[360px] sm:h-60 sm:max-w-[420px]",
          side: "top-8 h-36 w-[34%] rounded-[1.15rem]",
          center: "h-44 w-[60%] rounded-[1.35rem] sm:h-52",
          icon: "h-7 w-7",
        }
      : {
          frame: "h-40 max-w-[290px]",
          side: "top-5 h-28 w-[34%] rounded-[1rem]",
          center: "h-36 w-[58%] rounded-[1.2rem]",
          icon: "h-6 w-6",
        }

  return (
    <div className={cn("relative", dimensions.frame, className)}>
      <div className={cn("absolute left-4 -rotate-[7deg] overflow-hidden border border-brand-deep-green/10 bg-[#fff7eb] shadow-[0_10px_24px_rgba(10,70,53,0.06)]", dimensions.side)}>
        {leftImage ? (
          <img src={leftImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-deep-green/38">
            <Bookmark className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className={cn("absolute right-4 rotate-[7deg] overflow-hidden border border-brand-deep-green/10 bg-[#fff7eb] shadow-[0_10px_24px_rgba(10,70,53,0.06)]", dimensions.side)}>
        {rightImage ? (
          <img src={rightImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-deep-green/38">
            <Bookmark className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className={cn("absolute inset-x-0 top-0 mx-auto overflow-hidden border border-brand-deep-green/12 bg-brand-soft-beige/50 shadow-[0_16px_34px_rgba(10,70,53,0.08)]", dimensions.center)}>
        {centerImage ? (
          <img src={centerImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-deep-green/45">
            <Bookmark className={dimensions.icon} />
          </div>
        )}
      </div>
    </div>
  )
}

function CollectionItemRow({
  item,
  showMoveControls = false,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  item: CollectionRecord["items"][number]
  showMoveControls?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onRemove?: () => void
}) {
  return (
    <div className="flex gap-4 rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-4">
      <img src={item.imageUrl} alt={item.businessName} className="h-24 w-24 rounded-[1rem] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href={item.publicHref} className="text-lg font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
              {item.businessName}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.location}
              </span>
              <span>{item.category}</span>
            </div>
          </div>
          {showMoveControls ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMoveUp}
                className="rounded-full border border-brand-deep-green/10 p-2 text-brand-deep-green transition-colors hover:bg-brand-soft-beige/50"
                aria-label={`Move ${item.businessName} up`}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                className="rounded-full border border-brand-deep-green/10 p-2 text-brand-deep-green transition-colors hover:bg-brand-soft-beige/50"
                aria-label={`Move ${item.businessName} down`}
              >
                <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="rounded-full border border-danger/20 p-2 text-danger transition-colors hover:bg-danger/10"
                aria-label={`Remove ${item.businessName}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.note}</p>
      </div>
    </div>
  )
}

function CreateCollectionModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  })

  const onSubmit = (values: CollectionFormValues) => {
    const collectionId = createCollectionId(values.title)
    const params = new URLSearchParams({
      draft: "1",
      title: values.title,
      visibility: values.visibility,
    })

    if (values.description) {
      params.set("description", values.description)
    }

    onOpenChange(false)
    router.push(`/collections/${collectionId}?${params.toString()}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[1.75rem] border-brand-deep-green/10 p-0 shadow-[0_24px_60px_rgba(10,70,53,0.16)]">
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-brand-dark-green">Create a new collection</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-7 text-muted-foreground">
              Start with a title and privacy level, then add places and shape the list once it opens.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection title</FormLabel>
                    <FormControl>
                      <Input {...field} className={inputClassName} placeholder="Best Pizza Places" />
                    </FormControl>
                    <FormDescription>Give the list a name that still makes sense when someone sees it later in your profile.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-28 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                        placeholder="A short note about why these places belong together."
                      />
                    </FormControl>
                    <FormDescription>Optional, but it helps later if the collection goes public or gets copied.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerClassName}>
                          <SelectValue placeholder="Choose visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {collectionVisibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Public collections can be viewed and copied by other people. Private ones stay only on your account.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <MithoButton type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </MithoButton>
                <MithoButton type="submit">
                  Create collection
                  <ArrowRight className="h-4 w-4" />
                </MithoButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CollectionsIndexPage({ collections }: { collections: CollectionRecord[] }) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<"recent" | "alpha" | "size">("recent")

  const filteredCollections = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matchingCollections = normalizedQuery
      ? collections.filter((collection) =>
          [collection.title, collection.description ?? "", collection.provenance?.sourceTitle ?? ""].some((value) =>
            value.toLowerCase().includes(normalizedQuery),
          ),
        )
      : collections

    return [...matchingCollections].sort((a, b) => {
      if (sortOrder === "alpha") {
        return a.title.localeCompare(b.title)
      }

      if (sortOrder === "size") {
        return b.items.length - a.items.length
      }

      return 0
    })
  }, [collections, query, sortOrder])

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Collection module"
          title="Curate the places worth keeping."
          description="Build food shortlists, private planning boards, and copied public finds in one calmer system that feels more intentional than one-off saves."
        />

        <section className={sectionCardClass}>
          <div className="flex flex-col gap-4 border-b border-brand-deep-green/10 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className={cn(inputClassName, "pl-11")}
                  placeholder="Search collections"
                />
              </div>

              <Select value={sortOrder} onValueChange={(value: "recent" | "alpha" | "size") => setSortOrder(value)}>
                <SelectTrigger className={cn(selectTriggerClassName, "sm:w-[190px]")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently updated</SelectItem>
                  <SelectItem value="alpha">A-Z</SelectItem>
                  <SelectItem value="size">Most places</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MithoBadge variant="muted">{collections.length} collections</MithoBadge>
              <MithoButton onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create collection
              </MithoButton>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="type-eyebrow text-brand-deep-green/68">All collections</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-dark-green">One place for the lists you make, shape, and keep coming back to.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  Search and scan everything in one stream so collections feel easy to browse, easy to grow, and easy to page later.
                </p>
              </div>
              <span className="text-sm text-muted-foreground">{filteredCollections.length} showing</span>
            </div>

            {filteredCollections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} href={`/collections/${collection.id}`} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
                <p className="text-base font-semibold text-brand-dark-green">
                  {query ? "No collections match this search." : "Start your first collection here."}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {query
                    ? "Try another collection title or clear the search to see everything again."
                    : "Create a collection for the places you want to keep returning to, comparing, or sharing later."}
                </p>
              </div>
            )}
          </div>
        </section>

        <CreateCollectionModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </div>
  )
}

export function CollectionDetailPage({
  collection,
  isOwner = true,
  publicSourceHref,
}: {
  collection: CollectionRecord
  isOwner?: boolean
  publicSourceHref?: string
}) {
  const [visibility, setVisibility] = React.useState<CollectionVisibility>(collection.visibility)

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <Link href={isOwner ? "/collections" : publicSourceHref ?? `/users/${collection.owner.username}/collections/${collection.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange">
              <ArrowLeft className="h-4 w-4" />
              {isOwner ? "Back to collections" : `Back to @${collection.owner.username}'s collection`}
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <VisibilityBadge visibility={visibility} />
            </div>
            <h1 className="type-page-title mt-4 text-brand-dark-green">{collection.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              {collection.description ?? "A place list that stays easier to reuse once the title and privacy are clear."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{getCollectionPlaceCount(collection)} places</span>
              <span>{collection.updatedLabel}</span>
              <span>by @{collection.owner.username}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-6 py-6 sm:px-8">
            {isOwner ? (
              <>
                <MithoButton variant="secondary" asChild>
                  <Link href={`/collections/${collection.id}/edit`}>
                    <PencilLine className="h-4 w-4" />
                    Edit collection
                  </Link>
                </MithoButton>
                <div className="flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-2">
                  <div>
                    <p className="text-sm font-semibold text-brand-dark-green">Public</p>
                    <p className="text-xs text-muted-foreground">
                      {visibility === "public" ? "Anyone can view this collection." : "Only you can view this collection."}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={visibility === "public"}
                    onCheckedChange={(checked) => setVisibility(checked ? "public" : "private")}
                    aria-label="Toggle collection visibility"
                  />
                </div>
                {visibility === "public" ? (
                  <MithoButton variant="ghost" asChild>
                    <Link href={`/users/${currentCustomer.username}/collections/${collection.id}`}>
                      <Share2 className="h-4 w-4" />
                      View public version
                    </Link>
                  </MithoButton>
                ) : null}
              </>
            ) : (
              <MithoButton asChild>
                <Link href={`/collections/${collection.id}/copy?sourceUser=${collection.owner.username}`}>
                  <Copy className="h-4 w-4" />
                  Copy collection
                </Link>
              </MithoButton>
            )}
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Places in this collection</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {collection.items.length > 0
                ? "Each place should earn its place in the list with enough context to make the collection useful later."
                : "A new collection starts better when it has a clear name first, then you can add places one by one without rushing the structure."}
            </p>
          </div>
          <div className="space-y-4 px-6 py-6 sm:px-8">
            {collection.items.length > 0 ? (
              collection.items.map((item) => <CollectionItemRow key={item.id} item={item} />)
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
                <p className="text-base font-semibold text-brand-dark-green">No places here yet.</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Start from explore or a business page, then add the first place once the collection title is settled.
                </p>
                {isOwner ? (
                  <MithoButton className="mt-4" asChild>
                    <Link href="/explore">Browse places to add</Link>
                  </MithoButton>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export function PublicCollectionDetailPage({ collection }: { collection: CollectionRecord }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingCopyAfterAuth, setPendingCopyAfterAuth] = React.useState(false)
  const [copySuccess, setCopySuccess] = React.useState(false)

  const copiedCollection = React.useMemo(() => buildCopiedCollection(collection), [collection])

  const handleCopy = React.useCallback(() => {
    setCopySuccess(true)
  }, [])

  const handleCopyPress = () => {
    if (!isAuthenticated) {
      setPendingCopyAfterAuth(true)
      setIsSignInOpen(true)
      return
    }

    handleCopy()
  }

  React.useEffect(() => {
    if (!isAuthenticated || !pendingCopyAfterAuth) return

    handleCopy()
    setPendingCopyAfterAuth(false)
  }, [handleCopy, isAuthenticated, pendingCopyAfterAuth])

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <section className={cn(sectionCardClass, "overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fff8ee_100%)]")}>
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div className="space-y-5">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
              >
                <ArrowLeft className="h-4 w-4" />
                Explore more collections
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <VisibilityBadge visibility={collection.visibility} />
                <MithoBadge variant="muted">{getCollectionPlaceCount(collection)} places</MithoBadge>
                <span className="text-sm text-muted-foreground">{collection.updatedLabel}</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={collection.owner.avatarUrl}
                  alt={collection.owner.name}
                  className="h-12 w-12 rounded-full border border-brand-deep-green/10 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-brand-dark-green">{collection.owner.name}</p>
                  <p className="text-sm text-muted-foreground">@{collection.owner.username}</p>
                </div>
              </div>

              <div>
                <h1 className="type-page-title text-brand-dark-green">{collection.title}</h1>
                {collection.description ? (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{collection.description}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MithoButton onClick={handleCopyPress}>
                  <Copy className="h-4 w-4" />
                  Copy collection
                </MithoButton>
                <p className="text-sm leading-7 text-muted-foreground">
                  Copy this list into your own account and shape it into your next food plan.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white/78 px-5 py-6 shadow-[0_16px_36px_rgba(10,70,53,0.06)]">
              <CollectionDeckCover collection={collection} size="hero" className="mx-auto" />
              <div className="mt-6 space-y-3 rounded-[1.35rem] border border-brand-deep-green/10 bg-white/84 p-4">
                <p className="type-eyebrow text-brand-deep-green/68">Collection feel</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  A public shortlist built to be shared, copied, and revisited when someone wants a quicker answer than an endless food debate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {copySuccess ? (
          <section className="rounded-[1.75rem] border border-success/18 bg-success/8 shadow-[0_12px_30px_rgba(10,70,53,0.05)]">
            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="text-base font-semibold text-brand-dark-green">Collection copied to your account.</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Your copy is private, independent, and ready to rename or expand whenever you want.
                  </p>
                </div>
              </div>
              <MithoButton variant="outline-secondary" asChild>
                <Link href={`/collections/${copiedCollection.id}`}>
                  Open copied collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </div>
          </section>
        ) : null}

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Places in this collection</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {collection.items.length > 0
                ? "A collection is only useful if each stop earns its place, so every entry here should help someone decide faster and eat better."
                : "This public list does not have any places yet."}
            </p>
          </div>

          <div className="space-y-4 px-6 py-6 sm:px-8">
            {collection.items.length > 0 ? (
              collection.items.map((item) => <CollectionItemRow key={item.id} item={item} />)
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-6">
                <p className="text-base font-semibold text-brand-dark-green">No places are published in this collection yet.</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Check back later or explore other public collections for fresher food routes and neighborhood shortlists.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        title="Sign in to copy this collection."
        description="Use Google so Mitho can save this collection under the same account you use for reviews, places, and future business actions."
        helperCopy="After sign-in, Mitho will copy this collection right here and keep you on the same page."
        onContinue={() => {
          setIsAuthenticated(true)
          setIsSignInOpen(false)
        }}
      />
    </div>
  )
}

export function CollectionEditPage({ collection }: { collection: CollectionRecord }) {
  const [items, setItems] = React.useState(collection.items)
  const [saved, setSaved] = React.useState(false)
  const [deleted, setDeleted] = React.useState(false)

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: collection.title,
      description: collection.description ?? "",
      visibility: collection.visibility,
    },
  })

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return

    const nextItems = [...items]
    const current = nextItems[index]
    nextItems[index] = nextItems[nextIndex]
    nextItems[nextIndex] = current
    setItems(nextItems)
    setSaved(false)
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setSaved(false)
  }

  const onSubmit = () => {
    setSaved(true)
  }

  if (deleted) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-12">
        <section className={sectionCardClass}>
          <div className="px-6 py-8 sm:px-8">
            <MithoBadge variant="danger">Collection deleted</MithoBadge>
            <h1 className="type-page-title mt-4 text-brand-dark-green">This collection is removed in this mock flow.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Use this as the future destructive state. Real persistence can hook into the same route and messaging later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MithoButton asChild>
                <Link href="/collections">Back to collections</Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/profile">Return to profile</Link>
              </MithoButton>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Collection edit"
          title={`Shape ${collection.title} without leaving the account flow.`}
          description="This is where title, privacy, and the item order become deliberate instead of staying as a loose list."
        />

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-brand-dark-green">Collection details</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Edit the collection identity here, then adjust the items below before saving.
                </p>
              </div>
              {saved ? <span className="text-sm font-medium text-success">Changes are updated in this mock screen.</span> : null}
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection title</FormLabel>
                        <FormControl>
                          <Input {...field} className={inputClassName} />
                        </FormControl>
                        <FormDescription>Keep the title readable when someone sees it in profile or on a copied public version later.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerClassName}>
                              <SelectValue placeholder="Choose visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {collectionVisibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Public collections can be viewed and copied. Private ones stay only on your account.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-28 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                        />
                      </FormControl>
                      <FormDescription>A short description helps explain why these places belong together when the list is shared or copied.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3">
                  <MithoButton type="submit">
                    Save collection
                    <ArrowRight className="h-4 w-4" />
                  </MithoButton>
                  <MithoButton variant="outline-secondary" asChild>
                    <Link href={`/collections/${collection.id}`}>View collection</Link>
                  </MithoButton>
                </div>
              </form>
            </Form>
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Collection items</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Move places up or down to shape the order, or remove items that no longer deserve space in the list.
            </p>
          </div>
          <div className="space-y-4 px-6 py-6 sm:px-8">
            {items.map((item, index) => (
              <CollectionItemRow
                key={item.id}
                item={item}
                showMoveControls
                onMoveUp={() => moveItem(index, -1)}
                onMoveDown={() => moveItem(index, 1)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        </section>

        <section className={cn(sectionCardClass, "border-danger/18")}>
          <div className="border-b border-danger/12 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Danger zone</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Keep destructive actions separate so editing a collection never feels confused with removing it entirely.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-8">
            <div>
              <p className="text-base font-semibold text-brand-dark-green">Delete this collection</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Use a separated destructive action so users do not confuse editing the list with deleting it entirely.
              </p>
            </div>
            <MithoButton variant="outline-danger" onClick={() => setDeleted(true)}>
              <Trash2 className="h-4 w-4" />
              Delete collection
            </MithoButton>
          </div>
        </section>
      </div>
    </div>
  )
}

export function CollectionCopyPage({ sourceCollection }: { sourceCollection: CollectionRecord }) {
  const destinationCollection = buildCopiedCollection(sourceCollection)
  const [copied, setCopied] = React.useState(false)

  if (copied) {
    return (
      <div className="container mx-auto px-4 py-10 md:py-12">
        <section className={sectionCardClass}>
          <div className="px-6 py-8 sm:px-8">
            <MithoBadge variant="success">Collection copied</MithoBadge>
            <h1 className="type-page-title mt-4 text-brand-dark-green">The copied collection is ready on your account.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              This new list is independent from @{sourceCollection.owner.username}'s original collection. Future edits on their side will not change your copy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <MithoButton asChild>
                <Link href={`/collections/${destinationCollection.id}`}>
                  Open copied collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
              <MithoButton variant="outline-secondary" asChild>
                <Link href={`/users/${sourceCollection.owner.username}/collections/${sourceCollection.id}`}>Back to original collection</Link>
              </MithoButton>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <PageIntro
          eyebrow="Collection copy"
          title="Copy this public collection into your own account."
          description="Copied collections are snapshots. They keep the source attribution, but they do not live-sync when the original owner changes the list later."
        />

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <MithoBadge variant="neutral">@{sourceCollection.owner.username}</MithoBadge>
              <MithoBadge variant="outline-orange">Snapshot copy</MithoBadge>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-brand-dark-green">{sourceCollection.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {sourceCollection.description ?? "This public list is eligible to be copied into your own private account."}
            </p>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px] sm:px-8">
            <div className="space-y-4">
              <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
                <p className="type-eyebrow text-brand-deep-green/68">What gets copied</p>
                <div className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                  <p>{getCollectionPlaceCount(sourceCollection)} places move into your own private copy.</p>
                  <p>The title starts as <span className="font-semibold text-brand-dark-green">{destinationCollection.title}</span>.</p>
                  <p>The source attribution stays visible so you remember where the list came from.</p>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-5">
                <p className="text-base font-semibold text-brand-dark-green">Snapshot behavior</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                  <li>The copied list is independent from the original immediately.</li>
                  <li>Changes to the source collection do not update your copy.</li>
                  <li>You can rename, reorder, and expand your version freely afterward.</li>
                </ul>
              </div>
            </div>

            <aside className="space-y-4 rounded-[1.5rem] border border-brand-deep-green/10 bg-white p-5">
              <div>
                <p className="type-eyebrow text-brand-deep-green/68">Destination preview</p>
                <h3 className="mt-3 text-xl font-semibold text-brand-dark-green">{destinationCollection.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">Private collection on @{currentCustomer.username}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {getCollectionCoverImages(sourceCollection).map((imageUrl, index) => (
                  <img key={`${imageUrl}-${index}`} src={imageUrl} alt="" className="h-16 w-16 rounded-[1rem] object-cover" />
                ))}
              </div>
              <MithoButton className="w-full" onClick={() => setCopied(true)}>
                <Copy className="h-4 w-4" />
                Copy collection
              </MithoButton>
            </aside>
          </div>
        </section>
      </div>
    </div>
  )
}
