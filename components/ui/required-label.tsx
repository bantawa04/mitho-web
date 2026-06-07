import type { ReactNode } from "react"
import { FormLabel } from "@/components/ui/form"
import { cn } from "@/lib/utils"

interface RequiredLabelProps {
  children: ReactNode
  className?: string
  required?: boolean
}

export function RequiredLabel({ children, className, required = true }: RequiredLabelProps) {
  return (
    <FormLabel className={cn(className)}>
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </FormLabel>
  )
}
