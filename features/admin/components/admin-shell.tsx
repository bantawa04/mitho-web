"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AdminPageCanvas } from "@/features/admin/components/admin-page-canvas"
import { AdminSidebarFrame } from "@/features/admin/components/admin-sidebar"
import { AdminTopbar } from "@/features/admin/components/admin-topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <AdminSidebarFrame pathname={pathname} />
      <SidebarInset className="min-h-screen bg-transparent shadow-none md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none">
        <div className="min-w-0">
          <AdminTopbar pathname={pathname} />
          <AdminPageCanvas>{children}</AdminPageCanvas>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
