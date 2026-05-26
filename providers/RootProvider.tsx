"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap"
import { getQueryClient } from "@/config/query"

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
    </QueryClientProvider>
  )
}
