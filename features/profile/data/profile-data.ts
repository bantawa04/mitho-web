import { currentCustomer, ownedCollections, publicCollections, type CollectionRecord } from "@/features/collections/data/collection-data"

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
  email: string
  username: string
  avatarUrl: string
  mobileNumber: string
  address: string
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
  userId: string
  name: string
  username: string
  avatarUrl: string
  joinedLabel: string
  bio: string
  trustCue: string
  reviewCount: number
  collectionCount: number
  followerCount: number
  isFollowedByCurrentUser: boolean
  citiesExplored: number
  recentPublicReviews: ProfileReviewPreview[]
}

export interface PublicProfileCollectionsPage {
  items: CollectionRecord[]
  totalCount: number
  nextCursor: string | null
  hasMore: boolean
}

export interface PublicCreatorDiscoveryItem {
  userId: string
  name: string
  username: string
  avatarUrl: string
  bio: string
  followerCount: number
  reviewCount: number
  publicCollectionCount: number
  collectionPreviewItems: CollectionRecord[]
}

export interface FollowingProfileListItem {
  userId: string
  name: string
  username: string
  avatarUrl: string
  followerCount: number
  publicCollectionCount: number
  reviewCount: number
}

export interface PublicCreatorDirectoryPage {
  items: PublicCreatorDiscoveryItem[]
  totalCount: number
  nextCursor: string | null
  hasMore: boolean
}

export const mockCustomerProfile: CustomerProfileData = {
  name: "Aarati Shrestha",
  email: "aarati.shrestha@gmail.com",
  username: currentCustomer.username,
  avatarUrl: "/woman-portrait.png",
  mobileNumber: "+977 9800000000",
  address: "Thamel, Kathmandu, Nepal",
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
  "samriddhi-bites": [
    {
      id: "samriddhi-review-1",
      businessName: "Lakeview Pour House",
      location: "Lakeside, Pokhara",
      rating: 5,
      date: "3 days ago",
      excerpt: "One of the easier cafes to recommend when people want a real sit-in stop rather than just caffeine and Wi-Fi.",
      publicHref: "/business/lakeview-pour-house",
    },
  ],
  "prerna-plates": [
    {
      id: "prerna-review-1",
      businessName: "Courtyard Steam House",
      location: "Patan, Lalitpur",
      rating: 4,
      date: "5 days ago",
      excerpt: "The room and pace both make it easier to recommend for dinner plans that need a softer landing.",
      publicHref: "/business/courtyard-steam-house",
    },
  ],
  "roshan-routes": [
    {
      id: "roshan-review-1",
      businessName: "Momo Central",
      location: "New Road, Kathmandu",
      rating: 4,
      date: "1 week ago",
      excerpt: "Still one of the safer budget lunch answers when you need something central and fast.",
      publicHref: "/business/momo-central",
    },
  ],
  "sushant-snacks": [
    {
      id: "sushant-review-1",
      businessName: "Brick Oven Social",
      location: "Lazimpat, Kathmandu",
      rating: 4,
      date: "6 days ago",
      excerpt: "A good after-work fallback when the snack stop starts leaning toward a longer hangout.",
      publicHref: "/business/brick-oven-social",
    },
  ],
}

const publicProfileMetadata: Record<
  string,
  Omit<PublicUserProfileData, "collectionCount" | "recentPublicReviews" | "followerCount" | "isFollowedByCurrentUser">
> = {
  aaratieats: {
    userId: "user-aaratieats",
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
    userId: "user-nabin-eats",
    name: "Nabin Eats",
    username: "nabin-eats",
    avatarUrl: "/thoughtful-man-portrait.png",
    joinedLabel: "Joined January 2025",
    bio: "Usually building tight public food routes for friends who want one strong plan instead of twenty tabs and no dinner decision.",
    trustCue: "Route-builder with practical local notes",
    citiesExplored: 3,
    reviewCount: 8,
  },
  "samriddhi-bites": {
    userId: "user-samriddhi-bites",
    name: "Samriddhi Bites",
    username: "samriddhi-bites",
    avatarUrl: "/woman-portrait.png",
    joinedLabel: "Joined February 2025",
    bio: "Usually comparing calmer cafes, slower breakfast rooms, and the kind of places that are better for staying than rushing.",
    trustCue: "Cafe-first shortlist maker",
    citiesExplored: 2,
    reviewCount: 6,
  },
  "prerna-plates": {
    userId: "user-prerna-plates",
    name: "Prerna Plates",
    username: "prerna-plates",
    avatarUrl: "/woman-portrait.png",
    joinedLabel: "Joined April 2025",
    bio: "Usually building softer dinner shortlists where the room matters almost as much as the food.",
    trustCue: "Room-and-mood curator",
    citiesExplored: 2,
    reviewCount: 5,
  },
  "roshan-routes": {
    userId: "user-roshan-routes",
    name: "Roshan Routes",
    username: "roshan-routes",
    avatarUrl: "/thoughtful-man-portrait.png",
    joinedLabel: "Joined February 2025",
    bio: "Usually keeping practical lunch routes and budget-friendly local picks that still feel worth the detour.",
    trustCue: "Budget route realist",
    citiesExplored: 3,
    reviewCount: 7,
  },
  "sushant-snacks": {
    userId: "user-sushant-snacks",
    name: "Sushant Snacks",
    username: "sushant-snacks",
    avatarUrl: "/thoughtful-man-portrait.png",
    joinedLabel: "Joined March 2025",
    bio: "Usually saving weekday snack detours, quick comfort plates, and after-work stops that do not waste the evening.",
    trustCue: "Weeknight snack scout",
    citiesExplored: 2,
    reviewCount: 4,
  },
}

