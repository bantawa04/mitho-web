import type { Metadata } from "next"
import { ExplorePage } from "@/features/discovery/explore/explore-page"

export const metadata: Metadata = {
  title: "Explore Local Food Picks | Mitho Cha!",
  description:
    "Search restaurants, cafes, cuisines, and establishment types across Nepal by province, district, and neighborhood with real local trust signals.",
}

export default function ExploreRoute() {
  return <ExplorePage />
}
