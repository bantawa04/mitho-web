import * as React from "react"
import { Search, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  surface?: "default" | "business" | "admin"
}

const MithoInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, surface = "default", ...props }, ref) => {
    const surfaceClass =
      surface === "business"
        ? "bg-surface-business border-brand-deep-green/14"
        : surface === "admin"
          ? "bg-surface-admin border-brand-deep-green/12"
          : "bg-background"

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="type-meta font-semibold text-foreground">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-2xl border px-4 py-2 text-sm transition-[border-color,box-shadow,background-color] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-orange/12 focus:shadow-[0_0_0_1px_rgba(239,138,0,0.12),0_12px_30px_rgba(239,138,0,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
            surfaceClass,
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    )
  },
)
MithoInput.displayName = "MithoInput"

const MithoSearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        className={cn(
          "flex h-12 w-full rounded-2xl border border-brand-deep-green/12 bg-surface-raised pl-12 pr-4 py-2 text-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-4 focus:ring-brand-orange/12 focus:shadow-[0_0_0_1px_rgba(239,138,0,0.12),0_12px_30px_rgba(239,138,0,0.08)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        placeholder="Search restaurants, food trucks..."
        {...props}
      />
    </div>
  )
})
MithoSearchInput.displayName = "MithoSearchInput"

export { MithoInput, MithoSearchInput }
