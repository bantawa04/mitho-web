const MOCK_BUSINESS_PUBLIC_HREFS: Record<string, string> = {
  "bhaktapur-juju-dhau-stop": "/bagmati/bhaktapur/bhaktapur/bhaktapur-juju-dhau-stop",
  "brick-oven-social": "/bagmati/kathmandu/kathmandu/brick-oven-social",
  "courtyard-steam-house": "/bagmati/lalitpur/lalitpur/courtyard-steam-house",
  "demo-empty": "/bagmati/lalitpur/lalitpur/patan-courtyard-kitchen",
  "firewood-slice-house": "/bagmati/kathmandu/kathmandu/firewood-slice-house",
  "garden-brunch-room": "/bagmati/lalitpur/lalitpur/garden-brunch-room",
  "himalayan-flavors": "/bagmati/kathmandu/kathmandu/himalayan-flavors",
  "lakeview-pour-house": "/gandaki/kaski/pokhara/lakeview-pour-house",
  "momo-central": "/bagmati/kathmandu/kathmandu/momo-central",
  "morning-bun-cafe": "/bagmati/kathmandu/kathmandu/morning-bun-cafe",
  "rooftop-pie-corner": "/bagmati/kathmandu/kathmandu/rooftop-pie-corner",
  "thakali-kitchen": "/bagmati/lalitpur/lalitpur/thakali-kitchen",
  "thamel-noodle-room": "/bagmati/kathmandu/kathmandu/thamel-noodle-room",
}

export function mockBusinessPublicHref(slug: string): string {
  return MOCK_BUSINESS_PUBLIC_HREFS[slug] ?? "/explore"
}
