import { afterEach, describe, expect, mock, test } from "bun:test"
import { NextRequest } from "next/server"
import { proxy } from "@/proxy"
import type { AuthUser } from "@/types/auth"
import type { ISuccessResponse } from "@/types/response"

const originalFetch = globalThis.fetch
const originalApiUrl = process.env.NEXT_PUBLIC_API_URL

function buildAuthUser(profileComplete: boolean): AuthUser {
  return {
    user: {
      id: "user-1",
      email: "customer@example.com",
      username: profileComplete ? "customer" : null,
      status: "active",
      profileComplete,
    },
    staffRoles: [],
    staffPermissions: [],
    businessMemberships: [],
  }
}

function sessionResponse(authUser: AuthUser) {
  const payload: ISuccessResponse<AuthUser> = {
    success: true,
    message: "Current session",
    data: authUser,
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl
  }
})

describe("profile completion route gate", () => {
  test("uses the updated session on the next protected navigation", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    const fetchSession = mock()
      .mockResolvedValueOnce(sessionResponse(buildAuthUser(false)))
      .mockResolvedValueOnce(sessionResponse(buildAuthUser(true)))
    globalThis.fetch = fetchSession as unknown as typeof fetch

    const headers = { Cookie: "mitho_session=session-1" }
    const completionResponse = await proxy(
      new NextRequest("https://mitho.example.com/complete-profile", { headers }),
    )
    const profileResponse = await proxy(
      new NextRequest("https://mitho.example.com/profile", { headers }),
    )

    expect(completionResponse.status).toBe(200)
    expect(profileResponse.status).toBe(200)
    expect(profileResponse.headers.get("location")).toBeNull()
    expect(fetchSession).toHaveBeenCalledTimes(2)
  })
})
