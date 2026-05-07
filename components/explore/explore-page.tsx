"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, Flame, Search, Store } from "lucide-react"
import { Header } from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_CITY_OPTIONS, EXPLORE_PRICE_OPTIONS, EXPLORE_RESULTS, EXPLORE_SORT_OPTIONS } from "@/components/explore/explore-data"
import { ExploreResultCard } from "@/components/explore/explore-result-card"
import type { ExploreFilters } from "@/components/explore/explore-types"
import { MithoBreadcrumb } from "@/components/ui/mitho-breadcrumb"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoInput } from "@/components/ui/mitho-input"
import { MithoPagination } from "@/components/ui/mitho-pagination"
import {
  MithoSelect,
  MithoSelectContent,
  MithoSelectItem,
  MithoSelectTrigger,
  MithoSelectValue,
} from "@/components/ui/mitho-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const RESULTS_PER_PAGE = 6

function normalizeFilters(params: ReadonlyURLSearchParams): ExploreFilters {
  const city = params.get("city")
  const category = params.get("category")
  const sort = params.get("sort")
  const price = params.get("price")

  return {
    q: params.get("q")?.trim() ?? "",
    city: city && EXPLORE_CITY_OPTIONS.includes(city) ? city : "Kathmandu",
    category:
      category && EXPLORE_CATEGORY_OPTIONS.some((option) => option.value === category) ? category : "all",
    sort: sort && EXPLORE_SORT_OPTIONS.some((option) => option.value === sort) ? sort : "recommended",
    openNow: params.get("openNow") === "true",
    price: price && EXPLORE_PRICE_OPTIONS.some((option) => option.value === price) ? price : "any",
  }
}

function buildSearchString(filters: ExploreFilters) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.city && filters.city !== "Kathmandu") params.set("city", filters.city)
  if (filters.category !== "all") params.set("category", filters.category)
  if (filters.sort !== "recommended") params.set("sort", filters.sort)
  if (filters.openNow) params.set("openNow", "true")
  if (filters.price !== "any") params.set("price", filters.price)

  return params.toString()
}

function ExploreFilterButton({
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
      className={
        active
          ? "inline-flex items-center justify-center rounded-full border-2 border-brand-orange bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors"
          : "inline-flex items-center justify-center rounded-full border-2 border-brand-deep-green/12 bg-white px-4 py-2 text-sm font-semibold text-brand-dark-green transition-colors hover:border-brand-orange/30 hover:bg-brand-soft-beige/55"
      }
    >
      {children}
    </button>
  )
}

