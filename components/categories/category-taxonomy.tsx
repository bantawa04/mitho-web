import { Building2, Coffee, MapPin, Soup, Utensils, type LucideIcon } from "lucide-react"

export type CategorySlug = "restaurants" | "street-food" | "cafes" | "local-cuisine" | "fine-dining"
type CategoryIconKey = "restaurant" | "streetFood" | "cafe" | "local" | "fineDining"

export interface CategoryMetadata {
  slug: CategorySlug
  label: string
  shortLabel: string
  iconKey: CategoryIconKey
  heroTitle: string
  heroDescription: string
  editorialNote: string
  seoIntro: string
  accentImage: string
  trustCues: string[]
  quickFilters: string[]
  relatedSlugs: CategorySlug[]
}

const CATEGORY_ICON_MAP: Record<CategoryIconKey, LucideIcon> = {
  restaurant: Utensils,
  streetFood: Soup,
  cafe: Coffee,
  local: MapPin,
  fineDining: Building2,
}

export const CATEGORY_METADATA: CategoryMetadata[] = [
  {
    slug: "restaurants",
    label: "Restaurants",
    shortLabel: "Restaurants",
    iconKey: "restaurant",
    heroTitle: "Reliable full meals when tonight needs a proper table.",
    heroDescription:
      "A tighter guide to restaurants people return to for dependable plates, smoother service, and fewer wasted dinner decisions.",
    editorialNote:
      "People usually come here when they want a sit-down meal that feels worth the ride, not just a convenient default.",
    seoIntro:
      "Discover restaurant listings in Nepal with stronger local trust notes, standout dishes, and neighborhoods worth heading to.",
    accentImage: "/nepali-restaurant-thakali-food.jpg",
    trustCues: ["Best for full dinners", "Useful when the group needs a dependable table", "Good mix of classic and higher-effort picks"],
    quickFilters: ["family dinner", "group-friendly", "worth the ride"],
    relatedSlugs: ["local-cuisine", "fine-dining", "street-food"],
  },
  {
    slug: "street-food",
    label: "Street Food",
    shortLabel: "Street food",
    iconKey: "streetFood",
    heroTitle: "Fast local plates with enough character to justify the stop.",
    heroDescription:
      "For nights when speed matters, but you still want something with real flavor, local identity, and low regret.",
    editorialNote:
      "This is where people look for late-evening fixes, trusted momos, and quick plates that still feel rooted in place.",
    seoIntro:
      "Explore street food spots in Nepal with standout dishes, fast useful notes, and neighborhood context that helps you choose quickly.",
    accentImage: "/nepali-momo-dumplings-restaurant.jpg",
    trustCues: ["Best for fast dinners", "Good when the craving is specific", "Useful for late-evening local picks"],
    quickFilters: ["momos", "late night", "quick dinner"],
    relatedSlugs: ["local-cuisine", "restaurants", "cafes"],
  },
  {
    slug: "cafes",
    label: "Cafes",
    shortLabel: "Cafes",
    iconKey: "cafe",
    heroTitle: "Cafes worth staying in, not just passing through.",
    heroDescription:
      "A calmer shortlist for coffee, lighter meals, and places where the setting matters but the food still has to earn its place.",
    editorialNote:
      "People usually browse here when they want a useful meeting spot, a quieter work table, or a slower afternoon pick.",
    seoIntro:
      "Browse cafe listings in Nepal with mood, neighborhood, and trust notes that help separate useful cafe picks from generic chains.",
    accentImage: "/lakeside-cafe-pokhara-nepal.jpg",
    trustCues: ["Best for slower afternoons", "Useful for coffee and conversation", "Good when mood matters as much as speed"],
    quickFilters: ["quiet cafe", "coffee stop", "work-friendly"],
    relatedSlugs: ["restaurants", "fine-dining", "street-food"],
  },
  {
    slug: "local-cuisine",
    label: "Local Cuisine",
    shortLabel: "Local",
    iconKey: "local",
    heroTitle: "Neighborhood dishes that still feel rooted in place.",
    heroDescription:
      "A category for local plates, stronger regional identity, and spots where the flavor matters more than generic convenience.",
    editorialNote:
      "People come here when they want something recognizably Nepali, more specific than 'restaurant,' and better than a tourist-safe guess.",
    seoIntro:
      "Find local cuisine listings in Nepal with trusted dishes, cultural context, and neighborhood-specific recommendations.",
    accentImage: "/newari-traditional-food-nepal.jpg",
    trustCues: ["Best for local flavor", "Useful when visitors want something rooted", "Stronger neighborhood personality than generic dining"],
    quickFilters: ["newari", "traditional plate", "local favorite"],
    relatedSlugs: ["street-food", "restaurants", "fine-dining"],
  },
  {
    slug: "fine-dining",
    label: "Fine Dining",
    shortLabel: "Fine dining",
    iconKey: "fineDining",
    heroTitle: "Special-occasion places where the setting earns its keep.",
    heroDescription:
      "A more considered shortlist for dates, visiting family, and evenings when you need the room, service, and pacing to carry weight.",
    editorialNote:
      "People usually browse here when the meal needs atmosphere as much as flavor, and a casual fallback will not cut it.",
    seoIntro:
      "Explore fine dining listings in Nepal with local trust notes, standout dishes, and guidance for more intentional evenings out.",
    accentImage: "/nepali-restaurant-traditional-interior.jpg",
    trustCues: ["Best for special occasions", "Useful when atmosphere matters", "Good for guests, dates, and slower evenings"],
    quickFilters: ["date night", "special dinner", "visitors"],
    relatedSlugs: ["restaurants", "local-cuisine", "cafes"],
  },
]

export const CATEGORY_OPTIONS = CATEGORY_METADATA.map(({ slug, label }) => ({ value: slug, label }))

export function getCategoryBySlug(slug: string) {
  return CATEGORY_METADATA.find((category) => category.slug === slug)
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORY_METADATA.some((category) => category.slug === slug)
}

export function getCategoryIcon(iconKey: CategoryIconKey, className = "h-6 w-6") {
  const Icon = CATEGORY_ICON_MAP[iconKey]
  return <Icon className={className} />
}
