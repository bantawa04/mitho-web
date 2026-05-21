"use client"

import * as React from "react"
import { currentCustomer } from "@/features/collections/data/collection-data"
import { mockCustomerProfile } from "@/features/profile/data/profile-data"

type SessionState = "authenticated" | "signed-out"

interface MockAuthContextValue {
  isHydrated: boolean
  isAuthenticated: boolean
  currentUser: {
    name: string
    avatarUrl: string
    href: string
  } | null
  hasBusinessAccess: boolean
  signIn: () => void
  signOut: () => void
  ensureDemoSignedIn: () => void
}

const STORAGE_KEY = "mitho-mock-auth-state"

const MockAuthContext = React.createContext<MockAuthContextValue | null>(null)

function buildCurrentUser() {
  return {
    name: currentCustomer.name,
    avatarUrl: currentCustomer.avatarUrl || mockCustomerProfile.avatarUrl,
    href: "/profile",
  }
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [sessionState, setSessionState] = React.useState<SessionState>("signed-out")

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const storedState = window.localStorage.getItem(STORAGE_KEY)
    setSessionState(storedState === "authenticated" ? "authenticated" : "signed-out")
    setIsHydrated(true)
  }, [])

  const signIn = React.useCallback(() => {
    setSessionState("authenticated")
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "authenticated")
    }
  }, [])

  const signOut = React.useCallback(() => {
    setSessionState("signed-out")
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "signed-out")
    }
  }, [])

  const ensureDemoSignedIn = React.useCallback(() => {
    if (typeof window === "undefined") return

    const storedState = window.localStorage.getItem(STORAGE_KEY)
    if (storedState !== null) return

    window.localStorage.setItem(STORAGE_KEY, "authenticated")
    setSessionState("authenticated")
  }, [])

  const value = React.useMemo<MockAuthContextValue>(
    () => ({
      isHydrated,
      isAuthenticated: sessionState === "authenticated",
      currentUser: sessionState === "authenticated" ? buildCurrentUser() : null,
      hasBusinessAccess: sessionState === "authenticated" && mockCustomerProfile.businessContext.status === "approved",
      signIn,
      signOut,
      ensureDemoSignedIn,
    }),
    [ensureDemoSignedIn, isHydrated, sessionState, signIn, signOut],
  )

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
}

export function useMockAuth() {
  const context = React.useContext(MockAuthContext)

  if (!context) {
    throw new Error("useMockAuth must be used within a MockAuthProvider")
  }

  return context
}

export function AuthSessionInitializer() {
  const { ensureDemoSignedIn } = useMockAuth()

  React.useEffect(() => {
    ensureDemoSignedIn()
  }, [ensureDemoSignedIn])

  return null
}
