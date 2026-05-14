"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowRight, Bookmark, Check, Copy, Globe, Lock, Plus, Search } from "lucide-react"
import {
  collectionContainsBusiness,
  createCollectionId,
  searchOwnedCollections,
  type CollectionCandidate,
  type CollectionRecord,
} from "@/components/collections/collection-data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MithoBadge } from "@/components/ui/mitho-badge"
import { MithoButton } from "@/components/ui/mitho-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { collectionSchema, collectionVisibilityOptions, type CollectionFormValues } from "@/lib/validators/collection"
import { cn } from "@/lib/utils"

const inputClassName =
  "h-12 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
const selectTriggerClassName =
  "h-12 w-full rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 text-sm shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"

interface AddToCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: CollectionCandidate
  collections: CollectionRecord[]
  onAddToCollection: (collectionId: string) => void
  onCreateCollection: (values: CollectionFormValues) => void
}

function VisibilityBadge({ visibility }: { visibility: CollectionRecord["visibility"] }) {
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

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  })

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setIsCreateOpen(false)
      form.reset({
        title: "",
        description: "",
        visibility: "private",
      })
    }
  }, [form, open])

  const filteredCollections = React.useMemo(
    () => searchOwnedCollections(collections, query),
    [collections, query],
  )

  const openCreateForm = () => {
    setIsCreateOpen(true)
    form.reset({
      title: query.trim() ? createCollectionId(query).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") : "",
      description: "",
      visibility: "private",
    })
  }

  const handleCreate = (values: CollectionFormValues) => {
    onCreateCollection(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] rounded-[1.75rem] border-brand-deep-green/10 bg-white p-0 shadow-[0_24px_60px_rgba(10,70,53,0.16)] sm:max-w-[720px]">
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-8">
          <DialogHeader className="text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-brand-dark-green">
              <Bookmark className="h-4 w-4 text-brand-deep-green" />
              Add to collection
            </div>
            <DialogTitle className="mt-5 text-2xl font-semibold text-brand-dark-green">
              Save this place into the right collection.
            </DialogTitle>
            <DialogDescription className="mt-3 text-base leading-7 text-muted-foreground">
              Pick an existing collection or create a new one without leaving the business page.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <section className="rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] p-5">
            <div className="flex gap-4">
              <img
                src={candidate.imageUrl}
                alt={candidate.businessName}
                className="h-20 w-20 rounded-[1rem] border border-brand-deep-green/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <MithoBadge variant="neutral">{candidate.category}</MithoBadge>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-brand-dark-green">{candidate.businessName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{candidate.location}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{candidate.note}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className={cn(inputClassName, "pl-11")}
                placeholder="Search your collections"
              />
            </div>

            <div className="space-y-3">
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => {
                  const alreadyAdded = collectionContainsBusiness(collection, candidate)

                  return (
                    <div
                      key={collection.id}
                      className="flex flex-col gap-4 rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <VisibilityBadge visibility={collection.visibility} />
                          {collection.isDefault ? <MithoBadge variant="success">Default</MithoBadge> : null}
                          {collection.provenance ? (
                            <MithoBadge variant="outline-orange" className="gap-1">
                              <Copy className="h-3.5 w-3.5" />
                              Copied
                            </MithoBadge>
                          ) : null}
                        </div>
                        <h4 className="mt-3 text-base font-semibold text-brand-dark-green">{collection.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {collection.items.length} places
                          {collection.description ? ` · ${collection.description}` : ""}
                        </p>
                      </div>

                      <MithoButton
                        variant={alreadyAdded ? "ghost" : "outline-secondary"}
                        onClick={() => onAddToCollection(collection.id)}
                        disabled={alreadyAdded}
                      >
                        {alreadyAdded ? (
                          <>
                            <Check className="h-4 w-4" />
                            Already added
                          </>
                        ) : (
                          <>
                            Add here
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </MithoButton>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-[1.35rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-5">
                  <p className="text-base font-semibold text-brand-dark-green">No matching collections yet.</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Create a new collection here if the right one does not exist yet.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.35rem] border border-brand-deep-green/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-brand-dark-green">Need a new collection?</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Create it here, then this place will be added immediately.
                </p>
              </div>
              {!isCreateOpen ? (
                <MithoButton variant="ghost" onClick={openCreateForm}>
                  <Plus className="h-4 w-4" />
                  Create collection
                </MithoButton>
              ) : null}
            </div>

            {isCreateOpen ? (
              <div className="mt-5 border-t border-brand-deep-green/10 pt-5">
                <Form {...form}>
                  <form className="space-y-5" onSubmit={form.handleSubmit(handleCreate)}>
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
                            <Textarea
                              {...field}
                              className="min-h-24 rounded-[1rem] border-brand-deep-green/12 bg-[#fffdf8] px-4 py-3 shadow-none focus-visible:border-brand-orange focus-visible:ring-brand-orange/15"
                              placeholder="A short note about why these places belong together."
                            />
                          </FormControl>
                          <FormDescription>Optional, but helpful if the list later goes public or gets copied.</FormDescription>
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

                    <div className="flex flex-wrap justify-end gap-3">
                      <MithoButton type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </MithoButton>
                      <MithoButton type="submit">
                        Create and add
                        <ArrowRight className="h-4 w-4" />
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
