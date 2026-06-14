import type { ReadonlyURLSearchParams } from "next/navigation"
import { CATEGORY_OPTIONS } from "@/content/taxonomy/category-taxonomy"
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_CITY_OPTIONS, EXPLORE_SORT_OPTIONS } from "@/features/discovery/explore/explore-data"
import { LIVE_RESULTS_PER_PAGE, LIVE_SORT_DEFAULT, LIVE_SORT_VALUES } from "@/features/discovery/explore/explore-live-data"
import type { ExploreFilters, ExploreResult, LiveExploreState } from "@/features/discovery/explore/explore-types"
import type { BusinessSearchSort, SearchBusinessesParams } from "@/types/business"

export interface CategoryPageFilters {
  q: string
  city: string
  sort: string
}

export interface CityPageFilters {
  q: string
  category: string
  sort: string
}

function readTrimmedQuery(params: ReadonlyURLSearchParams) {
  return params.get("q")?.trim() ?? ""
}

function readAllowedValue(
  params: ReadonlyURLSearchParams,
  key: string,
  allowed: readonly string[],
  fallback: string,
) {
  const value = params.get(key)
  return value && allowed.includes(value) ? value : fallback
}

function readAllowedOptionValue(
  params: ReadonlyURLSearchParams,
  key: string,
  allowed: Array<{ value: string }>,
  fallback: string,
) {
  const value = params.get(key)
  return value && allowed.some((option) => option.value === value) ? value : fallback
}

function buildSearchString<T extends object>(
  filters: T,
  defaults: Partial<Record<Extract<keyof T, string>, string | boolean>>,
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters) as Array<[Extract<keyof T, string>, string | boolean]>) {
    const defaultValue = defaults[key]
    if (typeof value === "boolean") {
      if (value && value !== defaultValue) params.set(key, "true")
      continue
    }

    if (value && value !== defaultValue) {
      params.set(key, value)
    }
  }

  return params.toString()
}

export function normalizeCategoryPageFilters(params: ReadonlyURLSearchParams): CategoryPageFilters {
  return {
    q: readTrimmedQuery(params),
    city: readAllowedValue(params, "city", EXPLORE_CITY_OPTIONS, "Kathmandu"),
    sort: readAllowedOptionValue(params, "sort", EXPLORE_SORT_OPTIONS, "recommended"),
  }
}

export function buildCategorySearchString(filters: CategoryPageFilters) {
  return buildSearchString(filters, {
    city: "Kathmandu",
    sort: "recommended",
  })
}

export function normalizeCityPageFilters(params: ReadonlyURLSearchParams): CityPageFilters {
  return {
    q: readTrimmedQuery(params),
    category: readAllowedOptionValue(params, "category", CATEGORY_OPTIONS, "all"),
    sort: readAllowedOptionValue(params, "sort", EXPLORE_SORT_OPTIONS, "recommended"),
  }
}

export function buildCitySearchString(filters: CityPageFilters) {
  return buildSearchString(filters, {
    category: "all",
    sort: "recommended",
  })
}

export function normalizeExplorePageFilters(params: ReadonlyURLSearchParams): ExploreFilters {
  return {
    q: readTrimmedQuery(params),
    city: readAllowedValue(params, "city", EXPLORE_CITY_OPTIONS, "Kathmandu"),
    category: readAllowedOptionValue(params, "category", EXPLORE_CATEGORY_OPTIONS, "all"),
    sort: readAllowedOptionValue(params, "sort", EXPLORE_SORT_OPTIONS, "recommended"),
    openNow: params.get("openNow") === "true",
  }
}

export function buildExploreSearchString(filters: ExploreFilters) {
  return buildSearchString(filters, {
    city: "Kathmandu",
    category: "all",
    sort: "recommended",
    openNow: false,
  })
}

export function rankExploreResults(
  results: ExploreResult[],
  sort: string,
  options?: {
    preferFeatured?: boolean
    preferOpenNow?: boolean
  },
) {
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
    if (options?.preferFeatured) {
      const featuredBoost = Number(b.featured) - Number(a.featured)
      if (featuredBoost !== 0) return featuredBoost
    }

    if (options?.preferOpenNow) {
      const openBoost = Number(b.openNow) - Number(a.openNow)
      if (openBoost !== 0) return openBoost
    }

    const scoreA = a.rating * 10 + Math.min(a.reviewCount / 25, 10)
    const scoreB = b.rating * 10 + Math.min(b.reviewCount / 25, 10)
    return scoreB - scoreA
  })
}

/* -------------------------------------------------------------------------- */
/* Live (database-backed) explore page URL <-> state layer                     */
/* -------------------------------------------------------------------------- */

export const LIVE_EXPLORE_DEFAULT_STATE: LiveExploreState = {
  q: "",
  type: "",
  cuisine: "",
  province: null,
  district: null,
  municipality: null,
  sort: LIVE_SORT_DEFAULT,
  page: 1,
}

function readLiveSort(params: ReadonlyURLSearchParams): BusinessSearchSort {
  const value = params.get("sort")
  // Discard prototype-only sorts (e.g. "nearest") and normalize anything
  // unknown back to the default.
  return value && (LIVE_SORT_VALUES as readonly string[]).includes(value)
    ? (value as BusinessSearchSort)
    : LIVE_SORT_DEFAULT
}

