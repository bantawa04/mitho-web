"use client"

import * as React from "react"
import { MapPin, Clock, Heart, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { MithoBadge, OpenNowBadge, ClosedBadge, TopRatedBadge, TrendingBadge } from "./mitho-badge"
import { StarRating } from "@/components/ui/mitho-rating"

// Base Card Components
const MithoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg overflow-hidden",
        className,
      )}
      {...props}
    />
  ),
)
MithoCard.displayName = "MithoCard"

const MithoCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
  ),
)
MithoCardHeader.displayName = "MithoCardHeader"

const MithoCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-bold leading-none tracking-tight", className)} {...props} />
  ),
)
MithoCardTitle.displayName = "MithoCardTitle"

const MithoCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
MithoCardDescription.displayName = "MithoCardDescription"

const MithoCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />,
)
MithoCardContent.displayName = "MithoCardContent"

const MithoCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  ),
)
MithoCardFooter.displayName = "MithoCardFooter"

interface TextCardProps {
  title: string
  description: string
  className?: string
}

function TextCard({ title, description, className }: TextCardProps) {
  return (
    <MithoCard className={cn("hover:border-brand-orange/30", className)}>
      <MithoCardHeader>
        <MithoCardTitle>{title}</MithoCardTitle>
        <MithoCardDescription className="mt-2 leading-relaxed">{description}</MithoCardDescription>
      </MithoCardHeader>
    </MithoCard>
  )
}

interface IconCardProps {
  icon: React.ReactNode
  title: string
  description: string
  iconBgColor?: string
  className?: string
}

function IconCard({ icon, title, description, iconBgColor = "bg-brand-orange/10", className }: IconCardProps) {
  return (
    <MithoCard className={cn("hover:border-brand-orange/30 transition-all duration-200", className)}>
      <MithoCardHeader>
        <div
          className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-brand-orange", iconBgColor)}
        >
          {icon}
        </div>
        <MithoCardTitle className="text-lg">{title}</MithoCardTitle>
        <MithoCardDescription className="mt-1 leading-relaxed">{description}</MithoCardDescription>
      </MithoCardHeader>
    </MithoCard>
  )
}

interface ImageCardProps {
  imageUrl: string
  imageAlt: string
  title: string
  description: string
  aspectRatio?: "square" | "video" | "wide"
  className?: string
}

function ImageCard({ imageUrl, imageAlt, title, description, aspectRatio = "video", className }: ImageCardProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[2/1]",
  }

  return (
    <MithoCard className={cn("cursor-pointer hover:border-brand-orange/30", className)}>
      <div className={cn("overflow-hidden group/image", aspectClasses[aspectRatio])}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
        />
      </div>
      <MithoCardHeader>
        <MithoCardTitle>{title}</MithoCardTitle>
        <MithoCardDescription className="mt-1 leading-relaxed line-clamp-2">{description}</MithoCardDescription>
      </MithoCardHeader>
    </MithoCard>
  )
}

// Restaurant Card
interface RestaurantCardProps {
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
}

function RestaurantCard({
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
}: RestaurantCardProps) {
  return (
    <MithoCard className="cursor-pointer hover:border-brand-orange/30">
      <div className="relative aspect-[4/3] overflow-hidden group/image">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
          {isTopRated && <TopRatedBadge />}
          {isTrending && <TrendingBadge />}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSave?.()
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm",
            "transition-all duration-200",
            "hover:bg-white hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
            "active:scale-95",
          )}
          aria-label={isSaved ? "Remove from saved" : "Save restaurant"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isSaved ? "fill-brand-orange text-brand-orange" : "text-gray-600 hover:text-brand-orange",
            )}
          />
        </button>
      </div>
      <MithoCardHeader>
        <div className="flex items-start justify-between gap-2">
          <MithoCardTitle className="line-clamp-1">{name}</MithoCardTitle>
          <span className="text-sm font-medium text-muted-foreground">{priceRange}</span>
        </div>
        <MithoCardDescription>{cuisine}</MithoCardDescription>
      </MithoCardHeader>
      <MithoCardContent>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating} size="sm" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          {distance && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {distance}
            </span>
          )}
        </div>
      </MithoCardContent>
    </MithoCard>
  )
}

