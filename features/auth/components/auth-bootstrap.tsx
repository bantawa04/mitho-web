"use client"

import { useCurrentSession } from "@/hooks/use-auth-session"

export function AuthBootstrap() {
  useCurrentSession()
  return null
}
