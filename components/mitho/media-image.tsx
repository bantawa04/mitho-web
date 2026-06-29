"use client"

import { useEffect, useMemo, useState } from "react"
import type { ImgHTMLAttributes, SyntheticEvent } from "react"
import { getMediaImage } from "@/lib/media-image"
import type { Media, MediaImageVariant } from "@/types/media"

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  media: Pick<Media, "publicUrl" | "variants"> | null | undefined
  variant: MediaImageVariant
  fallback?: string | null
}

export function MediaImage({
  media,
  variant,
  fallback,
  onError,
  ...props
}: MediaImageProps) {
  const sources = useMemo(() => {
    const candidates = [
      media?.variants?.[variant]?.trim(),
      media?.publicUrl?.trim(),
      getMediaImage(media, variant, fallback),
      fallback?.trim(),
    ].filter((value): value is string => Boolean(value))

    return Array.from(new Set(candidates))
  }, [fallback, media, variant])

  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    setSourceIndex(0)
  }, [sources])

  const src = sources[sourceIndex] ?? fallback ?? ""

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((current) => current + 1)
      return
    }

    onError?.(event)
  }

  return <img {...props} src={src} onError={handleError} />
}
