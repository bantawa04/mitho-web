import type { BusinessSearchSort } from "@/types/business"
import type { LiveExploreSortOption } from "@/features/discovery/explore/explore-types"

export const LIVE_SORT_DEFAULT: BusinessSearchSort = "recommended"

/**
 * Sort options for the live (database-backed) explore page.
 * NOTE: "Nearest" is intentionally excluded — the live page has no user coords.
 * The static category/city pages keep their own EXPLORE_SORT_OPTIONS (with "nearest").
 */
export const LIVE_SORT_OPTIONS: LiveExploreSortOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "top_rated", label: "Top rated" },
  { value: "most_reviewed", label: "Most reviewed" },
]

export const LIVE_SORT_VALUES: readonly BusinessSearchSort[] = LIVE_SORT_OPTIONS.map((option) => option.value)

/** Default results-per-page for the live search (matches API default). */
export const LIVE_RESULTS_PER_PAGE = 6

/** Sentinel value used by single-select dropdowns to represent "no filter". */
export const ALL_OPTION_VALUE = "all"
