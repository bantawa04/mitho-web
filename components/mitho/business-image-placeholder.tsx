import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/mitho/brand-logo"

interface BusinessCardImagePlaceholderProps {
  className?: string
}

export function BusinessCardImagePlaceholder({ className }: BusinessCardImagePlaceholderProps) {
  return (
    <div className={cn("flex items-center justify-center bg-brand-deep-green/10", className)}>
      <BrandLogo kind="full" tone="green" className="w-36 opacity-30" />
    </div>
  )
}
