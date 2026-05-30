"use client"

import { useState } from "react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import type { AdminRole } from "@/lib/api/admin-roles"
import type { InviteAdminUserPayload } from "@/lib/api/admin-users"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminInviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: AdminRole[]
  isPending: boolean
  onInvite: (payload: InviteAdminUserPayload) => Promise<void>
}

export function AdminInviteUserModal({ open, onOpenChange, roles, isPending, onInvite }: AdminInviteUserModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [roleId, setRoleId] = useState("")

  function reset() {
    setFirstName("")
    setLastName("")
    setEmail("")
    setRoleId(roles[0]?.id ?? "")
  }

  async function handleConfirm() {
    if (!email.trim() || !roleId) return
    await onInvite({
      email: email.trim(),
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      roleIds: [roleId],
    })
    reset()
  }

  return (
    <AdminModal
      open={open}
      onOpenChange={(next) => { onOpenChange(next); if (!next) reset() }}
      title="Invite user"
      description="Create a new internal admin/staff account invite and assign the right role from the start."
      confirmLabel={isPending ? "Sending…" : "Send invite"}
      onConfirm={handleConfirm}
      isConfirmDisabled={!email.trim() || !roleId || isPending}
      size="lg"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invite-first-name">First name</Label>
          <Input
            id="invite-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-last-name">Last name</Label>
          <Input
            id="invite-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@mithocha.com"
          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={roleId} onValueChange={setRoleId}>
          <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </AdminModal>
  )
}
