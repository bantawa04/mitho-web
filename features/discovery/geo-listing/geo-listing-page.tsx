"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, Loader2, Search, X } from "lucide-react"
import { Header } from "@/features/home/components/header"
import { Footer } from "@/features/home/components/footer"
import { BusinessSearchResultCard } from "@/features/discovery/explore/business-search-result-card"
import { ALL_OPTION_VALUE, LIVE_SORT_OPTIONS } from "@/features/discovery/explore/explore-live-data"
import type { LiveExploreState } from "@/features/discovery/explore/explore-types"
import {
  applyLiveExploreChange,
  buildGeoListingSearchString,
  liveExploreStateToSearchParams,
  parseGeoListingState,
  type LockedGeo,
} from "@/features/discovery/utils/discovery-search-utils"
import { useBusinessSearch } from "@/hooks/use-businesses"
import { useCuisines } from "@/hooks/use-cuisines"
import { useEstablishmentTypes } from "@/hooks/use-establishment-types"
import { useDistricts, useMunicipalities } from "@/hooks/use-nepal-admin"
import type { GeographyResolution } from "@/types/nepal-admin"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const DEBOUNCE_MS = 300

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 px-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-deep-green/60">
      {children}
    </p>
  )
}

function ResultsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
            <Skeleton className="aspect-[4/3] rounded-none md:aspect-auto md:h-full" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface GeoListingPageProps {
  geoContext: GeographyResolution
}

