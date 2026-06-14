import { test, expect, describe } from "bun:test"
import {
  LIVE_EXPLORE_DEFAULT_STATE,
  applyLiveExploreChange,
  buildLiveExploreSearchString,
  liveExploreStateToSearchParams,
  parseLiveExploreState,
} from "@/features/discovery/utils/discovery-search-utils"
import type { LiveExploreState } from "@/features/discovery/explore/explore-types"

// `parseLiveExploreState` only consumes the `get` method of URLSearchParams,
// which is structurally compatible with ReadonlyURLSearchParams for our needs.
function makeParams(init?: Record<string, string>) {
  return new URLSearchParams(init) as unknown as Parameters<typeof parseLiveExploreState>[0]
}

describe("parseLiveExploreState", () => {
  test("empty params -> default state", () => {
    expect(parseLiveExploreState(makeParams())).toEqual(LIVE_EXPLORE_DEFAULT_STATE)
  })

  test("reads all known keys", () => {
    const state = parseLiveExploreState(
      makeParams({
        q: "momo",
        type: "et-1",
        cuisine: "cu-2",
        province: "3",
        district: "4",
        municipality: "5",
        sort: "top_rated",
        page: "2",
      }),
    )
    expect(state).toEqual({
      q: "momo",
      type: "et-1",
      cuisine: "cu-2",
      province: 3,
      district: 4,
      municipality: 5,
      sort: "top_rated",
      page: 2,
    })
  })

  test("invalid sort normalizes to default", () => {
    expect(parseLiveExploreState(makeParams({ sort: "nearest" })).sort).toBe("recommended")
    expect(parseLiveExploreState(makeParams({ sort: "garbage" })).sort).toBe("recommended")
  })

  test("invalid / non-positive numeric params normalize to defaults", () => {
    const state = parseLiveExploreState(
      makeParams({ province: "abc", district: "0", municipality: "-3", page: "0" }),
    )
    expect(state.province).toBeNull()
    expect(state.district).toBeNull()
    expect(state.municipality).toBeNull()
    expect(state.page).toBe(1)
  })

  test("cascading: district without province is dropped", () => {
    const state = parseLiveExploreState(makeParams({ district: "4", municipality: "5" }))
    expect(state.province).toBeNull()
    expect(state.district).toBeNull()
    expect(state.municipality).toBeNull()
  })

  test("cascading: municipality without district is dropped", () => {
    const state = parseLiveExploreState(makeParams({ province: "3", municipality: "5" }))
    expect(state.province).toBe(3)
    expect(state.district).toBeNull()
    expect(state.municipality).toBeNull()
  })
})

describe("buildLiveExploreSearchString", () => {
  test("default state serializes to empty string", () => {
    expect(buildLiveExploreSearchString(LIVE_EXPLORE_DEFAULT_STATE)).toBe("")
  })

  test("omits default sort and page=1", () => {
    const search = buildLiveExploreSearchString({
      ...LIVE_EXPLORE_DEFAULT_STATE,
      sort: "recommended",
      page: 1,
      q: "cafe",
    })
    expect(search).toBe("q=cafe")
  })

  test("includes non-default values", () => {
    const search = buildLiveExploreSearchString({
      q: "tea",
      type: "et-1",
      cuisine: "cu-2",
      province: 3,
      district: 4,
      municipality: 5,
      sort: "most_reviewed",
      page: 2,
    })
    const params = new URLSearchParams(search)
    expect(params.get("q")).toBe("tea")
    expect(params.get("type")).toBe("et-1")
    expect(params.get("cuisine")).toBe("cu-2")
    expect(params.get("province")).toBe("3")
    expect(params.get("district")).toBe("4")
    expect(params.get("municipality")).toBe("5")
    expect(params.get("sort")).toBe("most_reviewed")
    expect(params.get("page")).toBe("2")
  })
})

describe("round-trip parse <-> build", () => {
  test("non-default state round-trips", () => {
    const state: LiveExploreState = {
      q: "khaja",
      type: "et-7",
      cuisine: "cu-9",
      province: 1,
      district: 2,
      municipality: 3,
      sort: "top_rated",
      page: 4,
    }
    const rebuilt = parseLiveExploreState(makeParams(Object.fromEntries(new URLSearchParams(buildLiveExploreSearchString(state)))))
    expect(rebuilt).toEqual(state)
  })

  test("default state round-trips through empty url", () => {
    const search = buildLiveExploreSearchString(LIVE_EXPLORE_DEFAULT_STATE)
    expect(parseLiveExploreState(makeParams(Object.fromEntries(new URLSearchParams(search))))).toEqual(
      LIVE_EXPLORE_DEFAULT_STATE,
    )
  })
})

describe("applyLiveExploreChange", () => {
  test("changing a filter resets page to 1", () => {
    const next = applyLiveExploreChange(
      { ...LIVE_EXPLORE_DEFAULT_STATE, page: 5 },
      { q: "new search" },
    )
    expect(next.q).toBe("new search")
    expect(next.page).toBe(1)
  })

  test("changing province clears district and municipality", () => {
    const next = applyLiveExploreChange(
      { ...LIVE_EXPLORE_DEFAULT_STATE, province: 1, district: 2, municipality: 3 },
      { province: 9 },
    )
    expect(next.province).toBe(9)
    expect(next.district).toBeNull()
    expect(next.municipality).toBeNull()
  })

  test("changing district clears municipality but keeps province", () => {
    const next = applyLiveExploreChange(
      { ...LIVE_EXPLORE_DEFAULT_STATE, province: 1, district: 2, municipality: 3 },
      { district: 8 },
    )
    expect(next.province).toBe(1)
    expect(next.district).toBe(8)
    expect(next.municipality).toBeNull()
  })

  test("pagination-only change preserves page value and other state", () => {
    const next = applyLiveExploreChange(
      { ...LIVE_EXPLORE_DEFAULT_STATE, q: "soup", province: 1 },
      { page: 3 },
    )
    expect(next.page).toBe(3)
    expect(next.q).toBe("soup")
    expect(next.province).toBe(1)
  })
})

describe("liveExploreStateToSearchParams", () => {
  test("default state omits filters but keeps sort/page/perPage", () => {
    const params = liveExploreStateToSearchParams(LIVE_EXPLORE_DEFAULT_STATE)
    expect(params).toEqual({
      q: undefined,
      establishmentTypeId: undefined,
      cuisineId: undefined,
      provinceId: undefined,
      districtId: undefined,
      municipalityId: undefined,
      sort: "recommended",
      page: 1,
      perPage: 6,
    })
  })

  test("maps populated state to API param shape", () => {
    const params = liveExploreStateToSearchParams({
      q: "thali",
      type: "et-1",
      cuisine: "cu-2",
      province: 3,
      district: 4,
      municipality: 5,
      sort: "most_reviewed",
      page: 2,
    })
    expect(params).toEqual({
      q: "thali",
      establishmentTypeId: "et-1",
      cuisineId: "cu-2",
      provinceId: 3,
      districtId: 4,
      municipalityId: 5,
      sort: "most_reviewed",
      page: 2,
      perPage: 6,
    })
  })
})
