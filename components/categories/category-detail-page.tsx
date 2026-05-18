"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { ArrowRight, ArrowUpRight, Filter, Search } from "lucide-react"
import type { CategorySlug } from "@/components/categories/category-taxonomy"
import { CATEGORY_METADATA, getCategoryBySlug, getCategoryIcon } from "@/components/categories/category-taxonomy"
import { EXPLORE_CITY_OPTIONS, EXPLORE_PRICE_OPTIONS, EXPLORE_RESULTS, EXPLORE_SORT_OPTIONS } from "@/components/explore/explore-data"
import { ExploreResultCard } from "@/components/explore/explore-result-card"
import type { ExploreResult } from "@/components/explore/explore-types"
import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { ClosedBadge, OpenNowBadge } from "@/components/ui/mitho-badge"
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
import { StarRating } from "@/components/ui/mitho-rating"

interface CategoryDetailPageProps {
  slug: CategorySlug
}

interface CategoryPageFilters {
  q: string
  city: string
  sort: string
  price: string
}

const RESULTS_PER_PAGE = 6

function normalizeFilters(params: ReadonlyURLSearchParams): CategoryPageFilters {
  const city = params.get("city")
  const sort = params.get("sort")
  const price = params.get("price")

  return {
    q: params.get("q")?.trim() ?? "",
    city: city && EXPLORE_CITY_OPTIONS.includes(city) ? city : "Kathmandu",
    sort: sort && EXPLORE_SORT_OPTIONS.some((option) => option.value === sort) ? sort : "recommended",
    price: price && EXPLORE_PRICE_OPTIONS.some((option) => option.value === price) ? price : "any",
  }
}

function buildSearchString(filters: CategoryPageFilters) {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.city && filters.city !== "Kathmandu") params.set("city", filters.city)
  if (filters.sort !== "recommended") params.set("sort", filters.sort)
  if (filters.price !== "any") params.set("price", filters.price)

  return params.toString()
}

function rankResults(results: ExploreResult[], sort: string) {
  if (sort === "top-rated") {
    return [...results].sort((a, b) => b.rating - a.rating)
  }

  if (sort === "most-reviewed") {
    return [...results].sort((a, b) => b.reviewCount - a.reviewCount)
  }

  if (sort === "nearest") {
    return [...results].sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER))
  }

  return [...results].sort((a, b) => {
    const featuredBoost = Number(b.featured) - Number(a.featured)
    if (featuredBoost !== 0) return featuredBoost

    const openBoost = Number(b.openNow) - Number(a.openNow)
    if (openBoost !== 0) return openBoost

    const scoreA = a.rating * 10 + Math.min(a.reviewCount / 25, 10)
    const scoreB = b.rating * 10 + Math.min(b.reviewCount / 25, 10)
    return scoreB - scoreA
  })
}

