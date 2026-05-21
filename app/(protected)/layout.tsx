import type { ReactNode } from "react"
import { AuthSessionInitializer } from "@/features/auth/components/mock-auth-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionInitializer />
      {children}
    </>
  )
}
