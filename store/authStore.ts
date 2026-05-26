"use client"

import { create } from "zustand"
import type { AuthUser } from "@/types/auth"

type SessionState = "loading" | "authenticated" | "signed-out"

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

export const authStoreSelectors = {
  authUser: (state: AuthStoreState) => state.authUser,
  sessionState: (state: AuthStoreState) => state.sessionState,
  isHydrated: (state: AuthStoreState) => state.sessionState !== "loading",
  isAuthenticated: (state: AuthStoreState) => state.sessionState === "authenticated",
  isAdmin: (state: AuthStoreState) => state.authUser?.type === "admin",
  hasBusinessAccess: (state: AuthStoreState) =>
    state.sessionState === "authenticated" && state.authUser?.type !== "admin",
}
