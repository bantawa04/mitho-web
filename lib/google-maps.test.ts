import { describe, expect, test } from "bun:test"
import { createGoogleStaticMapUrl, createGoogleDirectionsUrl } from "@/lib/google-maps"

describe("google maps helpers", () => {
  test("builds a google static map url from coordinates", () => {
    const url = createGoogleStaticMapUrl({ lat: 27.7172, lng: 85.324 })
    expect(url).not.toBeNull()
    const parsed = new URL(url as string)
    expect(parsed.origin + parsed.pathname).toBe("https://maps.googleapis.com/maps/api/staticmap")
    expect(parsed.searchParams.get("center")).toBe("27.7172,85.324")
    expect(parsed.searchParams.get("zoom")).toBe("15")
    expect(parsed.searchParams.get("size")).toBe("640x480")
    expect(parsed.searchParams.get("scale")).toBe("2")
    expect(parsed.searchParams.get("markers")).toBe("color:0x0A4635|27.7172,85.324")
    // Uses the public key from the environment.
    expect(parsed.searchParams.get("key")).toBe(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "")
  })

  test("builds directions url", () => {
    expect(createGoogleDirectionsUrl({ lat: 27.7172, lng: 85.324 })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=27.7172,85.324",
    )
  })
})
