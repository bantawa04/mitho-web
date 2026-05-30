"use client"

import { useEffect, useState } from "react"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { adminPermissionActions, adminPermissionMatrix, type AdminPermissionAction, type AdminPermissionResource } from "@/features/admin/data/admin-data"
import { buildDefaultMatrix, matrixToPermissionIds, PERMISSION_MATRIX_MAP, permissionsToMatrix, type PermissionMatrix } from "@/features/admin/utils/admin-users-utils"
import type { AdminPermission, AdminRole } from "@/lib/api/admin-roles"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AdminRoleEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingRole: AdminRole | null
  allPermissions: AdminPermission[]
  isPending: boolean
  onSave: (name: string, permissionIds: string[]) => Promise<void>
}

export function AdminRoleEditorModal({ open, onOpenChange, editingRole, allPermissions, isPending, onSave }: AdminRoleEditorModalProps) {
  const [roleName, setRoleName] = useState("")
  const [matrix, setMatrix] = useState<PermissionMatrix>(buildDefaultMatrix)

  useEffect(() => {
    if (open) {
      setRoleName(editingRole?.name ?? "")
      setMatrix(editingRole ? permissionsToMatrix(editingRole.permissions) : buildDefaultMatrix())
    }
  }, [open, editingRole])

  function togglePermission(resource: AdminPermissionResource, action: AdminPermissionAction, checked: boolean) {
    setMatrix((current) => ({
      ...current,
      [resource]: { ...current[resource], [action]: checked },
    }))
  }

  async function handleSave() {
    if (!roleName.trim()) return
    await onSave(roleName.trim(), matrixToPermissionIds(matrix, allPermissions))
  }

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={editingRole ? "Edit role" : "Add new role"}
      description="Define a role name and choose the grouped permissions this role can access."
      confirmLabel={isPending ? "Saving…" : "Save role"}
      onConfirm={handleSave}
      isConfirmDisabled={!roleName.trim() || isPending}
      size="xl"
    >
      <div className="space-y-2">
        <Label htmlFor="role-name">Name</Label>
        <Input
          id="role-name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role name"
          className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
        />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-brand-dark-green">Permissions</p>
          <p className="text-sm text-muted-foreground">Read covers both list access and individual detail access.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-deep-green/10">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-brand-deep-green/10 bg-brand-soft-beige/18">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">
                    Resource
                  </th>
                  {adminPermissionActions.map((action) => (
                    <th key={action} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep-green/55">
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adminPermissionMatrix.map(({ resource, label, actions }) => (
                  <tr key={resource} className="border-b border-brand-deep-green/10 last:border-b-0">
                    <td className="px-4 py-4 text-sm font-semibold text-brand-dark-green">{label}</td>
                    {adminPermissionActions.map((action) => {
                      const isSupported = actions.includes(action)
                      const hasMappedPermission = !!PERMISSION_MATRIX_MAP[resource]?.[action]
                      return (
                        <td key={`${resource}-${action}`} className="px-4 py-4 text-center">
                          {isSupported && hasMappedPermission ? (
                            <Checkbox
                              checked={Boolean(matrix[resource]?.[action])}
                              onCheckedChange={(checked) => togglePermission(resource, action, checked === true)}
                              className="mx-auto border-brand-deep-green/18 text-white data-[state=checked]:border-brand-orange data-[state=checked]:bg-brand-orange"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminModal>
  )
}
