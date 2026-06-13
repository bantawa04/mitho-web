import type { Metadata } from "next"
import { LegalPage } from "@/features/static/screens/legal-page"

export const metadata: Metadata = {
  title: "Terms & Conditions — Mitho Cha!",
  description: "Read the Mitho Cha! terms and conditions governing the use of our service.",
}

export default function Page() {
  return <LegalPage doc="terms" />
}
