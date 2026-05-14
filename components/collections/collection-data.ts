export type CollectionVisibility = "private" | "public"

export interface CollectionOwner {
  name: string
  username: string
  avatarUrl: string
}

export interface CollectionItem {
  id: string
  businessName: string
  location: string
  category: string
  note: string
  imageUrl: string
  publicHref: string
}

export interface CollectionCandidate {
  id: string
  businessName: string
  location: string
  category: string
  note: string
  imageUrl: string
  publicHref: string
}

export interface CollectionProvenance {
  copiedFromCollectionId: string
  copiedFromUser: string
  copiedAt: string
  sourceTitle: string
}

export interface CollectionRecord {
  id: string
  title: string
  description?: string
  visibility: CollectionVisibility
  updatedLabel: string
  owner: CollectionOwner
  items: CollectionItem[]
  isDefault?: boolean
  provenance?: CollectionProvenance
}

export const currentCustomer: CollectionOwner = {
  name: "Aarati Shrestha",
  username: "aaratieats",
  avatarUrl: "/woman-portrait.png",
}

const publicCreator: CollectionOwner = {
  name: "Nabin Eats",
  username: "nabin-eats",
  avatarUrl: "/thoughtful-man-portrait.png",
}

export const ownedCollections: CollectionRecord[] = [
  {
    id: "saved",
    title: "Saved",
    description: "The default private bucket for places you want to keep close before you sort them into more intentional lists.",
    visibility: "private",
    updatedLabel: "Updated today",
    owner: currentCustomer,
    isDefault: true,
    items: [
      {
        id: "saved-item-1",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Dependable stop when you want the momo plate first.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: "/business/himalayan-flavors",
      },
      {
        id: "saved-item-2",
        businessName: "Thakali Kitchen",
        location: "Lakeside, Pokhara",
        category: "Local cuisine",
        note: "Worth revisiting for the dal bhat and the calm lunch rhythm.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: "/business/thakali-kitchen",
      },
      {
        id: "saved-item-3",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari",
        note: "Feels like a stronger dinner recommendation than a quick snack stop.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: "/business/demo-empty",
      },
      {
        id: "saved-item-4",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Shortlist for fast dumplings near the center.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: "/business/momo-central",
      },
    ],
  },
  {
    id: "best-pizza-places",
    title: "Best Pizza Places",
    description: "A shortlist of pizza spots I would actually send friends to when they ask for something reliable instead of flashy.",
    visibility: "public",
    updatedLabel: "Updated 3 days ago",
    owner: currentCustomer,
    items: [
      {
        id: "pizza-1",
        businessName: "Firewood Slice House",
        location: "Jhamsikhel, Lalitpur",
        category: "Pizza · Casual dinner",
        note: "Good balance of crust and room vibe for small group dinners.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: "/business/firewood-slice-house",
      },
      {
        id: "pizza-2",
        businessName: "Brick Oven Social",
        location: "Lazimpat, Kathmandu",
        category: "Pizza · Hangout",
        note: "Better for longer hangs than quick takeaway.",
        imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
        publicHref: "/business/brick-oven-social",
      },
      {
        id: "pizza-3",
        businessName: "Rooftop Pie Corner",
        location: "Lakeside, Pokhara",
        category: "Pizza · View stop",
        note: "A good option when the group wants something easier than local plates.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: "/business/rooftop-pie-corner",
      },
    ],
  },
  {
    id: "my-food-bucket-list",
    title: "My Food Bucket List",
    description: "Places I still want to try properly before I keep recommending them to anyone else.",
    visibility: "private",
    updatedLabel: "Updated last week",
    owner: currentCustomer,
    items: [
      {
        id: "bucket-1",
        businessName: "Thamel Noodle Room",
        location: "Thamel, Kathmandu",
        category: "Noodles · Late dinner",
        note: "On the list for a colder evening when thukpa sounds right.",
        imageUrl: "/thukpa-tibetan-noodle-soup.jpg",
        publicHref: "/business/thamel-noodle-room",
      },
      {
        id: "bucket-2",
        businessName: "Bhaktapur Juju Dhau Stop",
        location: "Bhaktapur Durbar Square, Bhaktapur",
        category: "Dessert · Local stop",
        note: "Want to compare it properly instead of relying on one rushed visit.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: "/business/bhaktapur-juju-dhau-stop",
      },
    ],
  },
  {
    id: "kathmandu-momo-crawl-copy",
    title: "Kathmandu Momo Crawl Copy",
    description: "Copied from a public collection and now acting as my own planning version for a weekend route.",
    visibility: "private",
    updatedLabel: "Copied yesterday",
    owner: currentCustomer,
    provenance: {
      copiedFromCollectionId: "kathmandu-momo-crawl",
      copiedFromUser: publicCreator.username,
      copiedAt: "Copied yesterday",
      sourceTitle: "Kathmandu Momo Crawl",
    },
    items: [
      {
        id: "copy-1",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Likely the first stop because it is easiest to fit into a central walk.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: "/business/momo-central",
      },
      {
        id: "copy-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Worth keeping on the route for a more settled sit-down plate.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: "/business/himalayan-flavors",
      },
    ],
  },
]

