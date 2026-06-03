"use client"

import { create } from "zustand"
import { isInternalUser } from "@/lib/auth/access"
import type { AuthUser, AuthUserProfile } from "@/types/auth"

export type SessionState = "loading" | "authenticated" | "signed-out"

export interface AuthDisplayUser {
  name: string
  avatarUrl?: string
  href: string
}

interface AuthStoreState {
  authUser: AuthUser | null
  currentUser: AuthDisplayUser | null
  sessionState: SessionState
  setSessionLoading: () => void
  setAuthenticatedUser: (user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authUser: null,
  currentUser: null,
  sessionState: "loading",
  setSessionLoading: () => set({ sessionState: "loading" }),
  setAuthenticatedUser: (user) =>
    set({
      authUser: user,
      currentUser: buildCurrentUser(user),
      sessionState: "authenticated",
    }),
  clearAuth: () =>
    set({
      authUser: null,
      currentUser: null,
      sessionState: "signed-out",
    }),
}))

function buildDisplayName(user: AuthUserProfile) {
  const fullName = user.fullName?.trim()
  if (fullName) return fullName

  const firstName = user.firstName?.trim()
  const lastName = user.lastName?.trim()
  const combined = [firstName, lastName].filter(Boolean).join(" ").trim()

  return combined || user.email
}

function buildCurrentUser(authUser: AuthUser): AuthDisplayUser {
  return {
    name: buildDisplayName(authUser.user),
    avatarUrl: authUser.user.avatarUrl ?? undefined,
    href: isInternalUser(authUser) ? "/admin" : "/profile",
  }
}

export const authStoreSelectors = {
  authUser: (state: AuthStoreState) => state.authUser,
  sessionState: (state: AuthStoreState) => state.sessionState,
  isHydrated: (state: AuthStoreState) => state.sessionState !== "loading",
  isAuthenticated: (state: AuthStoreState) => state.sessionState === "authenticated",
  isAdmin: (state: AuthStoreState) =>
    state.sessionState === "authenticated" && isInternalUser(state.authUser),
  currentUser: (state: AuthStoreState) => state.currentUser,
  hasBusinessAccess: (state: AuthStoreState) =>
    state.sessionState === "authenticated" &&
    (state.authUser?.businessMemberships.length ?? 0) > 0,
}
