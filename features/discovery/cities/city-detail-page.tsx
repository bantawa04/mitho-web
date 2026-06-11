"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { ArrowRight, ArrowUpRight, Filter, Search } from "lucide-react"
import { CATEGORY_OPTIONS, getCategoryBySlug, getCategoryIcon } from "@/content/taxonomy/category-taxonomy"
import type { CitySlug } from "@/content/taxonomy/city-taxonomy"
import { CITY_METADATA, getCityBySlug } from "@/content/taxonomy/city-taxonomy"
import { EXPLORE_RESULTS, EXPLORE_SORT_OPTIONS } from "@/features/discovery/explore/explore-data"
import { ExploreResultCard } from "@/features/discovery/explore/explore-result-card"
import type { ExploreResult } from "@/features/discovery/explore/explore-types"
import {
  buildCitySearchString,
  type CityPageFilters,
  normalizeCityPageFilters,
  rankExploreResults,
} from "@/features/discovery/utils/discovery-search-utils"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { ClosedBadge, MithoBadge, OpenNowBadge } from "@/components/mitho/mitho-badge"
import { MithoBreadcrumb } from "@/components/mitho/mitho-breadcrumb"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoInput } from "@/components/mitho/mitho-input"
import { MithoPagination } from "@/components/mitho/mitho-pagination"
import { StarRating } from "@/components/mitho/mitho-rating"
import {
  MithoSelect,
  MithoSelectContent,
  MithoSelectItem,
  MithoSelectTrigger,
  MithoSelectValue,
} from "@/components/mitho/mitho-select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface CityDetailPageProps {
  slug: CitySlug
}

const RESULTS_PER_PAGE = 6

function selectFeaturedCityPicks(results: ExploreResult[]) {
  const ranked = rankExploreResults(results.filter((result) => result.featured), "recommended", {
    preferFeatured: true,
  })
  const picks: ExploreResult[] = []
  const usedCategories = new Set<string>()

  for (const result of ranked) {
    if (!usedCategories.has(result.category) || picks.length >= 2) {
      picks.push(result)
      usedCategories.add(result.category)
    }
    if (picks.length === 4) break
  }

  if (picks.length < 3) {
    for (const result of rankExploreResults(results, "recommended", { preferFeatured: true })) {
      if (picks.some((item) => item.id === result.id)) continue
      picks.push(result)
      if (picks.length === 4) break
    }
  }

  return picks
}

function FeaturedCityPickCard({ result }: { result: ExploreResult }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_24px_rgba(10,70,53,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,70,53,0.08)]">
      <div className="relative aspect-[16/10]">
        <Image src={result.imageUrl} alt={result.name} fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {result.openNow ? <OpenNowBadge /> : <ClosedBadge />}
          <MithoBadge variant="muted">{result.neighborhood ?? result.location}</MithoBadge>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-tight text-brand-dark-green">{result.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.cityEditorialTakeaway ?? result.editorialTakeaway ?? result.whyGo}</p>

        <div className="mt-4 rounded-[1.25rem] bg-surface-soft px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">What locals start with</p>
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

