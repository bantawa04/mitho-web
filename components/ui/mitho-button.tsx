import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-brand-orange text-white hover:bg-brand-fresh-orange shadow-md hover:shadow-lg active:bg-[#d97b00]",
        secondary:
          "border-2 border-brand-deep-green text-brand-deep-green bg-transparent hover:bg-brand-deep-green hover:text-white active:bg-[#006630]",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md active:bg-[#15803d]",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90 shadow-md active:bg-[#b91c1c]",
        ghost: "hover:bg-brand-soft-beige hover:text-brand-dark-green active:bg-brand-soft-beige/80",
        link: "text-brand-orange underline-offset-4 hover:underline active:text-brand-fresh-orange",
        "outline-primary":
          "border-2 border-brand-orange text-brand-orange bg-transparent hover:bg-brand-orange hover:text-white active:bg-[#d97b00]",
        "outline-success":
          "border-2 border-success text-success bg-transparent hover:bg-success hover:text-white active:bg-[#15803d]",
        "outline-danger":
          "border-2 border-danger text-danger bg-transparent hover:bg-danger hover:text-white active:bg-[#b91c1c]",
        "outline-info":
          "border-2 border-info text-info bg-transparent hover:bg-info hover:text-white active:bg-[#2563eb]",
      },
      size: {
        default: "h-11 px-6 py-2 [&_svg]:size-4",
        sm: "h-9 rounded-lg px-4 text-xs [&_svg]:size-3.5",
        lg: "h-12 rounded-xl px-8 text-base [&_svg]:size-5",
        icon: "h-10 w-10 p-0 [&_svg]:size-5",
        "icon-sm": "h-8 w-8 p-0 rounded-lg [&_svg]:size-4",
        "icon-lg": "h-12 w-12 p-0 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const MithoButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, leftIcon, rightIcon, children, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    const isIconOnly = size === "icon" || size === "icon-sm" || size === "icon-lg"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : leftIcon}
        {!isIconOnly && children}
        {!loading && rightIcon}
      </Comp>
    )
  },
)
MithoButton.displayName = "MithoButton"

export { MithoButton, buttonVariants }
