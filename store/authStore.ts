"use client"

import { create } from "zustand"
import type { AuthUser } from "@/types/auth"

export type SessionState = "loading" | "authenticated" | "signed-out"

export interface AuthDisplayUser {
  name: string
  avatarUrl?: string
  href: string
}

interface AuthStoreState {
  authUser: AuthUser | null
  sessionState: SessionState
  setSessionLoading: () => void
  setAuthenticatedUser: (user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authUser: null,
  sessionState: "loading",
  setSessionLoading: () => set({ sessionState: "loading" }),
  setAuthenticatedUser: (user) =>
    set({
      authUser: user,
      sessionState: "authenticated",
    }),
  clearAuth: () =>
    set({
      authUser: null,
      sessionState: "signed-out",
    }),
}))

function buildDisplayName(user: AuthUser) {
  const fullName = user.fullName?.trim()
  if (fullName) return fullName

  const firstName = user.firstName?.trim()
  const lastName = user.lastName?.trim()
  const combined = [firstName, lastName].filter(Boolean).join(" ").trim()

  return combined || user.email
}

function buildCurrentUser(user: AuthUser): AuthDisplayUser {
  return {
    name: buildDisplayName(user),
    href: user.type === "admin" ? "/admin" : "/profile",
  }
}

export const authStoreSelectors = {
  authUser: (state: AuthStoreState) => state.authUser,
  sessionState: (state: AuthStoreState) => state.sessionState,
  isHydrated: (state: AuthStoreState) => state.sessionState !== "loading",
  isAuthenticated: (state: AuthStoreState) => state.sessionState === "authenticated",
  isAdmin: (state: AuthStoreState) => state.sessionState === "authenticated" && state.authUser?.type === "admin",
  hasBusinessAccess: () => false,
}

export { buildCurrentUser }
