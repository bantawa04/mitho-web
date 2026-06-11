import type { ReadonlyURLSearchParams } from "next/navigation"
import { CATEGORY_OPTIONS } from "@/content/taxonomy/category-taxonomy"
import { EXPLORE_CATEGORY_OPTIONS, EXPLORE_CITY_OPTIONS, EXPLORE_SORT_OPTIONS } from "@/features/discovery/explore/explore-data"
import type { ExploreFilters, ExploreResult } from "@/features/discovery/explore/explore-types"

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