export function GeoListingPage({ geoContext }: GeoListingPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const locked: LockedGeo = React.useMemo(
    () => ({
      province: geoContext.province.id,
      district: geoContext.district?.id,
      municipality: geoContext.municipality?.id,
    }),
    [geoContext.province.id, geoContext.district?.id, geoContext.municipality?.id],
  )

  const state = React.useMemo(
    () => parseGeoListingState(searchParams, locked),
    // locked is stable across re-renders for the same geoContext
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, locked.province, locked.district, locked.municipality],
  )

  const [queryDraft, setQueryDraft] = React.useState(state.q)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setQueryDraft(state.q)
  }, [state.q])

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const establishmentTypesQuery = useEstablishmentTypes()
  const cuisinesQuery = useCuisines()
  const districtsQuery = useDistricts(locked.district === undefined ? geoContext.province.id : null)
  const municipalitiesQuery = useMunicipalities(
    locked.municipality === undefined
      ? (state.district ?? geoContext.district?.id ?? null)
      : null,
  )

  const activeEstablishmentTypes = React.useMemo(
    () => (establishmentTypesQuery.data ?? []).filter((type) => type.status === "active"),
    [establishmentTypesQuery.data],
  )
  const activeCuisines = React.useMemo(
    () => (cuisinesQuery.data ?? []).filter((cuisine) => cuisine.status === "active"),
    [cuisinesQuery.data],
  )

  const apiParams = React.useMemo(() => liveExploreStateToSearchParams(state), [state])
  const searchQuery = useBusinessSearch(apiParams)
  const items = searchQuery.data?.items ?? []
  const meta = searchQuery.data?.meta
  const totalPages = Math.max(1, meta?.totalPages ?? 1)

  const isInitialLoading = searchQuery.isLoading && !searchQuery.data
  const isRefetching = searchQuery.isFetching && !isInitialLoading
  const isError = searchQuery.isError

  const pushState = React.useCallback(
    (next: LiveExploreState, mode: "replace" | "push") => {
      const search = buildGeoListingSearchString(next, locked)
      const url = search ? `${pathname}?${search}` : pathname
      if (mode === "push") {
        router.push(url, { scroll: false })
      } else {
        router.replace(url, { scroll: false })
      }
    },
    [pathname, router, locked],
  )

  const applyFilter = React.useCallback(
    (patch: Partial<LiveExploreState>) => {
      pushState(applyLiveExploreChange(state, patch), "replace")
    },
    [pushState, state],
  )

  const handlePageChange = React.useCallback(
    (page: number) => {
      pushState(applyLiveExploreChange(state, { page }), "push")
    },
    [pushState, state],
  )

  const commitQuery = React.useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (trimmed === state.q) return
      applyFilter({ q: trimmed })
    },
    [applyFilter, state.q],
  )

  const handleQueryChange = (value: string) => {
    setQueryDraft(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => commitQuery(value), DEBOUNCE_MS)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    commitQuery(queryDraft)
  }

  const hasActiveFilters =
    Boolean(state.q) ||
    Boolean(state.type) ||
    Boolean(state.cuisine) ||
    (locked.district === undefined && state.district !== null) ||
    (locked.municipality === undefined && state.municipality !== null) ||
    state.sort !== "recommended"

  const clearFilters = () => {
    setQueryDraft("")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    router.replace(pathname, { scroll: false })
  }

  const selectValue = (value: string) => (value ? value : ALL_OPTION_VALUE)
  const fromAllValue = (value: string) => (value === ALL_OPTION_VALUE ? "" : value)

  const geoLabel = geoContext.municipality?.name ?? geoContext.district?.name ?? geoContext.province.name

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(geoContext.district
      ? [{ label: geoContext.province.name, href: `/${geoContext.province.slug}` }]
      : [{ label: geoContext.province.name }]),
    ...(geoContext.municipality && geoContext.district
      ? [
          {
            label: geoContext.district.name,
            href: `/${geoContext.province.slug}/${geoContext.district.slug}`,
          },
          { label: geoContext.municipality.name },
        ]
      : geoContext.district
        ? [{ label: geoContext.district.name }]
        : []),
  ]

  const renderFiltersContent = () => (
    <div className="space-y-6 rounded-xl border border-border bg-white px-5 py-6 shadow-sm">
      <div>
        <FilterLabel>Type</FilterLabel>
        <Select
          value={selectValue(state.type)}
          onValueChange={(value) => applyFilter({ type: fromAllValue(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION_VALUE}>All types</SelectItem>
            {activeEstablishmentTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FilterLabel>Cuisine</FilterLabel>
        <Select
          value={selectValue(state.cuisine)}
          onValueChange={(value) => applyFilter({ cuisine: fromAllValue(value) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_OPTION_VALUE}>All cuisines</SelectItem>
            {activeCuisines.map((cuisine) => (
              <SelectItem key={cuisine.id} value={cuisine.id}>
                {cuisine.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {locked.district === undefined && (
        <div>
          <FilterLabel>District</FilterLabel>
          <Select
            value={state.district !== null ? String(state.district) : ALL_OPTION_VALUE}
            onValueChange={(value) =>
              applyFilter({ district: value === ALL_OPTION_VALUE ? null : Number(value) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OPTION_VALUE}>All districts</SelectItem>
              {(districtsQuery.data ?? []).map((district) => (
                <SelectItem key={district.id} value={String(district.id)}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {locked.municipality === undefined && (
        <div>
          <FilterLabel>Municipality</FilterLabel>
          <Select
            value={state.municipality !== null ? String(state.municipality) : ALL_OPTION_VALUE}
            onValueChange={(value) =>
              applyFilter({ municipality: value === ALL_OPTION_VALUE ? null : Number(value) })
            }
            disabled={state.district === null}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={state.district === null ? "Select a district first" : "All municipalities"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_OPTION_VALUE}>All municipalities</SelectItem>
              {(municipalitiesQuery.data ?? []).map((municipality) => (
                <SelectItem key={municipality.id} value={String(municipality.id)}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <FilterLabel>Sort by</FilterLabel>
        <Select
          value={state.sort}
          onValueChange={(value) => applyFilter({ sort: value as LiveExploreState["sort"] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIVE_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="pt-1">
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

  const renderResults = () => {
    if (isInitialLoading) {
      return <ResultsSkeleton />
    }

    if (isError) {
      return (
        <div className="rounded-xl border border-border bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-brand-dark-green">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t load search results. Please try again.
          </p>
          <div className="mt-6 flex justify-center">
            <MithoButton onClick={() => searchQuery.refetch()}>Retry</MithoButton>
          </div>
        </div>
      )
    }

    if (items.length === 0) {
      return hasActiveFilters ? (
        <div className="rounded-xl border border-border bg-white px-6 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-brand-dark-green">
            No places match. Try fewer filters.
          </h2>
          <div className="mt-6 flex justify-center">
            <MithoButton variant="outline-secondary" onClick={clearFilters}>
              Clear filters
            </MithoButton>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-brand-dark-green">
            No businesses listed in {geoLabel} yet
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            New spots are added all the time — check back soon.
          </p>
        </div>
      )
    }

    return (
      <>
        <div className={isRefetching ? "space-y-5 opacity-60 transition-opacity" : "space-y-5"}>
          {items.map((business) => (
            <BusinessSearchResultCard key={business.id} business={business} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pt-4">
            <MithoPagination
              currentPage={meta?.page ?? state.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="pb-20">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <MithoBreadcrumb items={breadcrumbItems} />

          <div className="mt-8 flex flex-col items-center text-center">
            <h1 className="type-page-title text-brand-dark-green">
              Food &amp; dining in {geoLabel}
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Discover restaurants, cafes, and local food spots in {geoLabel}.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 w-full max-w-2xl relative flex items-center group">
              <label htmlFor="geo-listing-search" className="sr-only">
                Search businesses in {geoLabel}
              </label>
              <div className="absolute left-6 text-brand-deep-green/50">
                <Search className="h-5 w-5" />
              </div>
              <input
                id="geo-listing-search"
                type="text"
                placeholder={`Search restaurants, cuisines in ${geoLabel}...`}
                value={queryDraft}
                onChange={(event) => handleQueryChange(event.target.value)}
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
                <SheetContent
                  side="bottom"
                  className="max-h-[85vh] overflow-y-auto rounded-t-xl border-border bg-background"
                >
                  <SheetHeader className="text-left">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search results.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 pb-6">{renderFiltersContent()}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <section className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">{renderFiltersContent()}</div>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {state.q && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs">
                    Search: {state.q}
                    <button
                      type="button"
                      onClick={() => {
                        setQueryDraft("")
                        applyFilter({ q: "" })
                      }}
                      aria-label="Clear search filter"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {isRefetching && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                    role="status"
                    aria-live="polite"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Updating results…
                  </span>
                )}
              </div>

              {renderResults()}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