const followerCountByUsername: Record<string, number> = {
  aaratieats: 128,
  "nabin-eats": 86,
  "samriddhi-bites": 42,
  "prerna-plates": 31,
  "roshan-routes": 27,
  "sushant-snacks": 19,
}

const currentFollowingUsernames = new Set<string>(["nabin-eats", "samriddhi-bites"])

export function getPublicProfileByUsername(username: string): PublicUserProfileData | null {
  const metadata = publicProfileMetadata[username]

  if (!metadata) return null

  const collections = getAllPublicCollectionsForUsername(username)

  return {
    ...metadata,
    collectionCount: collections.length,
    followerCount: followerCountByUsername[username] ?? 0,
    isFollowedByCurrentUser: currentFollowingUsernames.has(username),
    recentPublicReviews: publicProfileReviews[username] ?? [],
  }
}

export function getPublicCreatorDirectoryPage({
  query = "",
  limit = 4,
  cursor,
}: {
  query?: string
  limit?: number
  cursor?: string | null
}): PublicCreatorDirectoryPage {
  const normalizedQuery = query.trim().toLowerCase()
  const allCreators = Object.keys(publicProfileMetadata)
    .map((username) => buildPublicCreatorDiscoveryItem(username))
    .filter((item): item is PublicCreatorDiscoveryItem => item !== null)
    .sort((a, b) => {
      if (b.publicCollectionCount !== a.publicCollectionCount) {
        return b.publicCollectionCount - a.publicCollectionCount
      }

      if (b.reviewCount !== a.reviewCount) {
        return b.reviewCount - a.reviewCount
      }

      return a.name.localeCompare(b.name)
    })

  const matchingCreators = normalizedQuery
    ? allCreators.filter((creator) =>
        [creator.name, creator.username].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
    : allCreators

  const startIndex = cursor ? Number.parseInt(cursor, 10) || 0 : 0
  const items = matchingCreators.slice(startIndex, startIndex + limit)
  const nextIndex = startIndex + limit
  const hasMore = nextIndex < matchingCreators.length

  return {
    items,
    totalCount: matchingCreators.length,
    nextCursor: hasMore ? String(nextIndex) : null,
    hasMore,
  }
}

function getAllPublicCollectionsForUsername(username: string) {
  return [...ownedCollections, ...publicCollections].filter(
    (collection) => collection.visibility === "public" && collection.owner.username === username,
  )
}

function buildPublicCreatorDiscoveryItem(username: string): PublicCreatorDiscoveryItem | null {
  const metadata = publicProfileMetadata[username]

  if (!metadata) return null

  const publicCollections = getAllPublicCollectionsForUsername(username)

  return {
    userId: metadata.userId,
    name: metadata.name,
    username: metadata.username,
    avatarUrl: metadata.avatarUrl,
    bio: metadata.bio,
    followerCount: followerCountByUsername[username] ?? 0,
    reviewCount: metadata.reviewCount,
    publicCollectionCount: publicCollections.length,
    collectionPreviewItems: publicCollections.slice(0, 3),
  }
}

export function followPublicProfile(username: string) {
  if (username === currentCustomer.username) return getPublicProfileByUsername(username)
  if (!publicProfileMetadata[username]) return null

  if (!currentFollowingUsernames.has(username)) {
    currentFollowingUsernames.add(username)
    followerCountByUsername[username] = (followerCountByUsername[username] ?? 0) + 1
  }

  return getPublicProfileByUsername(username)
}

export function unfollowPublicProfile(username: string) {
  if (username === currentCustomer.username) return getPublicProfileByUsername(username)
  if (!publicProfileMetadata[username]) return null

  if (currentFollowingUsernames.has(username)) {
    currentFollowingUsernames.delete(username)
    followerCountByUsername[username] = Math.max(0, (followerCountByUsername[username] ?? 0) - 1)
  }

  return getPublicProfileByUsername(username)
}

export function getFollowingProfiles(): FollowingProfileListItem[] {
  return Array.from(currentFollowingUsernames)
    .map((username) => getPublicProfileByUsername(username))
    .filter((profile): profile is PublicUserProfileData => profile !== null)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((profile) => ({
      userId: profile.userId,
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      followerCount: profile.followerCount,
      publicCollectionCount: profile.collectionCount,
      reviewCount: profile.reviewCount,
    }))
}

export function getPublicProfileCollectionsPage({
  username,
  query = "",
  limit = 12,
  cursor,
}: {
  username: string
  query?: string
  limit?: number
  cursor?: string | null
}): PublicProfileCollectionsPage {
  const normalizedQuery = query.trim().toLowerCase()
  const allCollections = getAllPublicCollectionsForUsername(username)

  const matchingCollections = normalizedQuery
    ? allCollections.filter((collection) =>
        [
          collection.title,
          collection.description ?? "",
          ...collection.items.map((item) => item.businessName),
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
    : allCollections

  const startIndex = cursor ? Number.parseInt(cursor, 10) || 0 : 0
  const items = matchingCollections.slice(startIndex, startIndex + limit)
  const nextIndex = startIndex + limit
  const hasMore = nextIndex < matchingCollections.length

  return {
    items,
    totalCount: matchingCollections.length,
    nextCursor: hasMore ? String(nextIndex) : null,
    hasMore,
  }
}
