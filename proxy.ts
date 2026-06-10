import { NextResponse, type NextRequest } from "next/server"
import { isInternalUser, isProfileComplete } from "@/lib/auth/access"
import type { AuthUser } from "@/types/auth"
import type { ISuccessResponse } from "@/types/response"
import { LRUCache } from "lru-cache"

const sessionCache = new LRUCache<string, AuthUser | { unauthenticated: true }>({
  max: 500,
  ttl: 30 * 1000, // 30 seconds
})

const ROBOTS_HEADER_VALUE = "noindex, nofollow, noarchive"
const ASSET_FILE_PATTERN =
  /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf)$/i
const AUTH_SESSION_COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME?.trim() || "mitho_session"

function isBasicAuthEnabled() {
  return process.env.BASIC_AUTH_ENABLED === "true"
}

function isPublicAssetPath(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/apple-icon") ||
    ASSET_FILE_PATTERN.test(pathname)
  )
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Development"',
      "Cache-Control": "private, no-store",
    },
  })
}

function serverMisconfiguredResponse() {
  return new NextResponse("Basic auth is enabled but credentials are not configured.", {
    status: 500,
    headers: {
      "Cache-Control": "private, no-store",
    },
  })
}

function isAuthorized(request: NextRequest, username: string, password: string) {
  const authorization = request.headers.get("authorization")
  if (!authorization) return false

  const expectedValue = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
  return authorization === expectedValue
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function isProfilePath(pathname: string) {
  return pathname === "/profile" || pathname.startsWith("/profile/")
}

function isCollectionsPath(pathname: string) {
  return pathname === "/collections" || pathname.startsWith("/collections/")
}

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
}

function isCompleteProfilePath(pathname: string) {
  return pathname === "/complete-profile"
}

function isProtectedAppPath(pathname: string) {
  return (
    isAdminPath(pathname) ||
    isProfilePath(pathname) ||
    isCollectionsPath(pathname) ||
    isDashboardPath(pathname) ||
    isCompleteProfilePath(pathname)
  )
}

function requiresCompletedCustomerProfile(pathname: string) {
  return isProfilePath(pathname) || isCollectionsPath(pathname) || isDashboardPath(pathname)
}

function buildRedirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url)
  const redirectPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  loginUrl.searchParams.set("redirect", redirectPath)
  return NextResponse.redirect(loginUrl)
}

function buildCompleteProfileRedirect(request: NextRequest) {
  const completeProfileUrl = new URL("/complete-profile", request.url)
  const redirectPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  completeProfileUrl.searchParams.set("redirect", redirectPath)
  return NextResponse.redirect(completeProfileUrl)
}

function buildPostCompletionRedirect(request: NextRequest) {
  const requestedRedirect = request.nextUrl.searchParams.get("redirect")
  if (requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//") && !requestedRedirect.startsWith("/login")) {
    return NextResponse.redirect(new URL(requestedRedirect, request.url))
  }

  return NextResponse.redirect(new URL("/profile", request.url))
}

function buildApiBaseUrl(request: NextRequest) {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!rawBaseUrl) {
    return new URL("/api", request.nextUrl.origin).toString()
  }

  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")
  return normalizedBaseUrl.endsWith("/api") ? normalizedBaseUrl : `${normalizedBaseUrl}/api`
}

async function fetchAuthenticatedSession(request: NextRequest): Promise<AuthUser | null> {
  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value?.trim()
  if (!sessionCookie) return null

  if (sessionCache.has(sessionCookie)) {
    const cached = sessionCache.get(sessionCookie)
    if (cached && "unauthenticated" in cached) return null
    return cached as AuthUser | null
  }

  const response = await fetch(`${buildApiBaseUrl(request)}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: `${AUTH_SESSION_COOKIE_NAME}=${sessionCookie}`,
      "X-Requested-With": "XMLHttpRequest",
    },
    cache: "no-store",
  })

  if (response.status === 401 || response.status === 429) {
    sessionCache.set(sessionCookie, { unauthenticated: true })
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to resolve auth session: ${response.status}`)
  }

  const payload = (await response.json()) as ISuccessResponse<AuthUser>
  sessionCache.set(sessionCookie, payload.data)
  return payload.data
}

async function enforceRoleGates(request: NextRequest) {
  if (!isProtectedAppPath(request.nextUrl.pathname)) {
    return null
  }

  const authUser = await fetchAuthenticatedSession(request)
  if (!authUser) {
    return buildRedirectToLogin(request)
  }

  const isInternal = isInternalUser(authUser)
  const profileComplete = isProfileComplete(authUser)
  if ((isProfilePath(request.nextUrl.pathname) || isCompleteProfilePath(request.nextUrl.pathname)) && isInternal) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (isAdminPath(request.nextUrl.pathname) && !isInternal) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!isInternal && isCompleteProfilePath(request.nextUrl.pathname) && profileComplete) {
    return buildPostCompletionRedirect(request)
  }

  if (!isInternal && !profileComplete && requiresCompletedCustomerProfile(request.nextUrl.pathname)) {
    return buildCompleteProfileRedirect(request)
  }

  return null
}

export async function proxy(request: NextRequest) {
  if (isBasicAuthEnabled()) {
    const { pathname } = request.nextUrl

    if (!isPublicAssetPath(pathname)) {
      const username = process.env.BASIC_AUTH_USERNAME
      const password = process.env.BASIC_AUTH_PASSWORD

      if (!username || !password) {
        return serverMisconfiguredResponse()
      }

      if (!isAuthorized(request, username, password)) {
        return unauthorizedResponse()
      }
    }
  }

  const gatedResponse = await enforceRoleGates(request)
  if (gatedResponse) {
    return gatedResponse
  }

  const response = NextResponse.next()
  if (isBasicAuthEnabled() && !isPublicAssetPath(request.nextUrl.pathname)) {
    response.headers.set("X-Robots-Tag", ROBOTS_HEADER_VALUE)
    response.headers.set("Cache-Control", "private, no-store")
  }
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf)$).*)",
  ],
}
