import type { Metadata } from "next"
import { ContactPage } from "@/features/static/screens/contact-page"

export const metadata: Metadata = {
  title: "Contact — Mitho Cha!",
  description: "Get in touch with the Mitho Cha! team. Find our address, phone, email, and send us a message.",
}

export default function Page() {
  return <ContactPage />
}