export const publicCollections: CollectionRecord[] = [
  {
    id: "kathmandu-momo-crawl",
    title: "Kathmandu Momo Crawl",
    description: "A public shortlist for visitors or locals who want a quick momo-focused route without wasting a whole evening deciding.",
    visibility: "public",
    updatedLabel: "Updated 5 days ago",
    owner: publicCreator,
    items: [
      {
        id: "public-momo-1",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Good first stop because it is quick, central, and easy to compare against later plates.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: "/business/momo-central",
      },
      {
        id: "public-momo-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "The sit-down anchor when you want one stronger plate in the middle of the crawl.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: "/business/himalayan-flavors",
      },
      {
        id: "public-momo-3",
        businessName: "Courtyard Steam House",
        location: "Patan, Lalitpur",
        category: "Momos · Cozy room",
        note: "Better when the group wants to slow down and compare chutneys carefully.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: "/business/courtyard-steam-house",
      },
    ],
  },
]

export function createCollectionId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getCollectionById(id: string) {
  return ownedCollections.find((collection) => collection.id === id) ?? null
}

export function getPublicCollectionByUsernameAndId(username: string, id: string) {
  return (
    publicCollections.find((collection) => collection.owner.username === username && collection.id === id) ??
    ownedCollections.find((collection) => collection.visibility === "public" && collection.owner.username === username && collection.id === id) ??
    null
  )
}

export function buildDraftCollection({
  id,
  title,
  description,
  visibility,
}: {
  id: string
  title: string
  description?: string
  visibility: CollectionVisibility
}): CollectionRecord {
  return {
    id,
    title,
    description,
    visibility,
    updatedLabel: "Created just now",
    owner: currentCustomer,
    items: [],
  }
}

export function buildCopiedCollection(source: CollectionRecord): CollectionRecord {
  return {
    id: `${source.id}-copy`,
    title: `${source.title} Copy`,
    description: source.description,
    visibility: "private",
    updatedLabel: "Copied just now",
    owner: currentCustomer,
    provenance: {
      copiedFromCollectionId: source.id,
      copiedFromUser: source.owner.username,
      copiedAt: "Copied just now",
      sourceTitle: source.title,
    },
    items: source.items,
  }
}

export function getCollectionCoverImages(collection: CollectionRecord) {
  return collection.items.slice(0, 3).map((item) => item.imageUrl)
}

export function getCollectionPlaceCount(collection: CollectionRecord) {
  return collection.items.length
}

export function searchOwnedCollections(collections: CollectionRecord[], query: string) {
  const normalized = query.trim().toLowerCase()

  const results = normalized
    ? collections.filter((collection) =>
        [collection.title, collection.description ?? ""].some((value) => value.toLowerCase().includes(normalized)),
      )
    : collections

  return [...results].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (!a.isDefault && b.isDefault) return 1
    return 0
  })
}

export function collectionContainsBusiness(collection: CollectionRecord, candidate: CollectionCandidate) {
  return collection.items.some((item) => item.publicHref === candidate.publicHref)
}

export function buildCollectionItemFromCandidate(candidate: CollectionCandidate): CollectionItem {
  return {
    id: candidate.id,
    businessName: candidate.businessName,
    location: candidate.location,
    category: candidate.category,
    note: candidate.note,
    imageUrl: candidate.imageUrl,
    publicHref: candidate.publicHref,
  }
}
