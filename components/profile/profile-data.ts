import { currentCustomer, ownedCollections, publicCollections } from "@/components/collections/collection-data"

export interface ProfileReviewPreview {
  id: string
  businessName: string
  location: string
  rating: number
  date: string
  excerpt: string
  publicHref: string
}

export interface ProfileBusinessContext {
  status: "approved" | "pending" | "none"
  managedCount?: number
  pendingLabel?: string
}

export interface CustomerProfileData {
  name: string
  username: string
  avatarUrl: string
  joinedLabel: string
  bio: string
  trustCue: string
  reviewCount: number
  collectionCount: number
  placeCountAcrossCollections: number
  citiesExplored: number
  recentReviews: ProfileReviewPreview[]
  businessContext: ProfileBusinessContext
}

export interface PublicUserProfileData {
  name: string
  username: string
  avatarUrl: string
  joinedLabel: string
  bio: string
  trustCue: string
  reviewCount: number
  collectionCount: number
  citiesExplored: number
  publicCollections: typeof ownedCollections
  recentPublicReviews: ProfileReviewPreview[]
}

export const mockCustomerProfile: CustomerProfileData = {
  name: "Aarati Shrestha",
  username: currentCustomer.username,
  avatarUrl: "/woman-portrait.png",
  joinedLabel: "Joined March 2025",
  bio: "Usually chasing strong momo plates, calmer brunch spots, and the kinds of places worth sending to friends without a long explanation.",
  trustCue: "12 local reviews and counting",
  reviewCount: 12,
  collectionCount: ownedCollections.length,
  placeCountAcrossCollections: ownedCollections.reduce((total, collection) => total + collection.items.length, 0),
  citiesExplored: 4,
  recentReviews: [
    {
      id: "review-1",
      businessName: "Himalayan Flavors",
      location: "Thamel, Kathmandu",
      rating: 5,
      date: "2 days ago",
      excerpt: "The steamed momo basket still feels like the safest first order here, and the owner reply was surprisingly thoughtful.",
      publicHref: "/business/himalayan-flavors",
    },
    {
      id: "review-2",
      businessName: "Patan Courtyard Kitchen",
      location: "Mangal Bazaar, Lalitpur",
      rating: 4,
      date: "1 week ago",
      excerpt: "A good place for taking visiting friends when you want Newari notes without the room feeling too formal or too loud.",
      publicHref: "/business/demo-empty",
    },
    {
      id: "review-3",
      businessName: "Momo Central",
      location: "New Road, Kathmandu",
      rating: 4,
      date: "2 weeks ago",
      excerpt: "Best when you want a quick plate near the center and care more about the chutney than the room itself.",
      publicHref: "/business/momo-central",
    },
  ],
  businessContext: {
    status: "approved",
    managedCount: 1,
  },
}

const publicProfileReviews: Record<string, ProfileReviewPreview[]> = {
  aaratieats: mockCustomerProfile.recentReviews,
  "nabin-eats": [
    {
      id: "nabin-review-1",
      businessName: "Courtyard Steam House",
      location: "Patan, Lalitpur",
      rating: 5,
      date: "4 days ago",
      excerpt: "The chutney variety makes this an easy recommendation when you want a slower momo stop rather than a quick street-side plate.",
      publicHref: "/business/courtyard-steam-house",
    },
    {
      id: "nabin-review-2",
      businessName: "Himalayan Flavors",
      location: "Thamel, Kathmandu",
      rating: 4,
      date: "2 weeks ago",
      excerpt: "Still one of the more reliable sit-down choices when a group wants Tibetan comfort food without overthinking the order.",
      publicHref: "/business/himalayan-flavors",
    },
  ],
}

const publicProfileMetadata = {
  aaratieats: {
    name: mockCustomerProfile.name,
    username: mockCustomerProfile.username,
    avatarUrl: mockCustomerProfile.avatarUrl,
    joinedLabel: mockCustomerProfile.joinedLabel,
    bio: mockCustomerProfile.bio,
    trustCue: mockCustomerProfile.trustCue,
    citiesExplored: mockCustomerProfile.citiesExplored,
    reviewCount: mockCustomerProfile.reviewCount,
  },
  "nabin-eats": {
    name: "Nabin Eats",
    username: "nabin-eats",
    avatarUrl: "/thoughtful-man-portrait.png",
    joinedLabel: "Joined January 2025",
    bio: "Usually building tight public food routes for friends who want one strong plan instead of twenty tabs and no dinner decision.",
    trustCue: "Route-builder with practical local notes",
    citiesExplored: 3,
    reviewCount: 8,
  },
} satisfies Record<
  string,
  Omit<PublicUserProfileData, "collectionCount" | "publicCollections" | "recentPublicReviews">
>

export function getPublicProfileByUsername(username: string): PublicUserProfileData | null {
  const metadata = publicProfileMetadata[username]

  if (!metadata) return null

  const collections = [...ownedCollections, ...publicCollections].filter(
    (collection) => collection.visibility === "public" && collection.owner.username === username,
  )

  return {
    ...metadata,
    collectionCount: collections.length,
    publicCollections: collections,
    recentPublicReviews: publicProfileReviews[username] ?? [],
  }
}
