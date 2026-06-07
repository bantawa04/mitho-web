"use client"

import { AdminModal } from "@/features/admin/components/admin-modal"
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge"
import { formatDate } from "@/features/admin/utils/admin-users-utils"
import { getUserStatusPresentation } from "@/features/admin/utils/admin-status-utils"
import type { AdminRole } from "@/types/admin-roles"
import type { AdminUserItem } from "@/types/admin-users"

interface AdminUserDetailModalProps {
  user: AdminUserItem | null
  onClose: () => void
}

export function AdminUserDetailModal({ user, onClose }: AdminUserDetailModalProps) {
  return (
    <AdminModal
      open={user !== null}
      onOpenChange={(open) => { if (!open) onClose() }}
      title="User details"
      description="Inspect the internal user record and assigned access from one place."
      showFooter={false}
      size="lg"
    >
      {user ? (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Name</p>
              <p className="text-sm font-semibold text-brand-dark-green">{user.fullName || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Roles</p>
              <p className="text-sm font-semibold text-brand-dark-green">
                {user.roles.map((r) => r.name).join(", ") || "Unassigned"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Joined</p>
              <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-deep-green/10 bg-brand-soft-beige/18 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Status</p>
            <AdminStatusBadge {...getUserStatusPresentation(user.status)} className="mt-2" />
          </div>

          {user.roles.length > 0 && (
            <div className="space-y-2 border-t border-brand-deep-green/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">Assigned permissions</p>
              <div className="flex flex-wrap gap-2">
                {user.roles.flatMap((r) =>
                  r.name === "super_admin"
                    ? [{ id: "all", name: "All permissions (super admin)" }]
                    : (r as AdminRole).permissions ?? [],
                ).map((p) => (
                  <span key={p.id} className="inline-flex rounded-full border border-brand-deep-green/10 bg-white px-3 py-1.5 text-sm text-brand-dark-green">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </AdminModal>
  )
}
