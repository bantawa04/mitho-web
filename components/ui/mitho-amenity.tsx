import type * as React from "react"
import {
  Wifi,
  Car,
  ShoppingBag,
  CreditCard,
  Accessibility,
  UtensilsCrossed,
  Beer,
  Music,
  Dog,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  takeaway: ShoppingBag,
  cards: CreditCard,
  accessible: Accessibility,
  dineIn: UtensilsCrossed,
  alcohol: Beer,
  liveMusic: Music,
  petFriendly: Dog,
  vegan: Leaf,
}

const amenityLabels: Record<string, string> = {
  wifi: "Free WiFi",
  parking: "Parking",
  takeaway: "Takeaway",
  cards: "Cards Accepted",
  accessible: "Wheelchair Accessible",
  dineIn: "Dine-In",
  alcohol: "Serves Alcohol",
  liveMusic: "Live Music",
  petFriendly: "Pet Friendly",
  vegan: "Vegan Options",
}

interface AmenityBadgeProps {
  type: keyof typeof amenityIcons
  available?: boolean
  className?: string
}

export function AmenityBadge({ type, available = true, className }: AmenityBadgeProps) {
  const Icon = amenityIcons[type] || UtensilsCrossed
  const label = amenityLabels[type] || type

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
        available ? "bg-brand-soft-beige/50 text-brand-dark-green" : "bg-gray-100 text-gray-400 line-through",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  )
}

interface AmenityListProps {
  amenities: Array<keyof typeof amenityIcons>
  className?: string
}

export function AmenityList({ amenities, className }: AmenityListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {amenities.map((amenity) => (
        <AmenityBadge key={amenity} type={amenity} />
      ))}
    </div>
  )
}

export { amenityIcons, amenityLabels }
