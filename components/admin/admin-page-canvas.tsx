import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AdminPageCanvas({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <main className={cn("min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10", className)}>{children}</main>
}