// Food Truck Card
interface FoodTruckCardProps {
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
}

function FoodTruckCard({
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
}: FoodTruckCardProps) {
  return (
    <MithoCard className="cursor-pointer hover:border-brand-orange/30">
      <div className="relative aspect-[4/3] overflow-hidden group/image">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <MithoBadge variant="muted" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Food Truck
          </MithoBadge>
          {isOpen ? <OpenNowBadge /> : <ClosedBadge />}
          {isTrending && <TrendingBadge />}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSave?.()
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full",
            "bg-white/90 backdrop-blur-sm",
            "transition-all duration-200",
            "hover:bg-white hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2",
            "active:scale-95",
          )}
          aria-label={isSaved ? "Remove from saved" : "Save food truck"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-200",
              isSaved ? "fill-brand-orange text-brand-orange" : "text-gray-600 hover:text-brand-orange",
            )}
          />
        </button>
      </div>
      <MithoCardHeader>
        <MithoCardTitle className="line-clamp-1">{name}</MithoCardTitle>
        <MithoCardDescription>{cuisine}</MithoCardDescription>
      </MithoCardHeader>
      <MithoCardContent>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={rating} size="sm" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          {schedule && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {schedule}
            </span>
          )}
        </div>
      </MithoCardContent>
    </MithoCard>
  )
}

// Review Card
interface ReviewCardProps {
  author: string
  authorImage: string
  rating: number
  date: string
  content: string
  helpful?: number
}

function ReviewCard({ author, authorImage, rating, date, content, helpful = 0 }: ReviewCardProps) {
  return (
    <MithoCard className="hover:shadow-sm">
      <MithoCardHeader>
        <div className="flex items-center gap-3">
          <img src={authorImage || "/placeholder.svg"} alt={author} className="h-10 w-10 rounded-full object-cover" />
          <div className="flex-1">
            <MithoCardTitle className="text-base">{author}</MithoCardTitle>
            <MithoCardDescription>{date}</MithoCardDescription>
          </div>
          <StarRating rating={rating} size="sm" />
        </div>
      </MithoCardHeader>
      <MithoCardContent>
        <p className="text-sm text-foreground leading-relaxed">{content}</p>
      </MithoCardContent>
      <MithoCardFooter>
        <span className="text-sm text-muted-foreground">{helpful > 0 && `${helpful} people found this helpful`}</span>
      </MithoCardFooter>
    </MithoCard>
  )
}

// User Profile Card
interface UserProfileCardProps {
  name: string
  avatar: string
  reviewCount: number
  savedPlaces: number
  joinedDate: string
  bio?: string
}

function UserProfileCard({ name, avatar, reviewCount, savedPlaces, joinedDate, bio }: UserProfileCardProps) {
  return (
    <MithoCard>
      <MithoCardHeader className="items-center text-center">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="h-20 w-20 rounded-full object-cover border-4 border-brand-soft-beige"
        />
        <MithoCardTitle className="text-xl mt-3">{name}</MithoCardTitle>
        <MithoCardDescription>Joined {joinedDate}</MithoCardDescription>
      </MithoCardHeader>
      <MithoCardContent>
        {bio && <p className="text-sm text-center text-muted-foreground mb-4">{bio}</p>}
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <span className="block text-2xl font-bold text-brand-orange">{reviewCount}</span>
            <span className="text-sm text-muted-foreground">Reviews</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-brand-deep-green">{savedPlaces}</span>
            <span className="text-sm text-muted-foreground">Saved</span>
          </div>
        </div>
      </MithoCardContent>
    </MithoCard>
  )
}

export {
  MithoCard,
  MithoCardHeader,
  MithoCardTitle,
  MithoCardDescription,
  MithoCardContent,
  MithoCardFooter,
  TextCard,
  IconCard,
  ImageCard,
  RestaurantCard,
  FoodTruckCard,
  ReviewCard,
  UserProfileCard,
}
