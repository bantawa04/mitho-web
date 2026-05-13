export interface ProfileReviewPreview {
  id: string
  businessName: string
  location: string
  rating: number
  date: string
  excerpt: string
  publicHref: string
}

export interface SavedPlacePreview {
  id: string
  name: string
  location: string
  cuisine: string
  imageUrl: string
  savedDate: string
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
  savedCount: number
  citiesExplored: number
  recentReviews: ProfileReviewPreview[]
  savedPlaces: SavedPlacePreview[]
  businessContext: ProfileBusinessContext
}

export const mockCustomerProfile: CustomerProfileData = {
  name: "Aarati Shrestha",
  avatarUrl: "/woman-portrait.png",
  joinedLabel: "Joined March 2025",
  bio: "Usually chasing strong momo plates, calmer brunch spots, and the kinds of places worth sending to friends without a long explanation.",
  trustCue: "12 local reviews and counting",
  reviewCount: 12,
  savedCount: 28,
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
  savedPlaces: [
    {
      id: "saved-1",
      name: "Thakali Kitchen",
      location: "Lakeside, Pokhara",
      cuisine: "Local cuisine",
      imageUrl: "/dal-bhat-nepali-meal-set.jpg",
      savedDate: "Saved 3 days ago",
      publicHref: "/business/thakali-kitchen",
    },
    {
      id: "saved-2",
      name: "Himalayan Flavors",
      location: "Thamel, Kathmandu",
      cuisine: "Nepali · Tibetan",
      imageUrl: "/steamed-momo-nepali-dumplings.jpg",
      savedDate: "Saved last week",
      publicHref: "/business/himalayan-flavors",
    },
    {
      id: "saved-3",
      name: "Patan Courtyard Kitchen",
      location: "Mangal Bazaar, Lalitpur",
      cuisine: "Newari · Casual dinner",
      imageUrl: "/restaurant-interior-cozy.jpg",
      savedDate: "Saved 2 weeks ago",
      publicHref: "/business/demo-empty",
    },
    {
      id: "saved-4",
      name: "Momo Central",
      location: "New Road, Kathmandu",
      cuisine: "Street food · Momos",
      imageUrl: "/momos-dumplings.jpg",
      savedDate: "Saved earlier this month",
      publicHref: "/business/momo-central",
    },
  ],
  businessContext: {
    status: "approved",
    managedCount: 1,
  },
}
