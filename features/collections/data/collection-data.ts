import { mockBusinessPublicHref } from "@/features/business/utils/mock-business-public-href"

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

const publicCreatorSamriddhi: CollectionOwner = {
  name: "Samriddhi Bites",
  username: "samriddhi-bites",
  avatarUrl: "/woman-portrait.png",
}

const publicCreatorPrerna: CollectionOwner = {
  name: "Prerna Plates",
  username: "prerna-plates",
  avatarUrl: "/woman-portrait.png",
}

const publicCreatorRoshan: CollectionOwner = {
  name: "Roshan Routes",
  username: "roshan-routes",
  avatarUrl: "/thoughtful-man-portrait.png",
}

const publicCreatorSushant: CollectionOwner = {
  name: "Sushant Snacks",
  username: "sushant-snacks",
  avatarUrl: "/thoughtful-man-portrait.png",
}

function createCollectionItem(item: CollectionItem): CollectionItem {
  return item
}

function createCollectionRecord(collection: CollectionRecord): CollectionRecord {
  return collection
}

const aaratiExtraPublicCollections: CollectionRecord[] = [
  createCollectionRecord({
    id: "breakfast-worth-waking-up-for",
    title: "Breakfast Worth Waking Up For",
    description: "A breakfast-first list for mornings when the meal is the whole reason to leave home early.",
    visibility: "public",
    updatedLabel: "Updated yesterday",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "breakfast-1",
        businessName: "Garden Brunch Room",
        location: "Bhanimandal, Lalitpur",
        category: "Breakfast · Brunch",
        note: "Good when the group wants one slower breakfast instead of three backup options.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("garden-brunch-room"),
      }),
      createCollectionItem({
        id: "breakfast-2",
        businessName: "Morning Bun Cafe",
        location: "Baluwatar, Kathmandu",
        category: "Bakery · Coffee",
        note: "Worth keeping for pastry mornings that still need enough seating to linger.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("morning-bun-cafe"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "late-night-comfort-bowls",
    title: "Late Night Comfort Bowls",
    description: "Bowls and soups that still feel worth the detour when dinner happens later than planned.",
    visibility: "public",
    updatedLabel: "Updated 2 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "late-night-1",
        businessName: "Thamel Noodle Room",
        location: "Thamel, Kathmandu",
        category: "Noodles · Late dinner",
        note: "My safer late-evening backup when a full dinner plan falls apart.",
        imageUrl: "/thukpa-tibetan-noodle-soup.jpg",
        publicHref: mockBusinessPublicHref("thamel-noodle-room"),
      }),
      createCollectionItem({
        id: "late-night-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Still one of the most reliable sit-down comfort-food stops after a long day.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "newari-first-timers",
    title: "Newari First-Timers",
    description: "A calmer starting list for friends who want Newari food without jumping straight into the heaviest spread.",
    visibility: "public",
    updatedLabel: "Updated 4 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "newari-1",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari · Courtyard dining",
        note: "Good first stop when you want the flavors without the room feeling too formal.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("demo-empty"),
      }),
      createCollectionItem({
        id: "newari-2",
        businessName: "Bhaktapur Juju Dhau Stop",
        location: "Bhaktapur Durbar Square, Bhaktapur",
        category: "Dessert · Local stop",
        note: "An easy dessert detour that still feels tied to the local food story.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: mockBusinessPublicHref("bhaktapur-juju-dhau-stop"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "date-night-dinners-that-dont-try-too-hard",
    title: "Date Night Dinners That Don't Try Too Hard",
    description: "Places that feel warm and polished without crossing into stiff special-occasion territory.",
    visibility: "public",
    updatedLabel: "Updated 5 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "date-night-1",
        businessName: "Courtyard Steam House",
        location: "Patan, Lalitpur",
        category: "Momos · Cozy room",
        note: "A strong option when you want the room to do some of the work for the evening.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("courtyard-steam-house"),
      }),
      createCollectionItem({
        id: "date-night-2",
        businessName: "Brick Oven Social",
        location: "Lazimpat, Kathmandu",
        category: "Pizza · Hangout",
        note: "Less formal, but still easy to recommend for a low-effort dinner plan.",
        imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
        publicHref: mockBusinessPublicHref("brick-oven-social"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "tea-and-thukpa-weather",
    title: "Tea and Thukpa Weather",
    description: "Cold-weather comfort lists for the days when a hotter, simpler meal wins immediately.",
    visibility: "public",
    updatedLabel: "Updated last week",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "thukpa-1",
        businessName: "Thamel Noodle Room",
        location: "Thamel, Kathmandu",
        category: "Noodles · Late dinner",
        note: "A reliable thukpa mood reset when the weather decides dinner for you.",
        imageUrl: "/thukpa-tibetan-noodle-soup.jpg",
        publicHref: mockBusinessPublicHref("thamel-noodle-room"),
      }),
      createCollectionItem({
        id: "thukpa-2",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Worth pairing with a quick momo plate when the plan needs to stay inexpensive.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: mockBusinessPublicHref("momo-central"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "patan-courtyard-picks",
    title: "Patan Courtyard Picks",
    description: "Calmer places around Patan that work well when the group wants atmosphere without too much fuss.",
    visibility: "public",
    updatedLabel: "Updated last week",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "patan-1",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari · Courtyard dining",
        note: "Still one of the easier courtyard picks to recommend to mixed groups.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("demo-empty"),
      }),
      createCollectionItem({
        id: "patan-2",
        businessName: "Courtyard Steam House",
        location: "Patan, Lalitpur",
        category: "Momos · Cozy room",
        note: "Works when the group wants comfort food and a room that still feels intentional.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("courtyard-steam-house"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "spicy-lunch-detours",
    title: "Spicy Lunch Detours",
    description: "Lunch spots that feel worth leaving the safest nearby option behind for something stronger.",
    visibility: "public",
    updatedLabel: "Updated 8 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "spicy-lunch-1",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "A dependable answer when someone wants spice but also needs a comfortable room.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
      createCollectionItem({
        id: "spicy-lunch-2",
        businessName: "Firewood Slice House",
        location: "Jhamsikhel, Lalitpur",
        category: "Pizza · Casual dinner",
        note: "Not spicy by default, but worth saving for lunch groups who want a safer crowd-pleaser.",
        imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
        publicHref: mockBusinessPublicHref("firewood-slice-house"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "cafe-corners-worth-sitting-in",
    title: "Cafe Corners Worth Sitting In",
    description: "Cafes I keep around for longer chats, solo resets, or slow planning sessions that need a good seat.",
    visibility: "public",
    updatedLabel: "Updated 9 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "cafe-1",
        businessName: "Morning Bun Cafe",
        location: "Baluwatar, Kathmandu",
        category: "Bakery · Coffee",
        note: "Better for sitting in than rushing through, which is exactly why it stays in this list.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("morning-bun-cafe"),
      }),
      createCollectionItem({
        id: "cafe-2",
        businessName: "Garden Brunch Room",
        location: "Bhanimandal, Lalitpur",
        category: "Breakfast · Brunch",
        note: "Useful when the group needs more table time than menu novelty.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: mockBusinessPublicHref("garden-brunch-room"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "dessert-stops-after-dinner",
    title: "Dessert Stops After Dinner",
    description: "Short dessert-focused follow-up stops that fit neatly after a fuller dinner nearby.",
    visibility: "public",
    updatedLabel: "Updated 10 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "dessert-1",
        businessName: "Bhaktapur Juju Dhau Stop",
        location: "Bhaktapur Durbar Square, Bhaktapur",
        category: "Dessert · Local stop",
        note: "An easy sweet stop to keep in the back pocket when dinner ends earlier than expected.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("bhaktapur-juju-dhau-stop"),
      }),
      createCollectionItem({
        id: "dessert-2",
        businessName: "Morning Bun Cafe",
        location: "Baluwatar, Kathmandu",
        category: "Bakery · Coffee",
        note: "Works best when the plan wants pastries rather than a heavier dessert plate.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: mockBusinessPublicHref("morning-bun-cafe"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "weekend-family-lunches",
    title: "Weekend Family Lunches",
    description: "Safer group lunch picks for weekends when the table needs to work for different tastes at once.",
    visibility: "public",
    updatedLabel: "Updated 12 days ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "family-1",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari · Courtyard dining",
        note: "One of the easier places to suggest when family groups want comfort without noise.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("demo-empty"),
      }),
      createCollectionItem({
        id: "family-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "A steadier fallback when the group wants familiar flavors and fewer surprises.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "places-to-take-out-of-town-friends",
    title: "Places to Take Out-of-Town Friends",
    description: "A cleaner shortlist for visitors who want one strong taste of the city without too much decision fatigue.",
    visibility: "public",
    updatedLabel: "Updated 2 weeks ago",
    owner: currentCustomer,
    items: [
      createCollectionItem({
        id: "friends-1",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Still one of the easiest first recommendations for visiting friends staying nearby.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
      createCollectionItem({
        id: "friends-2",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari · Courtyard dining",
        note: "A good contrast stop when the group wants something that feels more local and rooted.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("demo-empty"),
      }),
    ],
  }),
]

export const ownedCollections: CollectionRecord[] = [
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
        publicHref: mockBusinessPublicHref("firewood-slice-house"),
      },
      {
        id: "pizza-2",
        businessName: "Brick Oven Social",
        location: "Lazimpat, Kathmandu",
        category: "Pizza · Hangout",
        note: "Better for longer hangs than quick takeaway.",
        imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
        publicHref: mockBusinessPublicHref("brick-oven-social"),
      },
      {
        id: "pizza-3",
        businessName: "Rooftop Pie Corner",
        location: "Lakeside, Pokhara",
        category: "Pizza · View stop",
        note: "A good option when the group wants something easier than local plates.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: mockBusinessPublicHref("rooftop-pie-corner"),
      },
    ],
  },
  {
    id: "my-food-bucket-list",
    title: "My Food Bucket List",
    description: "Places I still want to try properly before I keep recommending them to anyone else.",
    visibility: "public",
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
        publicHref: mockBusinessPublicHref("thamel-noodle-room"),
      },
      {
        id: "bucket-2",
        businessName: "Bhaktapur Juju Dhau Stop",
        location: "Bhaktapur Durbar Square, Bhaktapur",
        category: "Dessert · Local stop",
        note: "Want to compare it properly instead of relying on one rushed visit.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("bhaktapur-juju-dhau-stop"),
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
        publicHref: mockBusinessPublicHref("momo-central"),
      },
      {
        id: "copy-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Worth keeping on the route for a more settled sit-down plate.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      },
    ],
  },
  ...aaratiExtraPublicCollections,
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
        publicHref: mockBusinessPublicHref("momo-central"),
      },
      {
        id: "public-momo-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "The sit-down anchor when you want one stronger plate in the middle of the crawl.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      },
      {
        id: "public-momo-3",
        businessName: "Courtyard Steam House",
        location: "Patan, Lalitpur",
        category: "Momos · Cozy room",
        note: "Better when the group wants to slow down and compare chutneys carefully.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("courtyard-steam-house"),
      },
    ],
  },
  createCollectionRecord({
    id: "late-night-momo-map",
    title: "Late Night Momo Map",
    description: "A shorter city-night route for momo plates that still hold up once the easier dinner options close.",
    visibility: "public",
    updatedLabel: "Updated 1 week ago",
    owner: publicCreator,
    items: [
      createCollectionItem({
        id: "nabin-night-1",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "My steadier late-night fallback when the group wants a proper sit-down plate.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
      createCollectionItem({
        id: "nabin-night-2",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Fast enough to keep in the route when the night should stay moving.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: mockBusinessPublicHref("momo-central"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "pokhara-coffee-stops",
    title: "Pokhara Coffee Stops",
    description: "Coffee stops in Pokhara that feel worth sitting in instead of just using as a placeholder meeting point.",
    visibility: "public",
    updatedLabel: "Updated 3 days ago",
    owner: publicCreatorSamriddhi,
    items: [
      createCollectionItem({
        id: "samriddhi-coffee-1",
        businessName: "Lakeview Pour House",
        location: "Lakeside, Pokhara",
        category: "Cafe · Coffee",
        note: "A better sit-in choice when you want the room to be part of the break.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("lakeview-pour-house"),
      }),
      createCollectionItem({
        id: "samriddhi-coffee-2",
        businessName: "Morning Bun Cafe",
        location: "Baluwatar, Kathmandu",
        category: "Bakery · Coffee",
        note: "Not in Pokhara, but I still benchmark slower cafe rooms against this mood.",
        imageUrl: "/dal-bhat-nepali-meal-set.jpg",
        publicHref: mockBusinessPublicHref("morning-bun-cafe"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "patan-date-night-rooms",
    title: "Patan Date Night Rooms",
    description: "Rooms in Patan that feel warm, polished, and easy to suggest without making dinner feel overplanned.",
    visibility: "public",
    updatedLabel: "Updated 4 days ago",
    owner: publicCreatorPrerna,
    items: [
      createCollectionItem({
        id: "prerna-date-1",
        businessName: "Courtyard Steam House",
        location: "Patan, Lalitpur",
        category: "Momos · Cozy room",
        note: "A room that already does some of the work before the food even lands.",
        imageUrl: "/restaurant-interior-cozy.jpg",
        publicHref: mockBusinessPublicHref("courtyard-steam-house"),
      }),
      createCollectionItem({
        id: "prerna-date-2",
        businessName: "Patan Courtyard Kitchen",
        location: "Mangal Bazaar, Lalitpur",
        category: "Newari · Courtyard dining",
        note: "Good when the plan wants local flavor without losing the softer mood.",
        imageUrl: "/newari-food-platter.jpg",
        publicHref: mockBusinessPublicHref("demo-empty"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "budget-lunches-under-800",
    title: "Budget Lunches Under 800",
    description: "Lunch picks that stay satisfying without turning into the kind of cheap choice people regret later.",
    visibility: "public",
    updatedLabel: "Updated 6 days ago",
    owner: publicCreatorRoshan,
    items: [
      createCollectionItem({
        id: "roshan-budget-1",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "A central lunch stop that still feels worth recommending on a tighter budget.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: mockBusinessPublicHref("momo-central"),
      }),
      createCollectionItem({
        id: "roshan-budget-2",
        businessName: "Himalayan Flavors",
        location: "Thamel, Kathmandu",
        category: "Nepali · Tibetan",
        note: "Still fits when a more complete lunch matters more than squeezing the lowest possible bill.",
        imageUrl: "/steamed-momo-nepali-dumplings.jpg",
        publicHref: mockBusinessPublicHref("himalayan-flavors"),
      }),
    ],
  }),
  createCollectionRecord({
    id: "after-work-snack-runs",
    title: "After Work Snack Runs",
    description: "Short snack runs for the hour between leaving work and committing to a full dinner somewhere else.",
    visibility: "public",
    updatedLabel: "Updated 1 week ago",
    owner: publicCreatorSushant,
    items: [
      createCollectionItem({
        id: "sushant-snack-1",
        businessName: "Momo Central",
        location: "New Road, Kathmandu",
        category: "Street food",
        note: "Fast enough for weekday snack detours that should stay simple.",
        imageUrl: "/momos-dumplings.jpg",
        publicHref: mockBusinessPublicHref("momo-central"),
      }),
      createCollectionItem({
        id: "sushant-snack-2",
        businessName: "Brick Oven Social",
        location: "Lazimpat, Kathmandu",
        category: "Pizza · Hangout",
        note: "Useful when the snack run turns into a longer catch-up by accident.",
        imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
        publicHref: mockBusinessPublicHref("brick-oven-social"),
      }),
    ],
  }),
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

  return normalized
    ? collections.filter((collection) =>
        [collection.title, collection.description ?? ""].some((value) => value.toLowerCase().includes(normalized)),
      )
    : collections
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
