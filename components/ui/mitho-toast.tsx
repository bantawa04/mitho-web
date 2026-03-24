"use client"

import type * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        success: "border-success/30 bg-success text-success-foreground",
        info: "border-info/30 bg-info text-info-foreground",
        warning: "border-warning/30 bg-warning text-warning-foreground",
        danger: "border-danger/30 bg-danger text-danger-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
}

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "info" | "warning" | "danger"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function MithoToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <MithoToastViewport />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a MithoToastProvider")
  }
  return context
}

function MithoToastViewport() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]">
      {toasts.map((toast) => (
        <MithoToast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface MithoToastProps extends VariantProps<typeof toastVariants> {
  id: string
  title?: string
  description?: string
  onDismiss?: () => void
}

function MithoToast({ variant = "default", title, description, onDismiss }: MithoToastProps) {
  const Icon = iconMap[variant || "default"]

  return (
    <div className={cn(toastVariants({ variant }))} data-state="open" role="alert">
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className={cn("text-sm", title && "mt-1 opacity-90")}>{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export { MithoToast, MithoToastViewport }
