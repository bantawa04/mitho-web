"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AdminModal } from "@/features/admin/components/admin-modal"
import { adminPermissionActions, adminPermissionMatrix } from "@/features/admin/data/admin-data"
import { PERMISSION_MATRIX_MAP } from "@/features/admin/utils/admin-users-utils"
import type { AdminPermission, AdminRole } from "@/types/admin-roles"
import { roleSchema, type RoleFormValues } from "@/lib/validators/admin"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AdminRoleEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingRole: AdminRole | null
  allPermissions: AdminPermission[]
  isPending: boolean
  onSave: (name: string, description: string | undefined, permissionIds: string[]) => Promise<void>
}

export function AdminRoleEditorModal({ open, onOpenChange, editingRole, allPermissions, isPending, onSave }: AdminRoleEditorModalProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissionIds: [],
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: editingRole?.name ?? "",
        description: editingRole?.description ?? "",
        permissionIds: editingRole?.permissions.map((permission) => permission.id) ?? [],
      })
    }
  }, [editingRole, form, open])

  const permissionIdByName = new Map(allPermissions.map((permission) => [permission.name, permission.id]))

  const handleSave = form.handleSubmit(async (values) => {
    await onSave(values.name, values.description || undefined, values.permissionIds)
  })

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={editingRole ? "Edit role" : "Add new role"}
      description="Define a role name and choose the grouped permissions this role can access."
      confirmLabel={isPending ? "Saving…" : "Save role"}
      onConfirm={handleSave}
      isConfirmDisabled={!form.watch("name").trim() || isPending}
      size="xl"
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={editingRole?.isSystem}
                  placeholder="Role name"
                  className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What this role is responsible for"
                  className="min-h-24 rounded-xl border-brand-deep-green/10 shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissionIds"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="space-y-1">
                <FormLabel>Permissions</FormLabel>
                <p className="text-sm text-muted-foreground">Read covers both list access and individual detail access.</p>
              </div>

              <FormControl>
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
                              const permissionName = PERMISSION_MATRIX_MAP[resource]?.[action]
                              const permissionId = permissionName ? permissionIdByName.get(permissionName) : undefined
                              const isSupported = actions.includes(action) && !!permissionId

                              return (
                                <td key={`${resource}-${action}`} className="px-4 py-4 text-center">
                                  {isSupported && permissionId ? (
                                    <Checkbox
                                      checked={field.value.includes(permissionId)}
                                      onCheckedChange={(checked) => {
                                        if (checked === true) {
                                          field.onChange([...new Set([...field.value, permissionId])])
                                          return
                                        }
                                        field.onChange(field.value.filter((id) => id !== permissionId))
                                      }}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </AdminModal>
  )
}
