"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: React.ReactNode
  className?: string
  showArrows?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function MithoCarousel({
  children,
  className,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: CarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
    }
  }, [])

  React.useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    container?.addEventListener("scroll", checkScrollability)
    window.addEventListener("resize", checkScrollability)
    return () => {
      container?.removeEventListener("scroll", checkScrollability)
      window.removeEventListener("resize", checkScrollability)
    }
  }, [checkScrollability])

  React.useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      const container = scrollContainerRef.current
      if (container) {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          container.scrollBy({ left: 320, behavior: "smooth" })
        }
      }
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === "left" ? -320 : 320
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className={cn("relative group/carousel px-6", className)}>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 snap-x snap-mandatory [&>*]:snap-start"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* Edge fade gradients — signal more content without needing arrows */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-6 w-10 pointer-events-none z-[5] transition-opacity duration-300",
          "bg-gradient-to-r from-background to-transparent",
          !canScrollLeft && "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 right-6 w-16 pointer-events-none z-[5] transition-opacity duration-300",
          "bg-gradient-to-l from-background to-transparent",
          !canScrollRight && "opacity-0",
        )}
      />

      {showArrows && (
        <>
          <button
            type="button"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-background border-2 border-border shadow-lg",
              "opacity-0 group-hover/carousel:opacity-100 transition-all duration-200",
              "hover:bg-brand-deep-green hover:border-brand-deep-green",
              "focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
              "group/btn",
              !canScrollLeft && "!opacity-0 pointer-events-none",
            )}
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover/btn:text-white transition-colors" />
          </button>

          <button
            type="button"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-background border-2 border-border shadow-lg",
              "opacity-0 group-hover/carousel:opacity-100 transition-all duration-200",
              "hover:bg-brand-deep-green hover:border-brand-deep-green",
              "focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2",
              "group/btn",
              !canScrollRight && "!opacity-0 pointer-events-none",
            )}
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover/btn:text-white transition-colors" />
          </button>
        </>
      )}
    </div>
  )
}