function FeaturedCategoryPickCard({ result }: { result: ExploreResult }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,70,53,0.08)]">
      <div className="relative aspect-[16/10]">
        <Image src={result.imageUrl} alt={result.name} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {result.openNow ? <OpenNowBadge /> : <ClosedBadge />}
          <span className="rounded-full bg-brand-soft-beige px-3 py-1 text-xs font-semibold text-brand-dark-green">
            {result.location}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-tight text-brand-dark-green">{result.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.editorialTakeaway ?? result.whyGo}</p>

        <div className="mt-4 rounded-[1.25rem] bg-surface-soft px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Start with</p>
          <p className="mt-2 text-lg font-semibold text-brand-dark-green">{result.standoutDish}</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{result.bestFor ?? result.trustNote}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StarRating rating={result.rating} size="sm" />
            <span className="text-sm font-semibold text-brand-dark-green">{result.rating.toFixed(1)}</span>
          </div>

          <Link
            href={`/business/${result.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors hover:text-brand-orange"
          >
            View place
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function CategoryDetailPage({ slug }: CategoryDetailPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = React.useMemo(() => normalizeFilters(searchParams), [searchParams])
  const [queryDraft, setQueryDraft] = React.useState(filters.q)
  const [currentPage, setCurrentPage] = React.useState(1)

  const category = getCategoryBySlug(slug)

  React.useEffect(() => {
    setQueryDraft(filters.q)
  }, [filters.q])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters.q, filters.city, filters.sort, filters.price])

  const applyFilters = React.useCallback(
    (patch: Partial<CategoryPageFilters>) => {
      const nextFilters = { ...filters, ...patch }
      const search = buildSearchString(nextFilters)
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
    },
    [filters, pathname, router],
  )

  const categoryResults = React.useMemo(() => EXPLORE_RESULTS.filter((result) => result.category === slug), [slug])

  const cityScopedResults = React.useMemo(
    () => categoryResults.filter((result) => result.city === filters.city),
    [categoryResults, filters.city],
  )

  const featuredCandidates = React.useMemo(() => {
    const sourceResults = cityScopedResults.length > 0 ? cityScopedResults : categoryResults
    const explicitlyFeatured = sourceResults.filter((result) => result.featured)
    return rankResults(explicitlyFeatured.length > 0 ? explicitlyFeatured : sourceResults, "recommended").slice(0, 3)
  }, [categoryResults, cityScopedResults])

  const filteredResults = React.useMemo(() => {
    const query = filters.q.toLowerCase()

    const nextResults = categoryResults.filter((result) => {
      if (result.city !== filters.city) return false
      if (filters.price !== "any" && result.priceRange !== filters.price) return false
      if (!query) return true

      const haystacks = [
        result.name,
        result.cuisine,
        result.location,
        result.standoutDish,
        result.trustNote,
        result.whyGo,
        result.bestFor ?? "",
        result.editorialTakeaway ?? "",
      ]

      return haystacks.some((value) => value.toLowerCase().includes(query))
    })

    return rankResults(nextResults, filters.sort)
  }, [categoryResults, filters.city, filters.price, filters.q, filters.sort])

  const paginatedResults = React.useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE)
  }, [currentPage, filteredResults])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE))
  const hasActiveFilters =
    Boolean(filters.q) || filters.city !== "Kathmandu" || filters.sort !== "recommended" || filters.price !== "any"

  if (!category) return null

  const relatedCategories = category.relatedSlugs
    .map((relatedSlug) => getCategoryBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const clearFilters = () => {
    setQueryDraft("")
    router.replace(pathname, { scroll: false })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    applyFilters({ q: queryDraft.trim() })
  }

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/#categories" }, { label: category.label }]} />

          <section className="mt-5 overflow-hidden rounded-[2rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_360px]">
              <div className="p-5 md:p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft-beige px-4 py-2 text-sm font-semibold text-brand-dark-green">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-deep-green">
                    {getCategoryIcon(category.iconKey, "h-5 w-5")}
                  </span>
                  {category.label}
                </div>

                <p className="mt-5 type-eyebrow text-brand-deep-green/70">Category guide</p>
                <h1 className="type-page-title mt-3 max-w-3xl text-brand-dark-green">{category.heroTitle}</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{category.heroDescription}</p>

                <div className="mt-5 rounded-[1.4rem] border border-brand-deep-green/10 bg-surface-soft px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Local read on this category</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">{category.editorialNote}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                  <MithoInput
                    type="search"
                    value={queryDraft}
                    onChange={(event) => setQueryDraft(event.target.value)}
                    placeholder={`Search within ${category.shortLabel.toLowerCase()}...`}
                    className="h-12 rounded-full pl-4"
                    aria-label={`Search within ${category.label}`}
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

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.quickFilters.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQueryDraft(term)
                        applyFilters({ q: term })
                      }}
                      className="inline-flex items-center rounded-full border border-brand-deep-green/12 bg-white px-4 py-2 text-sm font-medium text-brand-dark-green transition-colors hover:border-brand-orange/30 hover:bg-brand-soft-beige/55"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[280px] border-t border-brand-deep-green/10 bg-[#f6efde] lg:min-h-full lg:border-l lg:border-t-0">
                <Image
                  src={category.accentImage}
                  alt={category.label}
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,70,53,0.04),rgba(10,70,53,0.44))]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.4rem] bg-white/92 px-5 py-4 shadow-[0_10px_24px_rgba(10,70,53,0.12)] backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Useful in {filters.city}</p>
                  <p className="mt-2 text-base font-semibold leading-7 text-brand-dark-green">
                    {cityScopedResults.length > 0
                      ? `${cityScopedResults.length} places currently fit this category in ${filters.city}.`
                      : `This category has fewer current picks in ${filters.city}, so the guide stays focused and selective.`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-brand-deep-green/10 bg-white px-5 py-4 shadow-[0_8px_22px_rgba(10,70,53,0.04)]">
            <div className="grid gap-3 md:grid-cols-3">
              {category.trustCues.map((cue) => (
                <div key={cue} className="rounded-[1.2rem] bg-[#fff8eb] px-4 py-4">
                  <p className="text-sm font-semibold leading-6 text-brand-dark-green">{cue}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="type-eyebrow text-brand-deep-green/70">Featured picks</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  A few places locals would bring up early in this category.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  These are the faster reads before you scan the full list, chosen for dish clarity, neighborhood usefulness, and trust notes that actually help.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {featuredCandidates.map((result) => (
                <FeaturedCategoryPickCard key={`${result.id}-featured`} result={result} />
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="type-eyebrow text-brand-deep-green/70">Browse the full shortlist</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  {category.label} in {filters.city}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{category.seoIntro}</p>
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <MithoButton variant="outline-secondary" className="h-11">
                      <Filter className="h-4 w-4" />
                      Filters
                    </MithoButton>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-[1.75rem] border-brand-deep-green/10 bg-[#fffdf8]">
                    <SheetHeader>
                      <SheetTitle>Refine this category</SheetTitle>
                      <SheetDescription>Adjust city, price, and ranking without leaving this category guide.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 px-4 pb-2">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-brand-dark-green">City</p>
                        <MithoSelect value={filters.city} onValueChange={(value) => applyFilters({ city: value })}>
                          <MithoSelectTrigger>
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
                        Reset refinements
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
            </div>

            <div className="mt-5 hidden items-center gap-3 lg:flex">
              <MithoSelect value={filters.city} onValueChange={(value) => applyFilters({ city: value })}>
                <MithoSelectTrigger className="h-11 w-[190px] rounded-full bg-white">
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

            <div className="mt-5 flex flex-col gap-3 rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-dark-green">
                  {filteredResults.length} {filteredResults.length === 1 ? "place" : "places"} in {filters.city}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filters.q
                    ? `Showing ${category.shortLabel.toLowerCase()} picks related to “${filters.q}”.`
                    : `Ranked to surface the ${category.shortLabel.toLowerCase()} places locals would mention first.`}
                </p>
              </div>
              {hasActiveFilters ? (
                <MithoButton variant="outline-secondary" size="sm" onClick={clearFilters}>
                  Reset refinements
                </MithoButton>
              ) : null}
            </div>

            {filteredResults.length === 0 ? (
              <div className="mt-5 rounded-[1.6rem] border border-brand-deep-green/10 bg-white px-6 py-8 shadow-[0_10px_24px_rgba(10,70,53,0.04)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-deep-green/60">No strong match yet</p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  Nothing in this category feels like a confident recommendation yet.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  Try broadening the search, switching city, or opening the wider search page to scan a bigger set of local options.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <MithoButton onClick={clearFilters}>Clear refinements</MithoButton>
                  <MithoButton variant="outline-secondary" asChild>
                    <Link href="/explore">Open broader search</Link>
                  </MithoButton>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  {paginatedResults.map((result) => (
                    <ExploreResultCard key={result.id} result={result} />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-6">
                    <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                ) : null}
              </>
            )}
          </section>

          <section className="mt-6 rounded-[1.75rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(10,70,53,0.04)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="type-eyebrow text-brand-deep-green/70">Related categories</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  Keep the food mood, change the angle.
                </h2>
              </div>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/explore">
                  View all categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {relatedCategories.map((relatedCategory) => (
                <Link
                  key={relatedCategory.slug}
                  href={`/categories/${relatedCategory.slug}`}
                  className="group rounded-[1.45rem] border border-brand-deep-green/10 bg-[#fffdf8] px-5 py-5 transition-colors hover:border-brand-orange/28 hover:bg-[#fff7ea]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green transition-colors group-hover:bg-brand-deep-green group-hover:text-white">
                    {getCategoryIcon(relatedCategory.iconKey, "h-5 w-5")}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-brand-dark-green">{relatedCategory.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedCategory.heroDescription}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors group-hover:text-brand-orange">
                    Open guide
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
