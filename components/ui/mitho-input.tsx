import * as React from "react"
import { Search, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const MithoInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:cursor-not-allowed disabled:opacity-50",
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
          "flex h-12 w-full rounded-2xl border-2 border-input bg-background pl-12 pr-4 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:cursor-not-allowed disabled:opacity-50",
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
