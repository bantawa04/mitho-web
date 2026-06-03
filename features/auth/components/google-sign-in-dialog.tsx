"use client"

import * as React from "react"
import { GoogleLogin } from "@react-oauth/google"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BrandLogo } from "@/components/mitho/brand-logo"
import { useGoogleLogin } from "@/hooks/use-auth-session"
import { getAuthenticatedRedirect } from "@/lib/auth/redirects"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GoogleSignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue?: () => void
  title?: string
  description?: string
  helperCopy?: string
}

const defaultTitle = "Sign in once and keep the same Mitho account for everything."
const defaultDescription =
  "Use Google to review places, save shortlists, submit listings, and later manage a business without a second account."


export function GoogleSignInDialog({
  open,
  onOpenChange,
  onContinue,
  title = defaultTitle,
  description = defaultDescription,
  helperCopy,
}: GoogleSignInDialogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const googleLogin = useGoogleLogin()
  const [error, setError] = React.useState<string | null>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] rounded-[1.75rem] border-brand-deep-green/10 bg-white p-0 shadow-[0_22px_60px_rgba(10,70,53,0.14)] sm:max-w-[520px]">
        <div className="border-b border-brand-deep-green/10 px-6 py-6 sm:px-7">
          <div className="inline-flex items-center gap-3 rounded-full border border-brand-deep-green/10 bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-brand-dark-green">
            <BrandLogo kind="icon" tone="green" className="h-6 w-auto" alt="Mitho Cha! icon" />
            Google sign-in
          </div>
          <DialogHeader className="mt-5 text-left">
            <DialogTitle className="type-section-title text-brand-dark-green">{title}</DialogTitle>
            <DialogDescription className="mt-3 text-base leading-7 text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-7">

          {googleClientId ? (
            <div className="flex justify-center">
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
                    onOpenChange(false)
                    const query = searchParams.toString()
                    const redirect = query ? `${pathname}?${query}` : pathname
                    const nextPath = getAuthenticatedRedirect(authUser, redirect)
                    if (nextPath === redirect) {
                      onContinue?.()
                    } else {
                      router.replace(nextPath)
                    }
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
          {helperCopy ? <p className="text-sm leading-7 text-muted-foreground">{helperCopy}</p> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
