import type { Metadata } from "next"
import { LegalPage } from "@/features/static/screens/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service - Mitho Cha!",
  description: "Read the Mitho Cha Terms of Service governing use of our food discovery and review platform.",
}

export default function Page() {
  return <LegalPage doc="terms" />
}
