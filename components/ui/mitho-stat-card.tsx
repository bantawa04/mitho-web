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
    <MithoCard className={cn("relative hover:shadow-md transition-all", isLocked && "opacity-70", className)}>
      {isLocked && (
        <div className="absolute top-4 right-4 z-10">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <MithoCardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </MithoCardHeader>
      <MithoCardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{isLocked ? "---" : value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
          </div>
          {trend && !isLocked && (
            <div
              className={cn(
                "px-2 py-1 rounded-lg text-xs font-semibold",
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
