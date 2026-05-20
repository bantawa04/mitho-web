import type { ReactNode } from "react"
import { AuthSessionInitializer } from "@/components/auth/mock-auth-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionInitializer />
      {children}
    </>
  )
}
