import type { Media, MediaImageVariant } from "@/types/media"

export function getMediaImage(
  media: Pick<Media, "publicUrl" | "variants"> | null | undefined,
  variant: MediaImageVariant,
  fallback?: string | null,
) {
  const variantUrl = media?.variants?.[variant]?.trim()
  if (variantUrl) return variantUrl

  const publicUrl = media?.publicUrl?.trim()
  if (publicUrl) return publicUrl

  return fallback ?? null
}
