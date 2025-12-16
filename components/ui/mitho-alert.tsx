"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 transition-all duration-200 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        success: "border-success/30 bg-success/10 text-success [&>svg]:text-success",
        info: "border-info/30 bg-info/10 text-info [&>svg]:text-info",
        warning: "border-warning/30 bg-warning/10 text-warning-foreground [&>svg]:text-warning",
        danger: "border-danger/30 bg-danger/10 text-danger [&>svg]:text-danger",
        outline: "border-2 border-brand-orange bg-transparent text-foreground [&>svg]:text-brand-orange",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  outline: Info,
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  dismissible?: boolean
  onDismiss?: () => void
}

const MithoAlert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", dismissible, onDismiss, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <Icon className="h-5 w-5" />
        {children}
        {dismissible && (
          <button
            onClick={onDismiss}
            className="absolute right-3 top-3 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)
MithoAlert.displayName = "MithoAlert"

const MithoAlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
MithoAlertTitle.displayName = "MithoAlertTitle"

const MithoAlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)} {...props} />
  ),
)
MithoAlertDescription.displayName = "MithoAlertDescription"

export { MithoAlert, MithoAlertTitle, MithoAlertDescription }
