import type { Metadata } from "next"
import { LegalPage } from "@/features/static/screens/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy — Mitho Cha!",
  description: "Read the Mitho Cha! privacy policy covering the information we collect and how it is used.",
}

export default function Page() {
  return <LegalPage doc="privacy" />
}
