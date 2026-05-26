"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentSession, loginWithGoogle, logoutSession } from "@/lib/api/auth"
import { authStoreSelectors, useAuthStore } from "@/store/authStore"
import type { AuthUser } from "@/types/auth"

export const authQueryKeys = {
  session: ["auth", "session"] as const,
}

export function useCurrentSession() {
  const setSessionLoading = useAuthStore((state) => state.setSessionLoading)
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const query = useQuery({
    queryKey: authQueryKeys.session,
    queryFn: fetchCurrentSession,
    retry: false,
  })

  React.useEffect(() => {
    if (query.isPending) {
      setSessionLoading()
      return
    }

    if (query.data) {
      setAuthenticatedUser(query.data)
      return
    }

    clearAuth()
  }, [clearAuth, query.data, query.isPending, setAuthenticatedUser, setSessionLoading])

  React.useEffect(() => {
    if (query.error) {
      console.error("Failed to hydrate Mitho session", query.error)
    }
  }, [query.error])

  return query
}

export function useGoogleLogin() {
  const queryClient = useQueryClient()
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser)

  return useMutation({
    mutationFn: (idToken: string) => loginWithGoogle({ idToken }),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(authQueryKeys.session, user)
      setAuthenticatedUser(user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: logoutSession,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null)
      clearAuth()
    },
  })
}

export function useAuthSnapshot() {
  const authUser = useAuthStore(authStoreSelectors.authUser)
  const currentUser = useAuthStore(authStoreSelectors.currentUser)
  const sessionState = useAuthStore(authStoreSelectors.sessionState)
  const isHydrated = useAuthStore(authStoreSelectors.isHydrated)
  const isAuthenticated = useAuthStore(authStoreSelectors.isAuthenticated)
  const isAdmin = useAuthStore(authStoreSelectors.isAdmin)
  const hasBusinessAccess = useAuthStore(authStoreSelectors.hasBusinessAccess)

  return {
    authUser,
    currentUser,
    sessionState,
    isHydrated,
    isAuthenticated,
    isAdmin,
    hasBusinessAccess,
  }
}
