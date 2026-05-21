import type { Metadata } from "next"
import { ExplorePage } from "@/features/discovery/explore/explore-page"

export const metadata: Metadata = {
  title: "Explore Local Food Picks | Mitho Cha!",
  description:
    "Search dishes, cafes, local cuisine, and neighborhood food picks across Nepal with real local trust signals.",
}

export default function ExploreRoute() {
  return <ExplorePage />
}
