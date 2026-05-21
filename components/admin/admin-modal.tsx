"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type AdminModalSize = "sm" | "md" | "lg" | "xl" | "2xl"

const sizeClassMap: Record<AdminModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
  "2xl": "sm:max-w-4xl",
}

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  showFooter?: boolean
  size?: AdminModalSize
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  isConfirmDisabled?: boolean
  isLoading?: boolean
  bodyClassName?: string
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  onConfirm,
  showFooter = true,
  size = "md",
  confirmVariant = "default",
  isConfirmDisabled = false,
  isLoading = false,
  bodyClassName,
}: AdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[calc(100%-2rem)] rounded-[1.75rem] border-brand-deep-green/10 bg-white p-0 shadow-[0_24px_60px_rgba(10,70,53,0.16)]",
          sizeClassMap[size],
        )}
      >
        <div className="space-y-6 p-6 sm:p-7">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-semibold text-brand-dark-green">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="mt-2 text-sm leading-7 text-muted-foreground">{description}</DialogDescription>
            ) : null}
          </DialogHeader>

          {children ? <div className={cn("space-y-5", bodyClassName)}>{children}</div> : null}

          {showFooter ? (
            <DialogFooter className="flex-col-reverse gap-3 border-t border-brand-deep-green/10 pt-5 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-xl border-brand-deep-green/14 text-brand-dark-green hover:bg-brand-soft-beige/40"
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              {onConfirm ? (
                <Button
                  variant={confirmVariant}
                  className={cn(
                    "rounded-xl",
                    confirmVariant === "default" && "bg-brand-dark-green text-white hover:bg-brand-dark-green/92",
                    confirmVariant === "destructive" && "bg-red-600 text-white hover:bg-red-600/92",
                  )}
                  onClick={onConfirm}
                  disabled={isConfirmDisabled || isLoading}
                >
                  {isLoading ? "Working..." : confirmLabel}
                </Button>
              ) : null}
            </DialogFooter>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AdminConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  isLoading?: boolean
}

export function AdminConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
}: AdminConfirmModalProps) {
  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={onConfirm}
      confirmVariant="destructive"
      isLoading={isLoading}
      size="sm"
    />
  )
}
