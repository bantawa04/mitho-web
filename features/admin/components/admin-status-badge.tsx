import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AdminStatusBadgeProps {
  label: string
  tone: string
  size?: "sm" | "md"
  className?: string
}

export function AdminStatusBadge({ label, tone, size = "sm", className }: AdminStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex rounded-full border font-semibold",
        size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-1 text-xs",
        tone,
        className,
      )}
    >
      {label}
    </Badge>
  )
}
