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
          "max-h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-border bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          sizeClassMap[size],
        )}
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <DialogHeader className="shrink-0 space-y-0 px-6 pt-6 text-left sm:px-7 sm:pt-7">
            <DialogTitle className="text-lg font-semibold text-foreground">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">{description}</DialogDescription>
            ) : null}
          </DialogHeader>

          {children ? <div className={cn("min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-7", bodyClassName)}>{children}</div> : null}

          {showFooter ? (
            <DialogFooter className="shrink-0 flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
              {onConfirm ? (
                <Button
                  variant={confirmVariant}
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
