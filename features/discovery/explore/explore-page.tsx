"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, Search, X } from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_CITY_OPTIONS, EXPLORE_RESULTS, EXPLORE_SORT_OPTIONS } from "@/features/discovery/explore/explore-data"
import { ExploreResultCard } from "@/features/discovery/explore/explore-result-card"
import type { ExploreFilters } from "@/features/discovery/explore/explore-types"
import {
  buildExploreSearchString,
  normalizeExplorePageFilters,
  rankExploreResults,
} from "@/features/discovery/utils/discovery-search-utils"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const RESULTS_PER_PAGE = 6

function RadioOption({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
        active ? "bg-brand-soft-beige/50 font-semibold text-brand-dark-green" : "font-medium text-muted-foreground hover:bg-surface-soft hover:text-foreground",
      )}
    >
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border border-brand-deep-green/30 transition-colors",
          active && "border-primary bg-white",
        )}
      >
        {active && <div className="h-2 w-2 rounded-full bg-primary" />}
      </div>
      {children}
    </button>
  )
}

function CheckboxOption({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
        active ? "bg-brand-soft-beige/50 font-semibold text-brand-dark-green" : "font-medium text-muted-foreground hover:bg-surface-soft hover:text-foreground",
      )}
    >
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-[4px] border border-brand-deep-green/30 transition-colors",
          active && "border-primary bg-primary text-white",
        )}
      >
        {active && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {children}
    </button>
  )
}

export function ExplorePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = React.useMemo(() => normalizeExplorePageFilters(searchParams), [searchParams])
  const [queryDraft, setQueryDraft] = React.useState(filters.q)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setQueryDraft(filters.q)
  }, [filters.q])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters.q, filters.city, filters.category, filters.sort, filters.openNow])

  const applyFilters = React.useCallback(
    (patch: Partial<ExploreFilters>) => {
      const nextFilters: ExploreFilters = { ...filters, ...patch }
      const search = buildExploreSearchString(nextFilters)
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
    },
    [filters, pathname, router],
  )

  const filteredResults = React.useMemo(() => {
    const query = filters.q.toLowerCase()

    const nextResults = EXPLORE_RESULTS.filter((result) => {
      if (result.city !== filters.city) return false
      if (filters.category !== "all" && result.category !== filters.category) return false
      if (filters.openNow && !result.openNow) return false
      if (!query) return true

      const haystacks = [result.name, result.cuisine, result.location, result.standoutDish, result.trustNote, result.whyGo]
      return haystacks.some((value) => value.toLowerCase().includes(query))
    })

    return rankExploreResults(nextResults, filters.sort, { preferOpenNow: true })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE))
  const paginatedResults = React.useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE)
  }, [currentPage, filteredResults])

  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.category !== "all" ||
    filters.sort !== "recommended"

  const categoryLabel =
    EXPLORE_CATEGORY_OPTIONS.find((option) => option.value === filters.category)?.label ?? filters.category

  const hasVisibleFilterChips = Boolean(filters.q) || filters.category !== "all" || filters.openNow

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    applyFilters({ q: queryDraft.trim() })
  }

  const clearFilters = () => {
    setQueryDraft("")
    router.replace(pathname, { scroll: false })
  }

  const renderFiltersContent = () => (
    <div className="space-y-6 rounded-xl border border-border bg-white px-5 py-6 shadow-sm">
      <div>
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-deep-green/60">Category</p>
        <div className="space-y-0.5">
          {EXPLORE_CATEGORY_OPTIONS.map((option) => (
            <RadioOption
              key={option.value}
              active={filters.category === option.value}
              onClick={() => applyFilters({ category: option.value })}
            >
              {option.label}
            </RadioOption>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-deep-green/60">Sort by</p>
        <div className="space-y-0.5">
          {EXPLORE_SORT_OPTIONS.map((option) => (
            <RadioOption
              key={option.value}
              active={filters.sort === option.value}
              onClick={() => applyFilters({ sort: option.value })}
            >
              {option.label}
            </RadioOption>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-2">
          <button
            onClick={clearFilters}
            className="min-h-11 w-full rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-[#b45a00] transition-colors hover:bg-brand-soft-beige/50"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="pb-20">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />

          <div className="mt-8 flex flex-col items-center text-center">
            <h1 className="type-page-title text-brand-dark-green">Explore local spots</h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Search by name, neighborhood, or what you&apos;re craving.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl relative flex items-center group">
              <div className="absolute left-6 text-brand-deep-green/50">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants, cafes, dishes..."
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
                className="h-[64px] w-full rounded-full border border-border bg-white pl-14 pr-[76px] text-base text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              <MithoButton
                type="submit"
                className="absolute right-2 h-[48px] w-[48px] p-0 rounded-full flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </MithoButton>
            </form>

            <div className="mt-5 flex lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <MithoButton variant="outline-secondary" className="h-11 rounded-full px-6">
                    <Filter className="h-4 w-4" />
                    Filters
                  </MithoButton>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl border-border bg-background">
                  <SheetHeader className="text-left">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 pb-6">
                    {renderFiltersContent()}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <section className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                {renderFiltersContent()}
              </div>
            </aside>

            <div className="space-y-6">
              {hasVisibleFilterChips && (
                <div className="flex flex-wrap items-center gap-2">
                  {filters.q && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs">
                      Search: {filters.q}
                      <button
                        type="button"
                        onClick={() => applyFilters({ q: "" })}
                        aria-label="Clear search filter"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.category !== "all" && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs">
                      {categoryLabel}
                      <button
                        type="button"
                        onClick={() => applyFilters({ category: "all" })}
                        aria-label="Clear category filter"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters.openNow && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs">
                      Open now
                      <button
                        type="button"
                        onClick={() => applyFilters({ openNow: false })}
                        aria-label="Clear open now filter"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {filteredResults.length === 0 ? (
                <div className="rounded-xl border border-border bg-white px-6 py-10 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-brand-dark-green">
                    No places match yet. Try a wider area or fewer filters.
                  </h2>
                  <div className="mt-6 flex justify-center">
                    <MithoButton variant="outline-secondary" onClick={clearFilters}>
                      Clear filters
                    </MithoButton>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {paginatedResults.map((result) => (
                      <ExploreResultCard key={result.id} result={result} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pt-4">
                      <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
