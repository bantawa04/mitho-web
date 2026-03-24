"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const radioVariants = cva(
  "aspect-square rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input text-brand-orange hover:border-brand-orange data-[state=checked]:border-brand-orange",
        success: "border-input text-success hover:border-success data-[state=checked]:border-success",
        secondary:
          "border-input text-brand-deep-green hover:border-brand-deep-green data-[state=checked]:border-brand-deep-green",
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

const indicatorSizeVariants = cva("fill-current text-current", {
  variants: {
    size: {
      sm: "h-2 w-2",
      default: "h-2.5 w-2.5",
      lg: "h-3 w-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface MithoRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioVariants> {
  label?: string
  error?: string
}

const MithoRadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, MithoRadioGroupProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium leading-none">{label}</label>}
        <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref}>
          {children}
        </RadioGroupPrimitive.Root>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    )
  },
)
MithoRadioGroup.displayName = "MithoRadioGroup"

interface MithoRadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {
  label?: string
  description?: string
}

const MithoRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  MithoRadioGroupItemProps
>(({ className, variant, size, label, description, ...props }, ref) => {
  const id = React.useId()

  return (
    <div className="flex items-start gap-3">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={id}
        className={cn(radioVariants({ variant, size, className }))}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className={cn(indicatorSizeVariants({ size }))} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {label && (
        <div className="flex flex-col gap-0.5">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  )
})
MithoRadioGroupItem.displayName = "MithoRadioGroupItem"

export { MithoRadioGroup, MithoRadioGroupItem }
