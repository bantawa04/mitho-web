import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoTone = "green" | "orange"
type BrandLogoKind = "full" | "wordmark" | "icon"

const logoMap: Record<BrandLogoTone, Record<BrandLogoKind, string>> = {
  green: {
    full: "/brand/logo-primary-green.svg",
    wordmark: "/brand/logo-secondary-green.svg",
    icon: "/brand/logo-icon-green.svg",
  },
  orange: {
    full: "/brand/logo-primary-orange.svg",
    wordmark: "/brand/logo-secondary-orange.svg",
    icon: "/brand/logo-icon-orange.svg",
  },
}

const dimensionMap: Record<BrandLogoKind, { width: number; height: number }> = {
  full: { width: 1820, height: 720 },
  wordmark: { width: 1800, height: 300 },
  icon: { width: 930, height: 760 },
}

interface BrandLogoProps {
  tone?: BrandLogoTone
  kind?: BrandLogoKind
  className?: string
  alt?: string
  priority?: boolean
}

export function BrandLogo({
  tone = "green",
  kind = "wordmark",
  className,
  alt = "Mitho Cha!",
  priority = false,
}: BrandLogoProps) {
  const dimensions = dimensionMap[kind]

  return (
    <Image
      src={logoMap[tone][kind]}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  )
}
