import type { Metadata } from "next"
import { AboutPage } from "@/features/static/screens/about-page"

export const metadata: Metadata = {
  title: "About — Mitho Cha!",
  description: "Learn about Mitho Cha!, our story, mission, values, and the team behind the local food discovery app.",
}

export default function Page() {
  return <AboutPage />
}
