"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AdminModal } from "@/features/admin/components/admin-modal"
import type { AdminRole } from "@/types/admin-roles"
import type { InviteAdminUserPayload } from "@/types/admin-users"
import { inviteAdminUserSchema, type InviteAdminUserFormValues } from "@/lib/validators/admin"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminInviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: AdminRole[]
  isPending: boolean
  onInvite: (payload: InviteAdminUserPayload) => Promise<void>
}

export function AdminInviteUserModal({ open, onOpenChange, roles, isPending, onInvite }: AdminInviteUserModalProps) {
  const form = useForm<InviteAdminUserFormValues>({
    resolver: zodResolver(inviteAdminUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleIds: [],
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        roleIds: roles[0]?.id ? [roles[0].id] : [],
      })
    }
  }, [form, open, roles])

  function reset() {
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      roleIds: roles[0]?.id ? [roles[0].id] : [],
    })
  }

  const handleConfirm = form.handleSubmit(async (values) => {
    await onInvite({
      email: values.email,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      roleIds: values.roleIds,
    })
    reset()
  })

  return (
    <AdminModal
      open={open}
      onOpenChange={(next) => { onOpenChange(next); if (!next) reset() }}
      title="Invite user"
      description="Create a new internal admin/staff account invite and assign the right role from the start."
      confirmLabel={isPending ? "Sending…" : "Send invite"}
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
                <Input
                  {...field}
                  type="email"
                  placeholder="name@mithocha.com"
                  className="h-11 rounded-xl border-brand-deep-green/10 shadow-none"
                />
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
              <FormLabel>Role</FormLabel>
              <Select value={field.value[0] ?? ""} onValueChange={(value) => field.onChange([value])}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-xl border-brand-deep-green/10 bg-white shadow-none">
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </AdminModal>
  )
}
