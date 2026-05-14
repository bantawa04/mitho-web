import { ownedCollections } from "@/components/collections/collection-data"

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

export const mockCustomerProfile: CustomerProfileData = {
  name: "Aarati Shrestha",
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
