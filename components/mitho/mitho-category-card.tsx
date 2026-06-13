"use client"

import Link from "next/link"
import type * as React from "react"
import { cn } from "@/lib/utils"
import { Utensils, Truck, Coffee, MapPin, Soup, Building2, Wine, Disc3, Mic2, Sandwich, UtensilsCrossed, Store, Building, Croissant, Candy, Beer } from "lucide-react"

interface CategoryCardProps {
  icon: React.ReactNode
  label: string
  href?: string
  className?: string
}

export function CategoryCard({ icon, label, href = "#", className }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-brand-deep-green/10 bg-white/90 px-4 py-3 shadow-sm",
        "transition-all duration-200 hover:border-brand-deep-green/25 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "cursor-pointer",
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft-beige text-brand-deep-green transition-colors group-hover:bg-brand-deep-green group-hover:text-white">
        {icon}
      </div>
      <span className="text-sm font-semibold text-brand-dark-green">{label}</span>
    </Link>
  )
}

export const categoryIcons = {
  restaurant: <Utensils className="h-6 w-6" />,
  cafe: <Coffee className="h-6 w-6" />,
  fast_food: <Sandwich className="h-6 w-6" />,
  khaja_ghar: <UtensilsCrossed className="h-6 w-6" />,
  club: <Wine className="h-6 w-6" />,
  street_stall: <Store className="h-6 w-6" />,
  food_court: <Building className="h-6 w-6" />,
  bakery: <Croissant className="h-6 w-6" />,
  sweet_shop: <Candy className="h-6 w-6" />,
  bar_restaurant: <Beer className="h-6 w-6" />,
  disco: <Disc3 className="h-6 w-6" />,
  dohori: <Mic2 className="h-6 w-6" />,
  foodTruck: <Truck className="h-6 w-6" />,
  streetFood: <Soup className="h-6 w-6" />,
  local: <MapPin className="h-6 w-6" />,
  dineIn: <Building2 className="h-6 w-6" />,
}
