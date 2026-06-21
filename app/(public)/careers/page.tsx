import type { Metadata } from "next"
import { CareersPage } from "@/features/static/screens/careers-page"

export const metadata: Metadata = {
  title: "Careers — Mitho Cha!",
  description:
    "Join Mitho Cha!, Nepal's food discovery and review platform. No open roles right now — but we're always glad to meet people who love what we're building.",
}

export default function Page() {
  return <CareersPage />
}
