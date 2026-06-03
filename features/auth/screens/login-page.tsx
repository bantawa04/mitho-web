"use client"

import * as React from "react"
import Link from "next/link"
import { GoogleLogin } from "@react-oauth/google"
import { useRouter, useSearchParams } from "next/navigation"
import { BrandLogo } from "@/components/mitho/brand-logo"
import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { useAuthSnapshot, useGoogleLogin } from "@/hooks/use-auth-session"
import { getAuthenticatedRedirect } from "@/lib/auth/redirects"

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authUser, isHydrated, isAuthenticated } = useAuthSnapshot()
  const googleLogin = useGoogleLogin()
  const [error, setError] = React.useState<string | null>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()
  const redirect = searchParams.get("redirect")

  React.useEffect(() => {
    if (!isHydrated || !isAuthenticated || !authUser) return
    router.replace(getAuthenticatedRedirect(authUser, redirect))
  }, [authUser, isAuthenticated, isHydrated, redirect, router])

  return (
    <div className="page-shell-customer min-h-screen">
      <Header />
      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_26%,#fffdfa_100%)] pb-20 pt-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[560px] rounded-[1.75rem] border border-brand-deep-green/10 bg-white shadow-[0_22px_60px_rgba(10,70,53,0.14)]">
            <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-brand-dark-green">
                <BrandLogo kind="icon" tone="green" className="h-6 w-auto" alt="Mitho Cha! icon" />
                Google sign-in
              </div>
              <h1 className="type-section-title mt-5 text-brand-dark-green">Sign in once and keep the same Mitho account for everything.</h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Use Google to review places, save shortlists, submit listings, and later manage a business without a second account.
              </p>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-7">
              <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  Mitho uses Google sign-in only. Once you are in, we will return you to the page you were trying to open.
                </p>
              </div>

              {googleClientId ? (
                <div className="flex justify-center rounded-[1.25rem] border border-brand-deep-green/12 bg-white px-4 py-4 shadow-[0_8px_22px_rgba(10,70,53,0.05)]">
                  <GoogleLogin
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    logo_alignment="left"
                    width="320"
                    onSuccess={async (credentialResponse) => {
                      if (!credentialResponse.credential) {
                        setError("Google did not return a sign-in credential. Please try again.")
                        return
                      }

                      try {
                        setError(null)
                        const authUser = await googleLogin.mutateAsync(credentialResponse.credential)
                        router.replace(getAuthenticatedRedirect(authUser, redirect))
                      } catch (signInError) {
                        setError(signInError instanceof Error ? signInError.message : "Google sign-in failed.")
                      }
                    }}
                    onError={() => {
                      setError("Google sign-in could not be completed. Please try again.")
                    }}
                  />
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-brand-deep-green/18 bg-[#fffdf8] p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    Google sign-in is not configured yet. Add <code className="font-semibold text-brand-dark-green">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to the web env before testing login.
                  </p>
                </div>
              )}

              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

              <p className="text-sm leading-7 text-muted-foreground">
                Just browsing instead? <Link href="/" className="font-semibold text-brand-deep-green hover:text-brand-orange">Go back home</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
