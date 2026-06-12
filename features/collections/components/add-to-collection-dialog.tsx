"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Globe, Lock, Plus, Search } from "lucide-react"
import {
  collectionContainsBusiness,
  createCollectionId,
  getCollectionCoverImages,
  searchOwnedCollections,
} from "@/features/collections/utils/collection-helpers"
import { CollectionVisibilityBadge } from "@/features/collections/components/collection-visibility-badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { collectionVisibilityOptions, type CollectionFormValues } from "@/lib/validators/collection"
import type { CollectionCandidate, CollectionRecord } from "@/types/collections"
import { cn } from "@/lib/utils"

const initialCollectionCount = 3
const inputClassName =
  "h-11 rounded-lg border-brand-deep-green/12 bg-muted px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-11 w-full rounded-lg border-brand-deep-green/12 bg-muted px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

const quickCreateCollectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Collection title should be at least 2 characters.")
    .max(60, "Keep the title under 60 characters."),
  visibility: z.enum(["private", "public"]),
})

type QuickCreateCollectionValues = z.infer<typeof quickCreateCollectionSchema>

interface AddToCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: CollectionCandidate
  collections: CollectionRecord[]
  onAddToCollection: (collectionId: string) => void
  onCreateCollection: (values: CollectionFormValues) => void
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  candidate,
  collections,
  onAddToCollection,
  onCreateCollection,
}: AddToCollectionDialogProps) {
  const [query, setQuery] = React.useState("")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [showAllCollections, setShowAllCollections] = React.useState(false)
  const hasCollections = collections.length > 0

  const form = useForm<QuickCreateCollectionValues>({
    resolver: zodResolver(quickCreateCollectionSchema),
    defaultValues: {
      title: "",
      visibility: "private",
    },
  })

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setIsCreateOpen(false)
      setShowAllCollections(false)
      form.reset({
        title: "",
        visibility: "private",
      })
    }
  }, [form, open])

  React.useEffect(() => {
    if (open && !hasCollections) {
      setIsCreateOpen(true)
    }
  }, [hasCollections, open])

  const filteredCollections = React.useMemo(
    () => searchOwnedCollections(collections, query),
    [collections, query],
  )

  const visibleCollections =
    query.trim().length > 0 || showAllCollections
      ? filteredCollections
      : filteredCollections.slice(0, initialCollectionCount)

  const hiddenCollectionCount =
    query.trim().length > 0 || showAllCollections
      ? 0
      : Math.max(filteredCollections.length - initialCollectionCount, 0)

  const openCreateForm = () => {
    setIsCreateOpen(true)
    form.reset({
      title: query.trim()
        ? createCollectionId(query)
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "",
      visibility: "private",
    })
  }

  const handleCreate = (values: QuickCreateCollectionValues) => {
    onCreateCollection({
      ...values,
      description: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 top-auto translate-y-0 gap-0 rounded-t-xl rounded-b-none border-brand-deep-green/10 bg-white p-0 shadow-sm sm:bottom-auto sm:top-1/2 sm:max-w-[560px] sm:-translate-y-1/2 sm:rounded-xl sm:shadow-sm">
        <div className="flex justify-center px-6 pt-3 sm:hidden">
          <div className="h-1.5 w-14 rounded-full bg-brand-deep-green/20" />
        </div>

        <div className="border-b border-brand-deep-green/10 px-5 py-4 sm:px-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-brand-dark-green">Add to collection</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6 text-muted-foreground">
              Pick a collection or make a new one.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-5 py-4 sm:max-h-[640px] sm:px-6">
          <section className="flex items-center gap-3 border-b border-brand-deep-green/10 pb-4">
            <img
              src={candidate.imageUrl}
              alt={candidate.businessName}
              className="h-14 w-14 shrink-0 rounded-lg border border-brand-deep-green/10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-base font-semibold text-brand-dark-green">{candidate.businessName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{candidate.location}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <MithoBadge variant="neutral">{candidate.category}</MithoBadge>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-4">
            {hasCollections ? (
              <>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className={cn(inputClassName, "pl-11")}
                    placeholder="Search your collections"
                  />
                </div>

                <div className="space-y-2.5">
                  {visibleCollections.length > 0 ? (
                    visibleCollections.map((collection) => {
                      const alreadyAdded = collectionContainsBusiness(collection, candidate)
                      const coverImage = getCollectionCoverImages(collection)[0] ?? candidate.imageUrl

                      return (
                        <div
                          key={collection.id}
                          className="flex items-center gap-3 rounded-xl border border-brand-deep-green/10 bg-white px-3 py-3"
                        >
                          <img
                            src={coverImage}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-1 text-sm font-semibold text-brand-dark-green">{collection.title}</h4>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <CollectionVisibilityBadge visibility={collection.visibility} />
                              {alreadyAdded ? <MithoBadge variant="muted">Already added</MithoBadge> : null}
                            </div>
                          </div>

                          <MithoButton
                            variant={alreadyAdded ? "ghost" : "outline-secondary"}
                            size="icon"
                            onClick={() => onAddToCollection(collection.id)}
                            disabled={alreadyAdded}
                            className="h-10 w-10 rounded-full"
                            aria-label={
                              alreadyAdded
                                ? `${candidate.businessName} is already in ${collection.title}`
                                : `Add ${candidate.businessName} to ${collection.title}`
                            }
                          >
                            {alreadyAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </MithoButton>
                        </div>
                      )
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted px-4 py-4">
                      <p className="text-sm font-semibold text-brand-dark-green">No matching collections yet.</p>
                    </div>
                  )}

                  {hiddenCollectionCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowAllCollections(true)}
                      className="flex w-full items-center gap-3 rounded-xl border border-dashed border-brand-deep-green/18 bg-muted px-3 py-3 text-left transition-colors hover:border-brand-deep-green/28 hover:bg-accent"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-brand-deep-green/12 bg-white text-brand-deep-green">
                        <Plus className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-brand-dark-green">More collections</p>
                        <p className="text-sm text-muted-foreground">Show {hiddenCollectionCount} more</p>
                      </div>
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-brand-deep-green/18 bg-muted px-4 py-4">
                <p className="text-sm font-semibold text-brand-dark-green">Start your first collection here.</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Create a collection first, then this place will land there immediately.
                </p>
              </div>
            )}
          </section>

          <section className="mt-4 border-t border-brand-deep-green/10 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-brand-dark-green">{hasCollections ? "Collections" : "Create your first collection"}</p>
              {!isCreateOpen && hasCollections ? (
                <MithoButton variant="ghost" size="sm" onClick={openCreateForm}>
                  <Plus className="h-4 w-4" />
                  New collection
                </MithoButton>
              ) : null}
            </div>

            {isCreateOpen ? (
              <div className="mt-4 rounded-xl border border-brand-deep-green/10 bg-muted p-4">
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(handleCreate)}>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-wrap justify-end gap-3">
                      <MithoButton type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </MithoButton>
                      <MithoButton type="submit" size="sm">
                        Create
                      </MithoButton>
                    </div>
                  </form>
                </Form>
              </div>
            ) : null}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
