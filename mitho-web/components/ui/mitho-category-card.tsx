"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Utensils, Truck, Coffee, MapPin, Soup, Building2 } from "lucide-react"

interface CategoryCardProps {
  icon: React.ReactNode
  label: string
  href?: string
  className?: string
}

export function CategoryCard({ icon, label, href = "#", className }: CategoryCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-card",
        "transition-all duration-200 hover:shadow-lg hover:border-brand-orange/30 hover:-translate-y-1",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "group cursor-pointer",
        className,
      )}
    >
      <div className="w-14 h-14 rounded-xl bg-brand-soft-beige flex items-center justify-center text-brand-orange transition-colors group-hover:bg-brand-orange group-hover:text-white">
        {icon}
      </div>
      <span className="text-sm font-semibold text-foreground text-center">{label}</span>
    </a>
  )
}

export const categoryIcons = {
  restaurant: <Utensils className="h-6 w-6" />,
  foodTruck: <Truck className="h-6 w-6" />,
  streetFood: <Soup className="h-6 w-6" />,
  cafe: <Coffee className="h-6 w-6" />,
  local: <MapPin className="h-6 w-6" />,
  dineIn: <Building2 className="h-6 w-6" />,
}
