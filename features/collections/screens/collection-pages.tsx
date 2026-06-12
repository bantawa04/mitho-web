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
  GripVertical,
  MapPin,
  PencilLine,
  Plus,
  Search,
  Share2,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { updateCollectionItem as updateCollectionItemRequest } from "@/lib/api/collections"
import { useAuthSnapshot } from "@/hooks/use-auth-session"
import {
  useCollection,
  useCollections,
  useCopyCollection,
  useCreateCollection,
  useDeleteCollection,
  useDeleteCollectionItem,
  usePublicCollection,
  useReorderCollectionItems,
  useUpdateCollection,
} from "@/hooks/use-collections"
import { GoogleSignInDialog } from "@/features/auth/components/google-sign-in-dialog"
import { CollectionVisibilityBadge } from "@/features/collections/components/collection-visibility-badge"
import { CollectionShowcaseCard } from "@/features/collections/components/collection-showcase-card"
import { getCollectionCoverImages, getCollectionPlaceCount } from "@/features/collections/utils/collection-helpers"
import { ProfileNavigation } from "@/features/profile/components/profile-navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"
import { Textarea } from "@/components/ui/textarea"
import { collectionSchema, collectionVisibilityOptions, type CollectionFormValues } from "@/lib/validators/collection"
import type { CollectionItemRecord, CollectionRecord, CollectionVisibility } from "@/types/collections"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const sectionCardClass =
  "rounded-xl border border-brand-deep-green/10 bg-white shadow-sm"
const inputClassName =
  "h-12 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "w-full rounded-lg border-brand-deep-green/12 bg-muted px-4 text-sm shadow-none data-[size=default]:h-12 data-[size=sm]:h-12 focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

function ProfileTabsPanel() {
  return (
    <section className={sectionCardClass}>
      <div className="px-4 py-4 sm:px-6">
        <ProfileNavigation />
      </div>
    </section>
  )
}

export function CollectionCard({ collection, href }: { collection: CollectionRecord; href: string }) {
  return <CollectionShowcaseCard collection={collection} href={href} showStatus />
}

function CollectionItemRow({
  item,
  showMoveControls = false,
  onMoveUp,
  onMoveDown,
  onRemove,
  onNoteChange,
}: {
  item: CollectionItemRecord
  showMoveControls?: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  onRemove?: () => void
  onNoteChange?: (value: string) => void
}) {
  const image = item.business?.image?.publicUrl
  return (
    <div className="flex gap-4 rounded-xl border border-brand-deep-green/10 bg-white p-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {image ? <img src={image} alt={item.business?.name ?? "Collection item"} className="h-full w-full object-cover" /> : <Bookmark className="h-6 w-6 text-brand-deep-green/35" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {item.business ? (
              <Link href={item.business.publicHref} className="text-lg font-semibold text-brand-dark-green transition-colors hover:text-brand-orange">
                {item.business.name}
              </Link>
            ) : (
              <p className="text-lg font-semibold text-brand-dark-green">Unavailable place</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {item.business ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {item.business.location}
                  </span>
                  <span>{item.business.category}</span>
                </>
              ) : (
                <span>This place is no longer publicly available.</span>
              )}
            </div>
          </div>
          {showMoveControls ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={onMoveUp} className="rounded-full border border-brand-deep-green/10 p-2 text-brand-deep-green transition-colors hover:bg-brand-soft-beige/50">
                <GripVertical className="h-4 w-4" />
              </button>
              <button type="button" onClick={onMoveDown} className="rounded-full border border-brand-deep-green/10 p-2 text-brand-deep-green transition-colors hover:bg-brand-soft-beige/50">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
              <button type="button" onClick={onRemove} className="rounded-full border border-danger/20 p-2 text-danger transition-colors hover:bg-danger/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
        {showMoveControls ? (
          <Textarea
            value={item.note ?? ""}
            onChange={(event) => onNoteChange?.(event.target.value)}
            placeholder="Add note for why this place belongs here."
            className="mt-3 min-h-24 rounded-lg border-brand-deep-green/12 bg-muted px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
          />
        ) : (
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.note ?? "No note yet."}</p>
        )}
      </div>
    </div>
  )
}

function CreateCollectionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const createMutation = useCreateCollection()
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  })

  const onSubmit = async (values: CollectionFormValues) => {
    const collection = await createMutation.mutateAsync(values)
    onOpenChange(false)
    router.push(`/collections/${collection.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-xl border-brand-deep-green/10 p-0 shadow-sm">
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-brand-dark-green">Create a new collection</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-7 text-muted-foreground">
              Start with title and privacy level, then shape list once it opens.
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
                      <Textarea {...field} className="min-h-28 rounded-lg border-brand-deep-green/12 bg-muted px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15" />
                    </FormControl>
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
                          <SelectValue />
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
                    <FormDescription>Public collections can be viewed and copied by other people.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <MithoButton type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </MithoButton>
                <MithoButton type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create collection"}
                </MithoButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CollectionsIndexPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<"recent" | "alpha" | "size">("recent")
  const collectionsQuery = useCollections({
    search: query || undefined,
    sort: sortOrder,
    perPage: 100,
  })
  const collections = collectionsQuery.data?.items ?? []

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <ProfileTabsPanel />
        <section className={sectionCardClass}>
          <div className="flex flex-col gap-4 border-b border-brand-deep-green/10 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} className={cn(inputClassName, "pl-11")} placeholder="Search collections" />
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
            <MithoButton onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create collection
            </MithoButton>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="type-eyebrow text-brand-deep-green/68">All collections</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-dark-green">One place for lists you make, shape, and revisit.</h2>
              </div>
              <span className="text-sm text-muted-foreground">{collectionsQuery.data?.meta.total ?? collections.length} showing</span>
            </div>
            {collectionsQuery.isLoading ? (
              <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted p-6 text-sm text-muted-foreground">Loading collections...</div>
            ) : collections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} href={`/collections/${collection.id}`} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted p-6">
                <p className="text-base font-semibold text-brand-dark-green">{query ? "No collections match this search." : "Start your first collection here."}</p>
              </div>
            )}
          </div>
        </section>
        <CreateCollectionModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </div>
  )
}

function CollectionDetailBody({
  collection,
  isOwner,
  onToggleVisibility,
}: {
  collection: CollectionRecord
  isOwner: boolean
  onToggleVisibility?: (next: CollectionVisibility) => void
}) {
  return (
    <div className="space-y-6">
      <section className={sectionCardClass}>
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <Link href={isOwner ? "/collections" : `/users/${collection.owner.username}/collections/${collection.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange">
            <ArrowLeft className="h-4 w-4" />
            {isOwner ? "Back to collections" : `Back to @${collection.owner.username}'s collection`}
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <CollectionVisibilityBadge visibility={collection.visibility} />
          </div>
          <h1 className="type-page-title mt-4 text-brand-dark-green">{collection.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{collection.description ?? "No description yet."}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{getCollectionPlaceCount(collection)} places</span>
            <span>by @{collection.owner.username ?? "mithouser"}</span>
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
              <div className="flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-muted px-4 py-2">
                <div>
                  <p className="text-sm font-semibold text-brand-dark-green">Public</p>
                </div>
                <ToggleSwitch checked={collection.visibility === "public"} onCheckedChange={(checked) => onToggleVisibility?.(checked ? "public" : "private")} />
              </div>
              {collection.visibility === "public" && collection.owner.username ? (
                <MithoButton variant="ghost" asChild>
                  <Link href={`/users/${collection.owner.username}/collections/${collection.id}`}>
                    <Share2 className="h-4 w-4" />
                    View public version
                  </Link>
                </MithoButton>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      <section className={sectionCardClass}>
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <h2 className="text-2xl font-semibold text-brand-dark-green">Places in this collection</h2>
        </div>
        <div className="space-y-4 px-6 py-6 sm:px-8">
          {collection.items.length > 0 ? (
            collection.items.map((item) => <CollectionItemRow key={item.id} item={item} />)
          ) : (
            <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted p-6">
              <p className="text-base font-semibold text-brand-dark-green">No places here yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function CollectionDetailPage({ id }: { id: string }) {
  const query = useCollection(id)
  const updateMutation = useUpdateCollection(id)
  const collection = query.data
  if (query.isLoading) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Loading collection...</div>
  if (!collection) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Collection not found.</div>
  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <CollectionDetailBody
        collection={collection}
        isOwner
        onToggleVisibility={(visibility) =>
          updateMutation.mutate({
            title: collection.title,
            description: collection.description ?? "",
            visibility,
          })
        }
      />
    </div>
  )
}

export function PublicCollectionDetailPage({ username, id }: { username: string; id: string }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthSnapshot()
  const [isSignInOpen, setIsSignInOpen] = React.useState(false)
  const [pendingCopyAfterAuth, setPendingCopyAfterAuth] = React.useState(false)
  const copyMutation = useCopyCollection()
  const query = usePublicCollection(username, id)

  React.useEffect(() => {
    if (!isAuthenticated || !pendingCopyAfterAuth) return
    copyMutation.mutate(id, {
      onSuccess: (collection) => {
        setPendingCopyAfterAuth(false)
        router.push(`/collections/${collection.id}`)
      },
    })
  }, [copyMutation, id, isAuthenticated, pendingCopyAfterAuth, router])

  if (query.isLoading) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Loading collection...</div>
  if (!query.data) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Collection not available.</div>

  const collection = query.data
  const handleCopy = () => {
    if (!isAuthenticated) {
      setPendingCopyAfterAuth(true)
      setIsSignInOpen(true)
      return
    }
    copyMutation.mutate(id, {
      onSuccess: (copied) => {
        toast({ title: "Collection copied", description: `${collection.title} is now in your account.` })
        router.push(`/collections/${copied.id}`)
      },
    })
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="space-y-6">
          <section className={cn(sectionCardClass, "overflow-hidden bg-muted")}>
            <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div className="space-y-5">
                <Link href="/users" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange">
                  <ArrowLeft className="h-4 w-4" />
                  Explore more collections
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                  <CollectionVisibilityBadge visibility={collection.visibility} />
                  <span className="text-sm text-muted-foreground">{getCollectionPlaceCount(collection)} places</span>
                </div>
                <div>
                  <h1 className="type-page-title text-brand-dark-green">{collection.title}</h1>
                  {collection.description ? <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{collection.description}</p> : null}
                </div>
                <MithoButton onClick={handleCopy} disabled={copyMutation.isPending}>
                  <Copy className="h-4 w-4" />
                  {copyMutation.isPending ? "Copying..." : "Copy collection"}
                </MithoButton>
              </div>
              <div className="rounded-xl border border-brand-deep-green/10 bg-white/78 px-5 py-6 shadow-sm">
                <div className="mx-auto flex justify-center gap-2">
                  {getCollectionCoverImages(collection).slice(0, 3).map((image, index) => (
                    <img key={`${collection.id}-${index}`} src={image} alt="" className="h-24 w-24 rounded-lg object-cover" />
                  ))}
                </div>
              </div>
            </div>
          </section>
          {copyMutation.isSuccess ? (
            <section className="rounded-xl border border-success/18 bg-success/8 shadow-sm px-6 py-6 sm:px-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <p className="text-sm leading-7 text-muted-foreground">Collection copied to your account.</p>
              </div>
            </section>
          ) : null}
          <CollectionDetailBody collection={collection} isOwner={false} />
        </div>
      </div>
      <GoogleSignInDialog
        open={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        title="Sign in to copy this collection."
        description="Use Google so Mitho can save this collection under same account."
        helperCopy="After sign-in, Mitho will copy this collection and keep you here."
        onContinue={() => setIsSignInOpen(false)}
      />
    </>
  )
}

export function CollectionEditPage({ id }: { id: string }) {
  const router = useRouter()
  const query = useCollection(id)
  const updateMutation = useUpdateCollection(id)
  const deleteMutation = useDeleteCollection()
  const reorderMutation = useReorderCollectionItems(id)
  const deleteItemMutation = useDeleteCollectionItem(id)
  const [items, setItems] = React.useState<CollectionItemRecord[]>([])
  const [saved, setSaved] = React.useState(false)
  const originalItemsRef = React.useRef<CollectionItemRecord[]>([])

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  })

  React.useEffect(() => {
    if (!query.data) return
    form.reset({
      title: query.data.title,
      description: query.data.description ?? "",
      visibility: query.data.visibility,
    })
    setItems(query.data.items)
    originalItemsRef.current = query.data.items
  }, [form, query.data])

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

  const onSubmit = async (values: CollectionFormValues) => {
    await updateMutation.mutateAsync(values)
    await reorderMutation.mutateAsync({
      itemIds: items.map((item) => item.id),
    })
    const originalById = new Map(originalItemsRef.current.map((item) => [item.id, item]))
    await Promise.all(
      items
        .filter((item) => (originalById.get(item.id)?.note ?? "") !== (item.note ?? ""))
        .map((item) => updateCollectionItemRequest(id, item.id, { note: item.note ?? "" })),
    )
    setSaved(true)
  }

  if (query.isLoading) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Loading collection...</div>
  if (!query.data) return <div className="container mx-auto px-4 py-10 text-sm text-muted-foreground">Collection not found.</div>

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="space-y-6">
        <ProfileTabsPanel />
        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-brand-dark-green">Collection details</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Edit collection identity, then adjust items below before saving.</p>
              </div>
              {saved ? <span className="text-sm font-medium text-success">Changes saved.</span> : null}
            </div>
          </div>
          <div className="px-6 py-6 sm:px-8">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection title</FormLabel>
                      <FormControl><Input {...field} className={inputClassName} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="visibility" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className={selectTriggerClassName}><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {collectionVisibilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} className="min-h-28 rounded-lg border-brand-deep-green/12 bg-muted px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex flex-wrap gap-3">
                  <MithoButton type="submit" disabled={updateMutation.isPending || reorderMutation.isPending}>
                    Save collection
                  </MithoButton>
                  <MithoButton variant="outline-secondary" asChild>
                    <Link href={`/collections/${id}`}>View collection</Link>
                  </MithoButton>
                </div>
              </form>
            </Form>
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Collection items</h2>
          </div>
          <div className="space-y-4 px-6 py-6 sm:px-8">
            {items.map((item, index) => (
              <CollectionItemRow
                key={item.id}
                item={item}
                showMoveControls
                onMoveUp={() => moveItem(index, -1)}
                onMoveDown={() => moveItem(index, 1)}
                onRemove={async () => {
                  const next = await deleteItemMutation.mutateAsync(item.id)
                  setItems(next.items)
                }}
                onNoteChange={(value) => {
                  setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, note: value } : entry)))
                }}
              />
            ))}
          </div>
        </section>

        <section className={cn(sectionCardClass, "border-danger/18")}>
          <div className="border-b border-danger/12 px-6 py-6 sm:px-8">
            <h2 className="text-2xl font-semibold text-brand-dark-green">Danger zone</h2>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-8">
            <div>
              <p className="text-base font-semibold text-brand-dark-green">Delete this collection</p>
            </div>
            <MithoButton variant="outline-danger" onClick={async () => {
              await deleteMutation.mutateAsync(id)
              router.push("/collections")
            }}>
              <Trash2 className="h-4 w-4" />
              Delete collection
            </MithoButton>
          </div>
        </section>
      </div>
    </div>
  )
}
