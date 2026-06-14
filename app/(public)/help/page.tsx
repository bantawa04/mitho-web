import type { Metadata } from "next"
import { HelpPage } from "@/features/static/screens/help-page"

export const metadata: Metadata = {
  title: "Help Center — Mitho Cha!",
  description: "Find answers to common questions about Mitho Cha — reviews, business listings, accounts, and more.",
}

export default function Page() {
  return <HelpPage />
}