export function ExplorePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = React.useMemo(() => normalizeFilters(searchParams), [searchParams])
  const [queryDraft, setQueryDraft] = React.useState(filters.q)
  const [currentPage, setCurrentPage] = React.useState(1)

  React.useEffect(() => {
    setQueryDraft(filters.q)
  }, [filters.q])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters.q, filters.city, filters.category, filters.sort, filters.openNow, filters.price])

  const applyFilters = React.useCallback(
    (patch: Partial<ExploreFilters>) => {
      const nextFilters: ExploreFilters = { ...filters, ...patch }
      const search = buildSearchString(nextFilters)
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
      if (filters.price !== "any" && result.priceRange !== filters.price) return false
      if (!query) return true

      const haystacks = [result.name, result.cuisine, result.location, result.standoutDish, result.trustNote, result.whyGo]
      return haystacks.some((value) => value.toLowerCase().includes(query))
    })

    if (filters.sort === "top-rated") {
      return nextResults.sort((a, b) => b.rating - a.rating)
    }

    if (filters.sort === "most-reviewed") {
      return nextResults.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    if (filters.sort === "nearest") {
      return nextResults.sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER))
    }

    return nextResults.sort((a, b) => {
      const openBoost = Number(b.openNow) - Number(a.openNow)
      if (openBoost !== 0) return openBoost
      const scoreA = a.rating * 10 + Math.min(a.reviewCount / 25, 10)
      const scoreB = b.rating * 10 + Math.min(b.reviewCount / 25, 10)
      return scoreB - scoreA
    })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE))
  const paginatedResults = React.useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE)
  }, [currentPage, filteredResults])

  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.category !== "all" ||
    filters.openNow ||
    filters.price !== "any" ||
    filters.sort !== "recommended" ||
    filters.city !== "Kathmandu"

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    applyFilters({ q: queryDraft.trim() })
  }

  const clearFilters = () => {
    setQueryDraft("")
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf5e8_34%,#fffdf9_100%)] pb-16">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />

          <section className="mt-5 rounded-[2rem] border border-brand-deep-green/10 bg-white/78 p-5 shadow-[0_10px_28px_rgba(10,70,53,0.05)] backdrop-blur-sm md:p-6">
            <div className="max-w-3xl">
              <p className="type-eyebrow text-brand-deep-green/68">Search results</p>
              <h1 className="type-page-title mt-3 text-brand-dark-green">Find something worth heading out for tonight.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Search by dish, neighborhood, or mood and scan places through local trust signals instead of generic
                directory clutter.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
              <MithoInput
                type="search"
                value={queryDraft}
                onChange={(event) => setQueryDraft(event.target.value)}
                placeholder="Buff momo, thakali, quiet cafe, hidden spot..."
                className="h-12 rounded-full pl-4"
                aria-label="Search for dishes, neighborhoods, or businesses"
              />

              <MithoSelect value={filters.city} onValueChange={(value) => applyFilters({ city: value })}>
                <MithoSelectTrigger className="h-12 rounded-full">
                  <MithoSelectValue placeholder="Choose a city" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  {EXPLORE_CITY_OPTIONS.map((city) => (
                    <MithoSelectItem key={city} value={city}>
                      {city}
                    </MithoSelectItem>
                  ))}
                </MithoSelectContent>
              </MithoSelect>

              <MithoButton type="submit" size="lg" className="h-12 px-7">
                <Search className="h-5 w-5" />
                Search
              </MithoButton>
            </form>

            <div className="mt-5 hidden items-center gap-3 lg:flex">
              <MithoSelect value={filters.category} onValueChange={(value) => applyFilters({ category: value })}>
                <MithoSelectTrigger className="h-11 w-[190px] rounded-full bg-white">
                  <MithoSelectValue placeholder="Category" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  {EXPLORE_CATEGORY_OPTIONS.map((option) => (
                    <MithoSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MithoSelectItem>
                  ))}
                </MithoSelectContent>
              </MithoSelect>

              <MithoSelect value={filters.price} onValueChange={(value) => applyFilters({ price: value })}>
                <MithoSelectTrigger className="h-11 w-[170px] rounded-full bg-white">
                  <MithoSelectValue placeholder="Price" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  {EXPLORE_PRICE_OPTIONS.map((option) => (
                    <MithoSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MithoSelectItem>
                  ))}
                </MithoSelectContent>
              </MithoSelect>

              <MithoSelect value={filters.sort} onValueChange={(value) => applyFilters({ sort: value })}>
                <MithoSelectTrigger className="h-11 w-[190px] rounded-full bg-white">
                  <MithoSelectValue placeholder="Sort" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  {EXPLORE_SORT_OPTIONS.map((option) => (
                    <MithoSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MithoSelectItem>
                  ))}
                </MithoSelectContent>
              </MithoSelect>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <MithoButton variant="outline-secondary" className="h-11">
                    <Filter className="h-4 w-4" />
                    Filters
                  </MithoButton>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-[1.75rem] border-brand-deep-green/10 bg-[#fffdf8]">
                  <SheetHeader>
                    <SheetTitle>Refine results</SheetTitle>
                    <SheetDescription>Filter by category, open-now status, price, and sort order.</SheetDescription>
                  </SheetHeader>

                  <div className="space-y-4 px-4 pb-2">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-dark-green">Open status</p>
                      <ExploreFilterButton active={filters.openNow} onClick={() => applyFilters({ openNow: !filters.openNow })}>
                        Open now
                      </ExploreFilterButton>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-dark-green">Category</p>
                      <MithoSelect value={filters.category} onValueChange={(value) => applyFilters({ category: value })}>
                        <MithoSelectTrigger>
                          <MithoSelectValue placeholder="Category" />
                        </MithoSelectTrigger>
                        <MithoSelectContent>
                          {EXPLORE_CATEGORY_OPTIONS.map((option) => (
                            <MithoSelectItem key={option.value} value={option.value}>
                              {option.label}
                            </MithoSelectItem>
                          ))}
                        </MithoSelectContent>
                      </MithoSelect>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-dark-green">Price</p>
                      <MithoSelect value={filters.price} onValueChange={(value) => applyFilters({ price: value })}>
                        <MithoSelectTrigger>
                          <MithoSelectValue placeholder="Price" />
                        </MithoSelectTrigger>
                        <MithoSelectContent>
                          {EXPLORE_PRICE_OPTIONS.map((option) => (
                            <MithoSelectItem key={option.value} value={option.value}>
                              {option.label}
                            </MithoSelectItem>
                          ))}
                        </MithoSelectContent>
                      </MithoSelect>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-brand-dark-green">Sort</p>
                      <MithoSelect value={filters.sort} onValueChange={(value) => applyFilters({ sort: value })}>
                        <MithoSelectTrigger>
                          <MithoSelectValue placeholder="Sort" />
                        </MithoSelectTrigger>
                        <MithoSelectContent>
                          {EXPLORE_SORT_OPTIONS.map((option) => (
                            <MithoSelectItem key={option.value} value={option.value}>
                              {option.label}
                            </MithoSelectItem>
                          ))}
                        </MithoSelectContent>
                      </MithoSelect>
                    </div>
                  </div>

                  <SheetFooter>
                    <MithoButton variant="outline-secondary" onClick={clearFilters}>
                      Clear filters
                    </MithoButton>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <MithoSelect value={filters.sort} onValueChange={(value) => applyFilters({ sort: value })}>
                <MithoSelectTrigger className="h-11 w-[190px] rounded-full bg-white">
                  <MithoSelectValue placeholder="Sort" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  {EXPLORE_SORT_OPTIONS.map((option) => (
                    <MithoSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MithoSelectItem>
                  ))}
                </MithoSelectContent>
              </MithoSelect>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
            <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-[1.4rem] border border-brand-deep-green/10 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(10,70,53,0.04)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-dark-green">
                    {filteredResults.length} {filteredResults.length === 1 ? "place" : "places"} found
                    <span className="text-muted-foreground"> in {filters.city}</span>
                  </p>
                  {filters.q ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Showing local picks related to “{filters.q}”.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search results are ranked to surface the places locals would actually recommend first.
                    </p>
                  )}
                </div>
                {hasActiveFilters ? (
                  <MithoButton variant="outline-secondary" size="sm" onClick={clearFilters}>
                    Clear filters
                  </MithoButton>
                ) : null}
              </div>

              {filteredResults.length === 0 ? (
                <div className="rounded-[1.8rem] border border-brand-deep-green/10 bg-white px-6 py-8 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-deep-green/60">No strong match yet</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                    Nothing here feels worth sending you to just yet.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    Try broadening the dish, switching the city, or clearing one filter so we can show a more useful local shortlist.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <MithoButton onClick={clearFilters}>Clear all filters</MithoButton>
                    <MithoButton variant="outline-secondary" asChild>
                      <Link href="/">Back to home</Link>
                    </MithoButton>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedResults.map((result) => (
                      <ExploreResultCard key={result.id} result={result} />
                    ))}
                  </div>

                  {totalPages > 1 && <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
                </>
              )}
            </div>

            <aside className="hidden space-y-5 xl:block">
              <div className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(10,70,53,0.05)]">
                <div className="flex items-center gap-2 text-brand-dark-green">
                  <Flame className="h-5 w-5 text-brand-orange" />
                  <p className="font-semibold">How locals use this page</p>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>Start with the dish you are craving, not just the business name.</li>
                  <li>Scan the trust note first. It usually tells you more than the score.</li>
                  <li>Use price and open-now only after you have a shortlist worth comparing.</li>
                </ul>
              </div>

              <div className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(10,70,53,0.05)]">
                <div className="flex items-center gap-2 text-brand-dark-green">
                  <Store className="h-5 w-5 text-brand-orange" />
                  <p className="font-semibold">Own a good local spot?</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Claim your listing and make it easier for people to trust the dish, the hours, and the visit before they arrive.
                </p>
                <MithoButton variant="outline-secondary" className="mt-4 w-full" asChild>
                  <Link href="/#for-business">For restaurant owners</Link>
                </MithoButton>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
