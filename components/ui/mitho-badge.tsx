import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-brand-orange text-white hover:bg-brand-fresh-orange",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
        muted: "bg-brand-soft-beige text-brand-dark-green hover:bg-brand-soft-beige/80",
        outline:
          "border-2 border-brand-deep-green text-brand-deep-green bg-transparent hover:bg-brand-deep-green hover:text-white",
        "outline-orange":
          "border-2 border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange hover:text-white",
        "outline-success": "border-2 border-success text-success bg-transparent hover:bg-success hover:text-white",
        "outline-danger": "border-2 border-danger text-danger bg-transparent hover:bg-danger hover:text-white",
        "outline-info": "border-2 border-info text-info bg-transparent hover:bg-info hover:text-white",
        "outline-warning": "border-2 border-warning text-warning-foreground bg-transparent hover:bg-warning",
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
  return <MithoBadge variant="warning">Trending</MithoBadge>
}

export { MithoBadge, badgeVariants, OpenNowBadge, ClosedBadge, TopRatedBadge, TrendingBadge }
