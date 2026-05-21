"use client"

import * as React from "react"
import { BrandLogo } from "@/components/mitho/brand-logo"
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
const defaultHelperCopy =
  "For now, Mitho uses Google sign-in only. Once the real auth hook is connected, this same modal will be the entry point for login and signup."

export function GoogleSignInDialog({
  open,
  onOpenChange,
  onContinue,
  title = defaultTitle,
  description = defaultDescription,
  helperCopy = defaultHelperCopy,
}: GoogleSignInDialogProps) {
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
          <div className="rounded-[1.25rem] border border-brand-deep-green/10 bg-[#fffdf8] p-4">
            <p className="text-sm leading-7 text-muted-foreground">{helperCopy}</p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-brand-deep-green/12 bg-white px-5 py-3.5 text-sm font-semibold text-brand-dark-green shadow-[0_8px_22px_rgba(10,70,53,0.05)] transition-colors hover:bg-brand-soft-beige/45"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 4 1.5l2.7-2.7C17 2.7 14.8 1.8 12 1.8 6.9 1.8 2.8 6 2.8 11.2S6.9 20.6 12 20.6c6.9 0 8.6-4.8 8.6-7.2 0-.5-.1-.9-.1-1.2H12Z" />
                <path fill="#34A853" d="M2.8 11.2c0 1.7.6 3.3 1.7 4.5l3-2.3c-.4-.6-.6-1.4-.6-2.2s.2-1.5.6-2.2l-3-2.3c-1.1 1.2-1.7 2.8-1.7 4.5Z" />
                <path fill="#FBBC05" d="M12 20.6c2.8 0 5.1-.9 6.8-2.5l-3.2-2.6c-.9.7-2.1 1.2-3.6 1.2-2.5 0-4.6-1.7-5.4-4l-3.1 2.4c1.8 3.3 5.1 5.5 8.5 5.5Z" />
                <path fill="#4285F4" d="M18.8 18.1c1.9-1.7 2.8-4.1 2.8-6.9 0-.5-.1-.9-.1-1.2H12v3.9h5.5c-.2 1.1-.9 2.7-2.7 3.9l4 3.1Z" />
              </svg>
            </span>
            Continue with Google
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
