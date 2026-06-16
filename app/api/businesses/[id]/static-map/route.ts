function buildApiBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!rawBaseUrl) {
    return "http://localhost:8000/api"
  }

  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "")
  return normalizedBaseUrl.endsWith("/api") ? normalizedBaseUrl : `${normalizedBaseUrl}/api`
}

function copyHeader(source: Headers, target: Headers, name: string) {
  const value = source.get(name)
  if (value) {
    target.set(name, value)
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const businessId = id.trim()
  if (!businessId) {
    return Response.json({ message: "Business ID is required" }, { status: 400 })
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(`${buildApiBaseUrl()}/businesses/${encodeURIComponent(businessId)}/static-map`, {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    })
  } catch {
    return Response.json({ message: "Map preview unavailable" }, { status: 502 })
  }

  const headers = new Headers()
  copyHeader(upstreamResponse.headers, headers, "content-type")
  copyHeader(upstreamResponse.headers, headers, "content-length")
  copyHeader(upstreamResponse.headers, headers, "cache-control")

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  })
}
