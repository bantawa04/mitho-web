"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, Bell, User, ExternalLink } from "lucide-react"
import { useMockAuth } from "@/components/auth/mock-auth-provider"
import { MithoCard, MithoCardHeader, MithoCardContent } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"

interface SettingsManagementProps {
  businessId: string
}

export function SettingsManagement({ businessId }: SettingsManagementProps) {
  const router = useRouter()
  const { currentUser, signOut } = useMockAuth()
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
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Operations</p>
      <h2 className="type-section-title mb-6 text-foreground">Settings & management</h2>
      <MithoCard surface="business" interactive="subtle">
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Quick settings</h3>
              <p className="type-meta">Manage your business profile and preferences</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {settingsLinks.map((setting, idx) => (
              <Link
                key={idx}
                href={setting.href}
                className="group cursor-pointer rounded-[1rem] border border-brand-deep-green/10 bg-white p-4 transition-all duration-200 hover:border-brand-deep-green/18"
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
              </Link>
            ))}
          </div>
        </MithoCardContent>
      </MithoCard>

      <MithoCard surface="business" interactive="subtle" className="mt-6">
        <MithoCardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft-beige text-brand-orange">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="type-card-title text-foreground">Account & session</h3>
              <p className="type-meta">This business workspace is tied to the same Mitho identity you use across the app.</p>
            </div>
          </div>
        </MithoCardHeader>
        <MithoCardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatarUrl || "/placeholder.svg"}
                alt={currentUser?.name || "Current user"}
                className="h-12 w-12 rounded-full border-4 border-brand-soft-beige object-cover"
              />
              <div>
                <p className="font-semibold text-foreground">{currentUser?.name || "Signed-in account"}</p>
                <p className="text-sm text-muted-foreground">Log out here if you need to leave both customer and business-owner tools.</p>
              </div>
            </div>
            <MithoButton
              type="button"
              variant="outline-secondary"
              className="border-danger/20 text-danger hover:bg-danger/10 hover:text-danger"
              onClick={() => {
                signOut()
                router.push("/")
              }}
            >
              Log out
            </MithoButton>
          </div>
        </MithoCardContent>
      </MithoCard>
    </section>
  )
}
