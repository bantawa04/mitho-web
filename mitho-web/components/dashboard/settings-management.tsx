"use client"

import { Settings, Clock, Bell, User, ExternalLink } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"

export function SettingsManagement() {
  const settingsLinks = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Edit Business Info",
      description: "Update name, description, and contact details",
      href: "#",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Manage Opening Hours",
      description: "Set your business hours and special schedules",
      href: "#",
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: "Notification Preferences",
      description: "Control email and push notifications",
      href: "#",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Account Settings",
      description: "Manage password, security, and preferences",
      href: "#",
    },
  ]

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Settings & Management</h2>
      <MithoCard>
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Quick Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your business profile and preferences</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsLinks.map((setting, idx) => (
              <a
                key={idx}
                href={setting.href}
                className="group p-4 rounded-xl border border-border hover:border-brand-orange/30 hover:bg-brand-soft-beige/10 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
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
              </a>
            ))}
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
