import { afterEach, describe, expect, test } from "bun:test"
import { createBusinessStaticMapEndpoint, createGoogleDirectionsUrl } from "@/lib/google-maps"

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL

afterEach(() => {
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl
  }
})

describe("google maps helpers", () => {
  test("builds same-origin static map endpoint when api url missing", () => {
    delete process.env.NEXT_PUBLIC_API_URL
    expect(createBusinessStaticMapEndpoint("biz-1")).toBe("/api/businesses/biz-1/static-map")
  })

  test("builds absolute static map endpoint when api url configured", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    expect(createBusinessStaticMapEndpoint("biz-1")).toBe("https://api.example.com/api/businesses/biz-1/static-map")
  })

  test("preserves existing /api suffix", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/api"
    expect(createBusinessStaticMapEndpoint("biz-1")).toBe("https://api.example.com/api/businesses/biz-1/static-map")
  })

  test("builds directions url", () => {
    expect(createGoogleDirectionsUrl({ lat: 27.7172, lng: 85.324 })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=27.7172,85.324",
    )
  })
})
