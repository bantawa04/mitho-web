export interface ClaimableBusiness {
  id: string
  name: string
  category: string
  location: string
  publicHref: string
  cue: string
}

export const CLAIMABLE_BUSINESSES: ClaimableBusiness[] = [
  {
    id: "himalayan-flavors",
    name: "Himalayan Flavors",
    category: "Restaurant",
    location: "Thamel, Kathmandu",
    publicHref: "/business/himalayan-flavors",
    cue: "Listing exists on Mitho and is eligible for ownership verification.",
  },
  {
    id: "patan-courtyard-kitchen",
    name: "Patan Courtyard Kitchen",
    category: "Restaurant",
    location: "Patan, Lalitpur",
    publicHref: "/business/demo-empty",
    cue: "Newer listing with basic public info already in place.",
  },
  {
    id: "momo-central",
    name: "Momo Central",
    category: "Street food",
    location: "New Road, Kathmandu",
    publicHref: "/business/momo-central",
    cue: "Popular listing with review activity already tied to it.",
  },
  {
    id: "thakali-kitchen",
    name: "Thakali Kitchen",
    category: "Local cuisine",
    location: "Jhamsikhel, Lalitpur",
    publicHref: "/business/thakali-kitchen",
    cue: "Existing Mitho listing that can be claimed after verification.",
  },
]

export function getClaimableBusinessById(id: string | null | undefined) {
  if (!id) return null
  return CLAIMABLE_BUSINESSES.find((business) => business.id === id) ?? null
}
