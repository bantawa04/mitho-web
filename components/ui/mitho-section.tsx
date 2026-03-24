import type * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  title?: string
  subtitle?: string
  eyebrow?: string
  titleIcon?: React.ReactNode
  action?: React.ReactNode
  density?: "compact" | "default" | "feature"
  tone?: "default" | "warm" | "strong" | "transparent"
}

const densityClasses = {
  compact: "py-12",
  default: "py-16 md:py-20",
  feature: "py-20 md:py-24",
}

const toneClasses = {
  default: "bg-transparent",
  warm: "bg-surface-warm",
  strong: "bg-surface-strong text-surface-strong-foreground",
  transparent: "bg-transparent",
}

export function MithoSection({
  children,
  className,
  containerClassName,
  title,
  subtitle,
  eyebrow,
  titleIcon,
  action,
  density = "default",
  tone = "default",
}: SectionProps) {
  const isStrong = tone === "strong"

  return (
    <section className={cn(densityClasses[density], toneClasses[tone], className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {(title || subtitle || action) && (
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              {eyebrow && (
                <p
                  className={cn(
                    "mb-3 text-xs font-semibold uppercase tracking-[0.24em]",
                    isStrong ? "text-brand-soft-beige/75" : "text-brand-deep-green/70",
                  )}
                >
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2
                  className={cn(
                    "flex items-center gap-2 text-3xl font-bold leading-tight text-balance md:text-4xl",
                    isStrong ? "text-white" : "text-brand-dark-green",
                  )}
                >
                  {titleIcon}
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={cn("mt-3 text-base text-pretty md:text-lg", isStrong ? "text-white/75" : "text-muted-foreground")}>
                  {subtitle}
                </p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
