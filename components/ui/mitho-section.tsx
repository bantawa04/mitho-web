import type * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  title?: string
  subtitle?: string
  titleIcon?: React.ReactNode
  action?: React.ReactNode
}

export function MithoSection({
  children,
  className,
  containerClassName,
  title,
  subtitle,
  titleIcon,
  action,
}: SectionProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {(title || subtitle || action) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  {titleIcon}
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-muted-foreground mt-2 text-balance">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
