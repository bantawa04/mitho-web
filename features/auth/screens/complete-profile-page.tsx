"use client"

import * as React from "react"
import axios from "axios"
import { CheckCircle2, CircleAlert, RefreshCw, UserRound } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { BrandLogo } from "@/components/mitho/brand-logo"
import { MithoBadge } from "@/components/mitho/mitho-badge"
import { MithoButton } from "@/components/mitho/mitho-button"
import { Input } from "@/components/ui/input"
import { authQueryKeys, useAuthSnapshot } from "@/hooks/use-auth-session"
import { checkUsernameAvailability, completeProfile, getUsernameSuggestion } from "@/lib/api/profile"
import { extractApiErrorMessage } from "@/lib/api-error-utils"
import { getAuthenticatedRedirect } from "@/lib/auth/redirects"
import { isInternalUser } from "@/lib/auth/access"
import { useAuthStore } from "@/store/authStore"

type AvailabilityState = "idle" | "checking" | "available" | "unavailable" | "invalid"

export function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const queryClient = useQueryClient()
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser)
  const { authUser, isHydrated, isAuthenticated } = useAuthSnapshot()
  const [username, setUsername] = React.useState("")
  const [availability, setAvailability] = React.useState<AvailabilityState>("idle")
  const [message, setMessage] = React.useState<string | null>(null)
  const [hasAcceptedSuggestion, setHasAcceptedSuggestion] = React.useState(false)

  const suggestionQuery = useQuery({
    queryKey: ["profile", "username-suggestion"],
    queryFn: getUsernameSuggestion,
    enabled: isHydrated && isAuthenticated && !!authUser && !authUser.user.profileComplete && !isInternalUser(authUser),
    retry: false,
  })

  React.useEffect(() => {
    if (!isHydrated || !authUser) return

    if (isInternalUser(authUser) || authUser.user.profileComplete) {
      router.replace(getAuthenticatedRedirect(authUser, redirect))
    }
  }, [authUser, isHydrated, redirect, router])

  React.useEffect(() => {
    if (!suggestionQuery.data?.username || hasAcceptedSuggestion) return
    setUsername(suggestionQuery.data.username)
    setAvailability("idle")
    setMessage(null)
    setHasAcceptedSuggestion(true)
  }, [hasAcceptedSuggestion, suggestionQuery.data?.username])

  const availabilityMutation = useMutation({
    mutationFn: checkUsernameAvailability,
    onMutate: () => {
      setAvailability("checking")
      setMessage(null)
    },
    onSuccess: (result) => {
      setUsername(result.username)
      setAvailability(result.available ? "available" : "unavailable")
      setMessage(result.available ? "This username is available." : "That username is already taken.")
    },
    onError: (error) => {
      setAvailability("invalid")
      setMessage(extractApiErrorMessage(error))
    },
  })

  const completeMutation = useMutation({
    mutationFn: completeProfile,
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(authQueryKeys.session, updatedSession)
      setAuthenticatedUser(updatedSession)
      router.replace(getAuthenticatedRedirect(updatedSession, redirect))
    },
    onError: (error) => {
      setAvailability("invalid")
      setMessage(extractApiErrorMessage(error))
    },
  })

  const handleGenerateAnother = async () => {
    const result = await suggestionQuery.refetch()
    if (result.data?.username) {
      setUsername(result.data.username)
      setAvailability("idle")
      setMessage(null)
    }
  }

  const handleCheckAvailability = () => {
    if (!username.trim()) return
    availabilityMutation.mutate(username)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = username.trim()
    if (!value) {
      setAvailability("invalid")
      setMessage("Choose a username to continue.")
      return
    }

    const result = await availabilityMutation.mutateAsync(value)
    if (!result.available) return

    completeMutation.mutate(result.username)
  }

  const isBusy = suggestionQuery.isFetching || availabilityMutation.isPending || completeMutation.isPending
  const showAvailable = availability === "available"
  const showProblem = availability === "unavailable" || availability === "invalid"

  return (
    <div className="page-shell-customer min-h-dvh bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_32%,#fffdfa_100%)]">
      <main className="container mx-auto flex min-h-dvh items-center px-4 py-10">
        <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1fr)] lg:items-center">
          <div className="space-y-6">
            <BrandLogo kind="wordmark" tone="green" className="h-10" priority />
            <div className="max-w-xl">
              <MithoBadge variant="neutral">One quick step</MithoBadge>
              <h1 className="type-page-title mt-5 text-brand-dark-green">Choose the name people will recognize around Mitho.</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Your username keeps reviews, collections, and public profile links easy to find. You can use the suggestion or pick your own.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_22px_60px_rgba(10,70,53,0.12)]"
          >
            <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-deep-green/10 text-brand-deep-green">
                <UserRound className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-brand-dark-green">Complete your profile</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Usernames can use letters, numbers, underscores, or hyphens.</p>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-7">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-brand-dark-green">Username</span>
                <div className="flex min-h-12 items-center rounded-[1rem] border border-brand-deep-green/12 bg-[#fffdf8] px-4 transition-colors focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/15">
                  <span className="text-base font-semibold text-brand-deep-green">@</span>
                  <Input
                    value={username}
                    onBlur={handleCheckAvailability}
                    onChange={(event) => {
                      setUsername(event.target.value)
                      setAvailability("idle")
                      setMessage(null)
                    }}
                    className="h-11 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                    aria-invalid={showProblem}
                    aria-describedby="username-feedback"
                    autoComplete="username"
                  />
                </div>
              </label>

              <div id="username-feedback" aria-live="polite" className="min-h-6">
                {availability === "checking" ? (
                  <p className="text-sm font-medium text-muted-foreground">Checking availability...</p>
                ) : showAvailable ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    {message}
                  </p>
                ) : showProblem ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-danger">
                    <CircleAlert className="h-4 w-4" />
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">We generated a username you can use right away.</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <MithoButton type="submit" className="sm:flex-1" loading={completeMutation.isPending || availabilityMutation.isPending}>
                  Continue
                </MithoButton>
                <MithoButton
                  type="button"
                  variant="outline-secondary"
                  onClick={handleGenerateAnother}
                  loading={suggestionQuery.isFetching}
                  disabled={isBusy}
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate another
                </MithoButton>
              </div>

              {suggestionQuery.isError ? (
                <p className="text-sm font-medium text-danger">Could not generate a username right now. You can still type one manually.</p>
              ) : null}
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
