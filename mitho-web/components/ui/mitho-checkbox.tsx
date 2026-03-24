"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "shrink-0 rounded-md border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input hover:border-brand-orange data-[state=checked]:border-brand-orange data-[state=checked]:bg-brand-orange data-[state=indeterminate]:border-brand-orange data-[state=indeterminate]:bg-brand-orange",
        success:
          "border-input hover:border-success data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=indeterminate]:border-success data-[state=indeterminate]:bg-success",
        secondary:
          "border-input hover:border-brand-deep-green data-[state=checked]:border-brand-deep-green data-[state=checked]:bg-brand-deep-green data-[state=indeterminate]:border-brand-deep-green data-[state=indeterminate]:bg-brand-deep-green",
        danger:
          "border-input hover:border-danger data-[state=checked]:border-danger data-[state=checked]:bg-danger data-[state=indeterminate]:border-danger data-[state=indeterminate]:bg-danger",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const iconSizeVariants = cva("text-white", {
  variants: {
    size: {
      sm: "h-3 w-3",
      default: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface MithoCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
  indeterminate?: boolean
}

const MithoCheckbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, MithoCheckboxProps>(
  ({ className, variant, size, label, description, indeterminate, ...props }, ref) => {
    const id = React.useId()

    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(checkboxVariants({ variant, size, className }))}
        checked={indeterminate ? "indeterminate" : props.checked}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
          {indeterminate ? (
            <Minus className={cn(iconSizeVariants({ size }))} />
          ) : (
            <Check className={cn(iconSizeVariants({ size }))} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )

    if (label) {
      return (
        <div className="flex items-start gap-3">
          {checkbox}
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
            {description && <span className="text-sm text-muted-foreground">{description}</span>}
          </div>
        </div>
      )
    }

    return checkbox
  },
)
MithoCheckbox.displayName = "MithoCheckbox"

export { MithoCheckbox }
