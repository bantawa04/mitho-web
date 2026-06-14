import type { Metadata } from "next"
import { GuidelinesPage } from "@/features/static/screens/guidelines-page"

export const metadata: Metadata = {
  title: "Community Guidelines — Mitho Cha!",
  description: "The Mitho Cha community guidelines — how to write reviews, contribute honestly, and keep the platform trustworthy for everyone.",
}

export default function Page() {
  return <GuidelinesPage />
}
