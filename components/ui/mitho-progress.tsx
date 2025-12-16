"use client"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "danger"
  showLabel?: boolean
  className?: string
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3",
}

const variantClasses = {
  default: "bg-brand-orange",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
}

export function MithoProgress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", variantClasses[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1">
          {value} / {max}
        </p>
      )}
    </div>
  )
}
