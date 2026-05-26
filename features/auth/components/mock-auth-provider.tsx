"use client"

import * as React from "react"
import {
  useCurrentSessionQuery,
  useGoogleLoginMutation,
  useLogoutSessionMutation,
} from "@/queries/authQuery"
import type { AuthUser } from "@/types/auth"

type SessionState = "loading" | "authenticated" | "signed-out"

interface AuthContextValue {
  isHydrated: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  currentUser: {
    name: string
    avatarUrl?: string
    href: string
  } | null
  authUser: AuthUser | null
  hasBusinessAccess: boolean
  signInWithGoogleCredential: (idToken: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  ensureDemoSignedIn: () => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function buildDisplayName(user: AuthUser) {
  const fullName = user.fullName?.trim()
  if (fullName) return fullName

  const firstName = user.firstName?.trim()
  const lastName = user.lastName?.trim()
  const combined = [firstName, lastName].filter(Boolean).join(" ").trim()
  return combined || user.email
}

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const sessionQuery = useCurrentSessionQuery()
  const googleLoginMutation = useGoogleLoginMutation()
  const logoutMutation = useLogoutSessionMutation()
  const authUser = sessionQuery.data ?? null

  React.useEffect(() => {
    if (sessionQuery.error) {
      console.error("Failed to hydrate Mitho session", sessionQuery.error)
    }
  }, [sessionQuery.error])

  const sessionState: SessionState = sessionQuery.isPending
    ? "loading"
    : authUser
      ? "authenticated"
      : "signed-out"

  const signInWithGoogleCredential = React.useCallback(async (idToken: string) => {
    await googleLoginMutation.mutateAsync(idToken)
  }, [googleLoginMutation])

  const signOut = React.useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  const refreshSession = React.useCallback(async () => {
    await sessionQuery.refetch()
  }, [sessionQuery])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isHydrated: sessionState !== "loading",
      isAuthenticated: sessionState === "authenticated",
      isAdmin: authUser?.type === "admin",
      currentUser: authUser
        ? {
            name: buildDisplayName(authUser),
            href: authUser.type === "admin" ? "/admin" : "/profile",
          }
        : null,
      authUser,
      hasBusinessAccess: sessionState === "authenticated" && authUser?.type !== "admin",
      signInWithGoogleCredential,
      signOut,
      refreshSession,
      ensureDemoSignedIn: () => {},
    }),
    [authUser, refreshSession, sessionState, signInWithGoogleCredential, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthProvider = MockAuthProvider

export function useMockAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error("useMockAuth must be used within a MockAuthProvider")
  }

  return context
}

export const useAuth = useMockAuth

export function AuthSessionInitializer() {
  return null
}
