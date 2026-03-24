"use client"

import type * as React from "react"
import { MapPin, Star, Clock, Heart, Truck, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { StarRating } from "./mitho-rating"
import { MithoBadge, OpenNowBadge, ClosedBadge, TopRatedBadge, TrendingBadge } from "./mitho-badge"

interface ListItemProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function MithoListItem({ className, children, onClick }: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-brand-orange/30 cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Restaurant List Item
interface RestaurantListItemProps {
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  priceRange: string
  location: string
  distance?: string
  imageUrl: string
  isOpen?: boolean
  isTopRated?: boolean
  isTrending?: boolean
  isSaved?: boolean
  onSave?: () => void
  onClick?: () => void
}

export function RestaurantListItem({
  name,
  cuisine,
  rating,
  reviewCount,
  priceRange,
  location,
  distance,
  imageUrl,
  isOpen = true,
  isTopRated = false,
  isTrending = false,
  isSaved = false,
  onSave,
  onClick,
}: RestaurantListItemProps) {
  return (
    <MithoListItem onClick={onClick}>
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {cuisine} · {priceRange}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSave?.()
            }}
            className="p-1.5 rounded-full hover:bg-brand-soft-beige transition-colors"
          >
            <Heart
              className={cn("h-5 w-5 transition-colors", isSaved ? "fill-danger text-danger" : "text-muted-foreground")}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={rating} size="sm" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </span>
          {distance && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {distance}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
          {isTopRated && <TopRatedBadge />}
          {isTrending && <TrendingBadge />}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
    </MithoListItem>
  )
}

// Food Truck List Item
interface FoodTruckListItemProps {
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  location: string
  schedule?: string
  imageUrl: string
  isOpen?: boolean
  isTrending?: boolean
  isSaved?: boolean
  onSave?: () => void
  onClick?: () => void
}

export function FoodTruckListItem({
  name,
  cuisine,
  rating,
  reviewCount,
  location,
  schedule,
  imageUrl,
  isOpen = true,
  isTrending = false,
  isSaved = false,
  onSave,
  onClick,
}: FoodTruckListItemProps) {
  return (
    <MithoListItem onClick={onClick}>
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        <div className="absolute bottom-1 left-1">
          <MithoBadge variant="muted" className="text-[10px] px-1.5 py-0.5">
            <Truck className="h-2.5 w-2.5 mr-0.5" />
            Truck
          </MithoBadge>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{cuisine}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSave?.()
            }}
            className="p-1.5 rounded-full hover:bg-brand-soft-beige transition-colors"
          >
            <Heart
              className={cn("h-5 w-5 transition-colors", isSaved ? "fill-danger text-danger" : "text-muted-foreground")}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={rating} size="sm" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </span>
          {schedule && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {schedule}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
          {isTrending && <TrendingBadge />}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
    </MithoListItem>
  )
}

// Saved Place List Item
interface SavedPlaceListItemProps {
  name: string
  type: "restaurant" | "food-truck"
  cuisine: string
  rating: number
  imageUrl: string
  savedDate: string
  onRemove?: () => void
  onClick?: () => void
}

export function SavedPlaceListItem({
  name,
  type,
  cuisine,
  rating,
  imageUrl,
  savedDate,
  onRemove,
  onClick,
}: SavedPlaceListItemProps) {
  return (
    <MithoListItem onClick={onClick}>
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-xl overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{cuisine}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            className="p-1.5 rounded-full hover:bg-danger/10 transition-colors"
          >
            <Heart className="h-5 w-5 fill-danger text-danger" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <MithoBadge variant="muted" className="text-[10px]">
            {type === "food-truck" ? (
              <>
                <Truck className="h-2.5 w-2.5 mr-0.5" />
                Food Truck
              </>
            ) : (
              "Restaurant"
            )}
          </MithoBadge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Saved {savedDate}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
    </MithoListItem>
  )
}

// List Container
interface ListContainerProps {
  children: React.ReactNode
  className?: string
}

export function MithoList({ children, className }: ListContainerProps) {
  return <div className={cn("space-y-3", className)}>{children}</div>
}