export function CityDetailPage({ slug }: CityDetailPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = React.useMemo(() => normalizeCityPageFilters(searchParams), [searchParams])
  const [queryDraft, setQueryDraft] = React.useState(filters.q)
  const [currentPage, setCurrentPage] = React.useState(1)

  const city = getCityBySlug(slug)

  React.useEffect(() => {
    setQueryDraft(filters.q)
  }, [filters.q])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters.q, filters.category, filters.sort])

  const applyFilters = React.useCallback(
    (patch: Partial<CityPageFilters>) => {
      const nextFilters = { ...filters, ...patch }
      const search = buildCitySearchString(nextFilters)
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
    },
    [filters, pathname, router],
  )

  if (!city) return null

  const cityResults = React.useMemo(() => EXPLORE_RESULTS.filter((result) => result.city === city.label), [city.label])

  const featuredCandidates = React.useMemo(() => selectFeaturedCityPicks(cityResults), [cityResults])

  const filteredResults = React.useMemo(() => {
    const query = filters.q.toLowerCase()

    const nextResults = cityResults.filter((result) => {
      if (filters.category !== "all" && result.category !== filters.category) return false
      if (!query) return true

      const haystacks = [
        result.name,
        result.cuisine,
        result.location,
        result.neighborhood ?? "",
        result.standoutDish,
        result.trustNote,
        result.whyGo,
        result.bestFor ?? "",
        result.editorialTakeaway ?? "",
        result.cityEditorialTakeaway ?? "",
      ]

      return haystacks.some((value) => value.toLowerCase().includes(query))
    })

    return rankExploreResults(nextResults, filters.sort, { preferFeatured: true })
  }, [cityResults, filters.category, filters.q, filters.sort])

  const paginatedResults = React.useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
    return filteredResults.slice(startIndex, startIndex + RESULTS_PER_PAGE)
  }, [currentPage, filteredResults])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / RESULTS_PER_PAGE))
  const hasActiveFilters =
    Boolean(filters.q) || filters.category !== "all" || filters.sort !== "recommended"

  const relatedCities = city.relatedCitySlugs
    .map((relatedSlug) => CITY_METADATA.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const featuredCategories = city.featuredCategorySlugs
    .map((categorySlug) => getCategoryBySlug(categorySlug))
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
          <MithoBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Cities" }, { label: city.label }]} />

          <section className="mt-5 overflow-hidden rounded-[2rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_360px]">
              <div className="p-5 md:p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft-beige px-4 py-2 text-sm font-semibold text-brand-dark-green">
                  {city.label}
                </div>

                <p className="mt-5 type-eyebrow text-brand-deep-green/70">City food guide</p>
                <h1 className="type-page-title mt-3 max-w-3xl text-brand-dark-green">{city.heroTitle}</h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{city.heroDescription}</p>

                <div className="mt-5 rounded-[1.4rem] border border-brand-deep-green/10 bg-surface-soft px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">How people usually use this city</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">{city.editorialNote}</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                  <MithoInput
                    type="search"
                    value={queryDraft}
                    onChange={(event) => setQueryDraft(event.target.value)}
                    placeholder={`Search within ${city.label}...`}
                    className="h-12 rounded-full pl-4"
                    aria-label={`Search within ${city.label}`}
                  />

                  <MithoSelect value={filters.category} onValueChange={(value) => applyFilters({ category: value })}>
                    <MithoSelectTrigger className="h-12 rounded-full">
                      <MithoSelectValue placeholder="Category" />
                    </MithoSelectTrigger>
                    <MithoSelectContent>
                      <MithoSelectItem value="all">All categories</MithoSelectItem>
                      {CATEGORY_OPTIONS.map((option) => (
                        <MithoSelectItem key={option.value} value={option.value}>
                          {option.label}
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
                  {city.quickFilters.map((term) => (
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
                  src={city.accentImage}
                  alt={city.label}
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,70,53,0.04),rgba(10,70,53,0.44))]" />
                <div className="absolute inset-x-5 bottom-5 rounded-[1.4rem] bg-white/92 px-5 py-4 shadow-[0_10px_24px_rgba(10,70,53,0.12)] backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Useful in this city</p>
                  <p className="mt-2 text-base font-semibold leading-7 text-brand-dark-green">
                    {cityResults.length > 0
                      ? `${cityResults.length} current places help sketch a useful food picture for ${city.label}.`
                      : `${city.label} is still early in the guide, so the shortlist stays intentionally selective for now.`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[1.7rem] border border-brand-deep-green/10 bg-white px-5 py-4 shadow-[0_8px_22px_rgba(10,70,53,0.04)]">
            <div className="grid gap-3 md:grid-cols-3">
              {city.trustCues.map((cue) => (
                <div key={cue} className="rounded-[1.2rem] bg-[#fff8eb] px-4 py-4">
                  <p className="text-sm font-semibold leading-6 text-brand-dark-green">{cue}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(10,70,53,0.04)]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div>
                <p className="type-eyebrow text-brand-deep-green/70">Start here</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  The easiest ways into {city.label}'s food scene.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Start by neighborhood if you already know the area, or jump by category if the craving is clearer than the route.
                </p>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Neighborhood shortcuts</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {city.featuredNeighborhoods.map((neighborhood) => (
                      <button
                        key={neighborhood}
                        type="button"
                        onClick={() => {
                          setQueryDraft(neighborhood)
                          applyFilters({ q: neighborhood })
                        }}
                        className="inline-flex items-center rounded-full border border-brand-deep-green/12 bg-white px-4 py-2 text-sm font-medium text-brand-dark-green transition-colors hover:border-brand-orange/30 hover:bg-brand-soft-beige/55"
                      >
                        {neighborhood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep-green/58">Category paths</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {featuredCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}?city=${encodeURIComponent(city.label)}`}
                      className="group rounded-[1.35rem] border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-4 transition-colors hover:border-brand-orange/28 hover:bg-[#fff7ea]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green transition-colors group-hover:bg-brand-deep-green group-hover:text-white">
                        {getCategoryIcon(category.iconKey, "h-5 w-5")}
                      </div>
                      <p className="mt-4 text-base font-semibold text-brand-dark-green">{category.label}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.heroDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="type-eyebrow text-brand-deep-green/70">Featured city picks</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  A few places that help explain {city.label} quickly.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  These picks give you a faster read on what this city is good at before you scan the full list.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              {featuredCandidates.map((result) => (
                <FeaturedCityPickCard key={`${result.id}-featured-city`} result={result} />
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-brand-deep-green/10 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(10,70,53,0.05)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="type-eyebrow text-brand-deep-green/70">Browse the full city shortlist</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">{city.label} listings</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{city.seoIntro}</p>
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
                      <SheetTitle>Refine this city</SheetTitle>
                      <SheetDescription>Adjust category and ranking without leaving this city guide.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 px-4 pb-2">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-brand-dark-green">Category</p>
                        <MithoSelect value={filters.category} onValueChange={(value) => applyFilters({ category: value })}>
                          <MithoSelectTrigger>
                            <MithoSelectValue placeholder="Category" />
                          </MithoSelectTrigger>
                          <MithoSelectContent>
                            <MithoSelectItem value="all">All categories</MithoSelectItem>
                            {CATEGORY_OPTIONS.map((option) => (
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
              <MithoSelect value={filters.category} onValueChange={(value) => applyFilters({ category: value })}>
                <MithoSelectTrigger className="h-11 w-[190px] rounded-full bg-white">
                  <MithoSelectValue placeholder="Category" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  <MithoSelectItem value="all">All categories</MithoSelectItem>
                  {CATEGORY_OPTIONS.map((option) => (
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
                  {filteredResults.length} {filteredResults.length === 1 ? "place" : "places"} in {city.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filters.q
                    ? `Showing ${city.label} picks related to “${filters.q}”.`
                    : `Ranked to surface the places people in ${city.label} would mention early, not just the most generic city results.`}
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
                  Nothing in {city.label} feels like a confident recommendation with these refinements yet.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  Try broadening the query, switching category, or opening the broader search page if you want a less city-specific shortlist.
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
                <p className="type-eyebrow text-brand-deep-green/70">Explore nearby cities</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-dark-green">
                  Keep the discovery mood, change the city.
                </h2>
              </div>
              <MithoButton variant="outline-secondary" asChild>
                <Link href="/explore">
                  View broader search
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MithoButton>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {relatedCities.map((relatedCity) => (
                <Link
                  key={relatedCity.slug}
                  href={`/cities/${relatedCity.slug}`}
                  className="group rounded-[1.45rem] border border-brand-deep-green/10 bg-[#fffdf8] px-5 py-5 transition-colors hover:border-brand-orange/28 hover:bg-[#fff7ea]"
                >
                  <h3 className="text-xl font-semibold text-brand-dark-green">{relatedCity.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedCity.heroDescription}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-green transition-colors group-hover:text-brand-orange">
                    Open city guide
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
