"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentSession, loginWithGoogle, logoutSession } from "@/services/AuthService"
import type { AuthUser } from "@/types/auth"

export const authQueryKeys = {
  session: ["auth", "session"] as const,
}

export const useCurrentSessionQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: fetchCurrentSession,
    retry: false,
  })
}

export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idToken: string) => loginWithGoogle({ idToken }),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(authQueryKeys.session, user)
    },
  })
}

export const useLogoutSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutSession,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.session, null)
    },
  })
}
