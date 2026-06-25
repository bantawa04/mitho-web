export function safeDecodePathSegment(value: string): string {
  const trimmed = value.trim()
  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

export function encodePathSegment(value: string): string {
  return encodeURIComponent(safeDecodePathSegment(value))
}

export function normalizeEncodedPath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) return "/"

  const segments = trimmed
    .split("/")
    .filter(Boolean)
    .map(encodePathSegment)

  return `/${segments.join("/")}`
}