function readLivePage(params: ReadonlyURLSearchParams): number {
  const raw = params.get("page")
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  return parsed
}

function readPositiveInt(params: ReadonlyURLSearchParams, key: string): number | null {
  const raw = params.get(key)
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

/**
 * Parse URL search params into canonical live-explore state.
 * Invalid params normalize to defaults. Cascading dependencies are enforced
 * (a district without a province is dropped; a municipality without a district
 * is dropped) so that hand-edited / stale URLs can never produce impossible
 * combinations.
 */
export function parseLiveExploreState(params: ReadonlyURLSearchParams): LiveExploreState {
  const province = readPositiveInt(params, "province")
  let district = readPositiveInt(params, "district")
  let municipality = readPositiveInt(params, "municipality")

  if (province === null) district = null
  if (district === null) municipality = null

  return {
    q: readTrimmedQuery(params),
    type: params.get("type")?.trim() ?? "",
    cuisine: params.get("cuisine")?.trim() ?? "",
    province,
    district,
    municipality,
    sort: readLiveSort(params),
    page: readLivePage(params),
  }
}

/**
 * Serialize canonical state to a query string, OMITTING every default
 * (empty q, no filters, sort=recommended, page=1) so URLs stay clean and
 * deep links remain stable.
 */
export function buildLiveExploreSearchString(state: LiveExploreState): string {
  const params = new URLSearchParams()

  if (state.q) params.set("q", state.q)
  if (state.type) params.set("type", state.type)
  if (state.cuisine) params.set("cuisine", state.cuisine)
  if (state.province !== null) params.set("province", String(state.province))
  if (state.district !== null) params.set("district", String(state.district))
  if (state.municipality !== null) params.set("municipality", String(state.municipality))
  if (state.sort !== LIVE_SORT_DEFAULT) params.set("sort", state.sort)
  if (state.page > 1) params.set("page", String(state.page))

  return params.toString()
}

/**
 * Apply a partial change to the live-explore state with the correct
 * cascading + page-reset semantics:
 *  - Changing province clears district + municipality.
 *  - Changing district clears municipality.
 *  - Any change OTHER than a pure pagination change resets page to 1.
 */
export function applyLiveExploreChange(
  current: LiveExploreState,
  patch: Partial<LiveExploreState>,
): LiveExploreState {
  const next: LiveExploreState = { ...current, ...patch }

  if (patch.province !== undefined && patch.province !== current.province) {
    next.district = null
    next.municipality = null
  }

  if (patch.district !== undefined && patch.district !== current.district) {
    next.municipality = null
  }

  // A change is "pagination only" when the sole provided key is `page`.
  const keys = Object.keys(patch)
  const isPaginationOnly = keys.length === 1 && keys[0] === "page"
  if (!isPaginationOnly && patch.page === undefined) {
    next.page = 1
  }

  return next
}

/* -------------------------------------------------------------------------- */
/* Geo listing page URL <-> state layer                                        */
/* -------------------------------------------------------------------------- */

export interface LockedGeo {
  province: number
  district?: number
  municipality?: number
}

/**
 * Parse URL search params for a geo listing page. The locked geo IDs (from the
 * route) always override any matching URL params. Non-locked geo levels (e.g.
 * district on a province page) still read from the URL.
 */
export function parseGeoListingState(
  params: ReadonlyURLSearchParams,
  locked: LockedGeo,
): LiveExploreState {
  let district: number | null
  if (locked.district !== undefined) {
    district = locked.district
  } else {
    district = readPositiveInt(params, "district")
  }

  let municipality: number | null
  if (locked.municipality !== undefined) {
    municipality = locked.municipality
  } else if (district === null) {
    municipality = null
  } else {
    municipality = readPositiveInt(params, "municipality")
  }

  return {
    q: readTrimmedQuery(params),
    type: params.get("type")?.trim() ?? "",
    cuisine: params.get("cuisine")?.trim() ?? "",
    province: locked.province,
    district,
    municipality,
    sort: readLiveSort(params),
    page: readLivePage(params),
  }
}

/**
 * Serialize geo listing state to a query string, omitting locked geo levels
 * (those come from the route URL, not query params) and all defaults.
 */
export function buildGeoListingSearchString(state: LiveExploreState, locked: LockedGeo): string {
  const params = new URLSearchParams()
  if (state.q) params.set("q", state.q)
  if (state.type) params.set("type", state.type)
  if (state.cuisine) params.set("cuisine", state.cuisine)
  if (locked.district === undefined && state.district !== null) params.set("district", String(state.district))
  if (locked.municipality === undefined && state.municipality !== null) params.set("municipality", String(state.municipality))
  if (state.sort !== LIVE_SORT_DEFAULT) params.set("sort", state.sort)
  if (state.page > 1) params.set("page", String(state.page))
  return params.toString()
}

/** Map canonical live-explore state to the snake_case-aware API params. */
export function liveExploreStateToSearchParams(state: LiveExploreState): SearchBusinessesParams {
  return {
    q: state.q || undefined,
    establishmentTypeId: state.type || undefined,
    cuisineId: state.cuisine || undefined,
    provinceId: state.province ?? undefined,
    districtId: state.district ?? undefined,
    municipalityId: state.municipality ?? undefined,
    sort: state.sort,
    page: state.page,
    perPage: LIVE_RESULTS_PER_PAGE,
  }
}
