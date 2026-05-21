"use client"

import type { ReactNode } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdminRowActionItem {
  label: string
  icon: ReactNode
  onSelect: () => void
  variant?: "default" | "destructive"
}

export function AdminRowActions({ items }: { items: AdminRowActionItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-brand-dark-green hover:bg-brand-soft-beige/45"
          aria-label="Open row actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[11rem] rounded-xl border-brand-deep-green/10 bg-white p-1.5 shadow-[0_18px_40px_rgba(10,70,53,0.12)]"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            variant={item.variant ?? "default"}
            className="rounded-lg px-3 py-2 text-sm font-medium"
            onSelect={item.onSelect}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
