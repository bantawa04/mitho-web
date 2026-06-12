"use client"

import Link from "next/link"
import { Settings, Bell, ExternalLink, User } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/mitho/mitho-card"

interface SettingsManagementProps {
  businessId: string
}

export function SettingsManagement({ businessId }: SettingsManagementProps) {
  const settingsLinks = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Edit Business Info",
      description: "Update name, description, and contact details",
      href: `/dashboard/businesses/${businessId}/edit`,
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notification Preferences",
      description: "Control email and push notifications",
      href: `/dashboard/businesses/${businessId}/settings#notification-preferences`,
    },
  ]

  return (
    <section>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Operations</p>
      <h2 className="type-section-title mb-4 text-foreground">Settings & management</h2>
      <MithoCard surface="business" interactive="none" className="rounded-lg shadow-sm">
        <MithoCardHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Quick settings</h3>
              <p className="type-meta">Manage your business profile and preferences</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {settingsLinks.map((setting, idx) => (
              <Link
                key={idx}
                href={setting.href}
                className="group cursor-pointer rounded-lg border border-border bg-white p-4 transition-colors hover:border-brand-deep-green/18"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {setting.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">{setting.title}</h4>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
