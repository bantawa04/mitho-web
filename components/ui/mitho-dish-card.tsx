import { cn } from "@/lib/utils"

interface DishCardProps {
  name: string
  price: string
  imageUrl: string
  description?: string
  isPopular?: boolean
  className?: string
}

export function DishCard({ name, price, imageUrl, description, isPopular, className }: DishCardProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 w-40 sm:w-48 rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isPopular && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-brand-orange text-white text-xs font-semibold rounded-lg">
            Popular
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm line-clamp-1">{name}</h4>
        {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
        <p className="text-brand-orange font-bold text-sm mt-2">{price}</p>
      </div>
    </div>
  )
}
