import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-brand-soft-beige text-brand-dark-green",
        "brand-green": "bg-brand-deep-green text-white",
        neutral: "border border-brand-deep-green/10 bg-white/88 text-brand-dark-green",
        moderation: "bg-surface-admin text-brand-dark-green",
        promotional: "bg-brand-orange text-white",
        success: "bg-success/10 text-[#15803d] border border-success/25",
        warning: "bg-warning/10 text-warning-foreground border border-warning/20",
        danger: "bg-danger/10 text-[#b91c1c] border border-danger/25",
        info: "bg-info/10 text-info-foreground border border-info/20",
        muted: "bg-brand-soft-beige/70 text-brand-dark-green",
        outline: "border-2 border-brand-deep-green/60 text-brand-deep-green bg-white/70",
        "outline-orange": "border-2 border-brand-orange text-brand-orange bg-transparent",
        "outline-success": "border-2 border-success text-success bg-transparent",
        "outline-danger": "border-2 border-danger text-danger bg-transparent",
        "outline-info": "border-2 border-info text-info bg-transparent",
        "outline-warning": "border-2 border-warning text-warning-foreground bg-transparent",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function MithoBadge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

// Preset badges for common use cases
function OpenNowBadge() {
  return <MithoBadge variant="success">Open Now</MithoBadge>
}

function ClosedBadge() {
  return <MithoBadge variant="danger">Closed</MithoBadge>
}

function TopRatedBadge() {
  return <MithoBadge variant="default">Top Rated</MithoBadge>
}

function TrendingBadge() {
  return <MithoBadge variant="default">Trending</MithoBadge>
}

export { MithoBadge, badgeVariants, OpenNowBadge, ClosedBadge, TopRatedBadge, TrendingBadge }
