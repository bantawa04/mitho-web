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
  Bike,
  Banknote,
  QrCode,
  Smartphone,
  Snowflake,
  Trees,
  Salad,
  BadgeCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  airConditioning: Snowflake,
  outdoorSeating: Trees,
  takeaway: ShoppingBag,
  delivery: Bike,
  cards: CreditCard,
  cash: Banknote,
  esewa: Smartphone,
  khalti: Smartphone,
  qr: QrCode,
  accessible: Accessibility,
  dineIn: UtensilsCrossed,
  alcohol: Beer,
  liveMusic: Music,
  petFriendly: Dog,
  vegetarian: Salad,
  vegan: Leaf,
  halal: BadgeCheck,
  nonVeg: UtensilsCrossed,
}

const amenityLabels: Record<string, string> = {
  wifi: "Free WiFi",
  parking: "Parking",
  airConditioning: "Air Conditioning",
  outdoorSeating: "Outdoor Seating",
  takeaway: "Takeaway",
  delivery: "Delivery",
  cards: "Cards Accepted",
  cash: "Cash",
  esewa: "eSewa",
  khalti: "Khalti",
  qr: "QR Payment",
  accessible: "Wheelchair Accessible",
  dineIn: "Dine-In",
  alcohol: "Serves Alcohol",
  liveMusic: "Live Music",
  petFriendly: "Pet Friendly",
  vegetarian: "Vegetarian",
  vegan: "Vegan Options",
  halal: "Halal",
  nonVeg: "Non Veg",
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
        available
          ? "bg-brand-soft-beige/50 text-brand-dark-green"
          : "bg-muted/70 text-muted-foreground line-through",
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
