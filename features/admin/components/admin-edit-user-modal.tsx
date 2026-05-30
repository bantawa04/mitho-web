"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AdminModal } from "@/features/admin/components/admin-modal"
import type { AdminRole } from "@/types/admin-roles"
import type { AdminUserItem } from "@/types/admin-users"
import { editAdminUserSchema, type EditAdminUserFormValues } from "@/lib/validators/admin"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface AdminEditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUserItem | null
  roles: AdminRole[]
  isPending: boolean
  onSave: (values: EditAdminUserFormValues) => Promise<void>
}

export function AdminEditUserModal({ open, onOpenChange, user, roles, isPending, onSave }: AdminEditUserModalProps) {
  const form = useForm<EditAdminUserFormValues>({
    resolver: zodResolver(editAdminUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleIds: [],
    },
  })

  useEffect(() => {
    if (open && user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email,
        roleIds: user.roles.map((role) => role.id),
      })
    }
  }, [form, open, user])

  const handleConfirm = form.handleSubmit(onSave)

  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit user"
      description="Update this admin user's profile details and assigned roles."
      confirmLabel={isPending ? "Saving..." : "Save user"}
      onConfirm={handleConfirm}
      isConfirmDisabled={!form.watch("email").trim() || form.watch("roleIds").length === 0 || isPending}
      size="lg"
    >
      <Form {...form}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="First name" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Last name" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="name@mithocha.com" className="h-11 rounded-xl border-brand-deep-green/10 shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <FormControl>
                <div className="grid gap-3 rounded-2xl border border-brand-deep-green/10 p-4 sm:grid-cols-2">
                  {roles.map((role) => {
                    const checked = field.value.includes(role.id)
                    return (
                      <label
                        key={role.id}
                        className="flex items-center gap-3 rounded-xl border border-brand-deep-green/10 px-3 py-2 text-sm font-medium text-brand-dark-green"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(nextChecked) => {
                            if (nextChecked === true) {
                              field.onChange([...new Set([...field.value, role.id])])
                              return
                            }
                            field.onChange(field.value.filter((roleId) => roleId !== role.id))
                          }}
                          className="border-brand-deep-green/18 text-white data-[state=checked]:border-brand-orange data-[state=checked]:bg-brand-orange"
                        />
                        {role.name}
                      </label>
                    )
                  })}
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
