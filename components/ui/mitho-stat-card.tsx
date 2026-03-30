"use client"

import type * as React from "react"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoCard, MithoCardHeader, MithoCardContent } from "./mitho-card"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  isLocked?: boolean
  className?: string
}

export function StatCard({ icon, label, value, subtext, trend, isLocked = false, className }: StatCardProps) {
  return (
    <MithoCard
      surface="business"
      interactive="subtle"
      className={cn("relative", isLocked && "opacity-70", className)}
    >
      {isLocked && (
        <div className="absolute top-4 right-4 z-10">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <MithoCardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft-beige text-brand-orange">
            {icon}
          </div>
          <div className="flex-1">
            <p className="type-meta font-medium">{label}</p>
          </div>
        </div>
      </MithoCardHeader>
      <MithoCardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{isLocked ? "---" : value}</p>
            {subtext && <p className="type-meta mt-1 text-xs">{subtext}</p>}
          </div>
          {trend && !isLocked && (
            <div
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                trend.isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </div>
          )}
        </div>
      </MithoCardContent>
    </MithoCard>
  )
}
