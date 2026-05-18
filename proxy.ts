import { NextResponse, type NextRequest } from "next/server"

const ROBOTS_HEADER_VALUE = "noindex, nofollow, noarchive"
const ASSET_FILE_PATTERN =
  /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf)$/i

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

export function proxy(request: NextRequest) {
  if (!isBasicAuthEnabled()) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (isPublicAssetPath(pathname)) {
    return NextResponse.next()
  }

  const username = process.env.BASIC_AUTH_USERNAME
  const password = process.env.BASIC_AUTH_PASSWORD

  if (!username || !password) {
    return serverMisconfiguredResponse()
  }

  if (!isAuthorized(request, username, password)) {
    return unauthorizedResponse()
  }

  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", ROBOTS_HEADER_VALUE)
  response.headers.set("Cache-Control", "private, no-store")
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|woff|woff2|ttf|otf)$).*)",
  ],
}
