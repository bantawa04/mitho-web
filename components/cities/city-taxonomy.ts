import type { CategorySlug } from "@/components/categories/category-taxonomy"

export type CitySlug = "kathmandu" | "pokhara" | "lalitpur" | "bhaktapur"
export type StateLabel = "Bagmati Province" | "Gandaki Province"

export interface CityMetadata {
  slug: CitySlug
  label: string
  state: StateLabel
  center: {
    lat: number
    lng: number
  }
  heroTitle: string
  heroDescription: string
  editorialNote: string
  seoIntro: string
  accentImage: string
  trustCues: string[]
  quickFilters: string[]
  featuredNeighborhoods: string[]
  featuredCategorySlugs: CategorySlug[]
  relatedCitySlugs: CitySlug[]
}

export const CITY_METADATA: CityMetadata[] = [
  {
    slug: "kathmandu",
    label: "Kathmandu",
    state: "Bagmati Province",
    center: { lat: 27.7172, lng: 85.324 },
    heroTitle: "A city for dependable dinners, late-evening fixes, and food plans that start fast.",
    heroDescription:
      "Kathmandu works best when you need range: fuller restaurant meals, quick momo decisions, and enough neighborhood variety to avoid defaulting to generic picks.",
    editorialNote:
      "People usually browse Kathmandu when the group has mixed cravings and the real challenge is finding something dependable without losing time to too many options.",
    seoIntro:
      "Browse food listings in Kathmandu with stronger local trust notes, neighborhood context, and category paths that help you choose faster.",
    accentImage: "/nepali-restaurant-thakali-food.jpg",
    trustCues: ["Best for dependable dinners", "Strong for quick momo and late-evening choices", "Useful when the group has mixed cravings"],
    quickFilters: ["late dinner", "buff momo", "family dinner"],
    featuredNeighborhoods: ["Thamel", "New Road", "Dillibazar"],
    featuredCategorySlugs: ["restaurants", "street-food", "fine-dining"],
    relatedCitySlugs: ["lalitpur", "bhaktapur", "pokhara"],
  },
  {
    slug: "pokhara",
    label: "Pokhara",
    state: "Gandaki Province",
    center: { lat: 28.2096, lng: 83.9856 },
    heroTitle: "A calmer city for slower cafe picks, longer hangs, and meals with a little breathing room.",
    heroDescription:
      "Pokhara is useful when the setting matters alongside the food, especially for cafes, quieter afternoons, and stops that should feel more relaxed than rushed.",
    editorialNote:
      "People usually browse Pokhara when they want something less compressed than Kathmandu: more room to sit, meet, and let the mood matter a bit.",
    seoIntro:
      "Explore food and cafe listings in Pokhara with neighborhood context, standout dishes, and local notes that help separate scenic from actually useful.",
    accentImage: "/lakeside-cafe-pokhara-nepal.jpg",
    trustCues: ["Best for cafes and slower afternoons", "Useful when the setting matters", "Good for calmer meetings and lighter plans"],
    quickFilters: ["quiet cafe", "coffee stop", "slow afternoon"],
    featuredNeighborhoods: ["Lakeside"],
    featuredCategorySlugs: ["cafes", "restaurants", "fine-dining"],
    relatedCitySlugs: ["kathmandu", "lalitpur", "bhaktapur"],
  },
  {
    slug: "lalitpur",
    label: "Lalitpur",
    state: "Bagmati Province",
    center: { lat: 27.6644, lng: 85.3188 },
    heroTitle: "A strong city for local comfort, cafes that linger, and quick meals with more neighborhood character.",
    heroDescription:
      "Lalitpur gives you a more compact rhythm: useful coffee stops, stronger local comfort picks, and places that feel grounded in area identity instead of city-center noise.",
    editorialNote:
      "People usually browse Lalitpur when they want something that feels local and easy to return to, whether that is a cafe sit, a grilled dinner, or a quick comfort plate.",
    seoIntro:
      "Discover food listings in Lalitpur with neighborhood-aware picks, local comfort dishes, and city-specific trust notes.",
    accentImage: "/nepali-sekuwa-bbq-grilled-meat.jpg",
    trustCues: ["Best for local comfort and repeatable picks", "Strong for cafes and neighborhood hangs", "Useful when you want less city-center noise"],
    quickFilters: ["sekuwa", "work-friendly cafe", "local comfort"],
    featuredNeighborhoods: ["Patan", "Patan Dhoka", "Jhamsikhel"],
    featuredCategorySlugs: ["street-food", "cafes", "local-cuisine"],
    relatedCitySlugs: ["kathmandu", "bhaktapur", "pokhara"],
  },
  {
    slug: "bhaktapur",
    label: "Bhaktapur",
    state: "Bagmati Province",
    center: { lat: 27.671, lng: 85.4298 },
    heroTitle: "A smaller city for stronger local identity, slower meals, and dishes that feel rooted in place.",
    heroDescription:
      "Bhaktapur is most useful when the point of the meal is flavor and locality, not just convenience or quick turnover.",
    editorialNote:
      "People usually browse Bhaktapur when they want a more rooted local-cuisine decision and are willing to trade a little convenience for stronger character.",
    seoIntro:
      "Browse food listings in Bhaktapur with local-cuisine context, trusted dishes, and more place-specific recommendations.",
    accentImage: "/newari-traditional-food-nepal.jpg",
    trustCues: ["Best for local and traditional flavor", "Useful when place matters as much as speed", "Good for slower, more rooted picks"],
    quickFilters: ["newari", "traditional plate", "worth the ride"],
    featuredNeighborhoods: ["Durbar Area"],
    featuredCategorySlugs: ["local-cuisine", "restaurants", "street-food"],
    relatedCitySlugs: ["lalitpur", "kathmandu", "pokhara"],
  },
]

export const CITY_OPTIONS = CITY_METADATA.map(({ label }) => label)
export const STATE_OPTIONS = Array.from(new Set(CITY_METADATA.map(({ state }) => state)))

export function getCityBySlug(slug: string) {
  return CITY_METADATA.find((city) => city.slug === slug)
}

export function getCityByLabel(label: string) {
  return CITY_METADATA.find((city) => city.label === label)
}

export function isCitySlug(slug: string): slug is CitySlug {
  return CITY_METADATA.some((city) => city.slug === slug)
}
