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
        "group flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-white/90 px-4 py-3 shadow-[0_8px_24px_rgba(10,70,53,0.06)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange/25 hover:shadow-[0_14px_28px_rgba(10,70,53,0.1)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "cursor-pointer",
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green transition-colors group-hover:bg-brand-deep-green group-hover:text-white">
        {icon}
      </div>
      <span className="text-sm font-semibold text-brand-dark-green">{label}</span>
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
