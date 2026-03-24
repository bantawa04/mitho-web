"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-brand-orange data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-muted-foreground/30",
        success:
          "data-[state=checked]:bg-success data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-muted-foreground/30",
        secondary:
          "data-[state=checked]:bg-brand-deep-green data-[state=unchecked]:bg-input hover:data-[state=unchecked]:bg-muted-foreground/30",
      },
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export interface MithoToggleProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof toggleVariants> {
  label?: string
  description?: string
}

const MithoToggle = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, MithoToggleProps>(
  ({ className, variant, size, label, description, ...props }, ref) => {
    const id = React.useId()

    if (label) {
      return (
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {label}
            </label>
            {description && <span className="text-sm text-muted-foreground">{description}</span>}
          </div>
          <SwitchPrimitives.Root
            id={id}
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
            ref={ref}
          >
            <SwitchPrimitives.Thumb className={cn(thumbVariants({ size }))} />
          </SwitchPrimitives.Root>
        </div>
      )
    }

    return (
      <SwitchPrimitives.Root className={cn(toggleVariants({ variant, size, className }))} {...props} ref={ref}>
        <SwitchPrimitives.Thumb className={cn(thumbVariants({ size }))} />
      </SwitchPrimitives.Root>
    )
  },
)
MithoToggle.displayName = "MithoToggle"

export { MithoToggle }
