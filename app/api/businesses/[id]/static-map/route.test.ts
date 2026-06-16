import { afterEach, describe, expect, mock, test } from "bun:test"
import { GET } from "./route"

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL
const originalFetch = globalThis.fetch

afterEach(() => {
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl
  }
  globalThis.fetch = originalFetch
})

describe("business static map route", () => {
  test("streams the backend static map through the same-origin API route", async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    const fetchBackend = mock().mockResolvedValueOnce(
      new Response("pngdata", {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": "7",
          "Cache-Control": "public, max-age=3600",
        },
      }),
    )
    globalThis.fetch = fetchBackend as unknown as typeof fetch

    const response = await GET(new Request("https://mitho.example.com/api/businesses/biz-1/static-map"), {
      params: Promise.resolve({ id: "biz-1" }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("image/png")
    expect(response.headers.get("Content-Length")).toBe("7")
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600")
    expect(await response.text()).toBe("pngdata")
    expect(fetchBackend).toHaveBeenCalledWith("http://localhost:8000/api/businesses/biz-1/static-map", {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    })
  })

  test("uses configured backend API URL when present", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/api"
    const fetchBackend = mock().mockResolvedValueOnce(new Response("pngdata", { status: 200 }))
    globalThis.fetch = fetchBackend as unknown as typeof fetch

    await GET(new Request("https://mitho.example.com/api/businesses/biz-1/static-map"), {
      params: Promise.resolve({ id: "biz-1" }),
    })

    expect(fetchBackend).toHaveBeenCalledWith("https://api.example.com/api/businesses/biz-1/static-map", {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    })
  })
})
