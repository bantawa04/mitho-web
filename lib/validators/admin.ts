import { z } from "zod"

export const establishmentTypeSchema = z.object({
  label: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or fewer"),
  status: z.enum(["active", "disabled"]),
})

export type EstablishmentTypeFormValues = z.infer<typeof establishmentTypeSchema>

export const inviteAdminUserSchema = z.object({
  firstName: z.string().trim().max(100, "First name must be 100 characters or fewer").optional(),
  lastName: z.string().trim().max(100, "Last name must be 100 characters or fewer").optional(),
  email: z.string().trim().email("Enter a valid email address"),
  roleIds: z.array(z.string().min(1)).min(1, "Choose a role"),
})

export type InviteAdminUserFormValues = z.infer<typeof inviteAdminUserSchema>

export const editAdminUserSchema = z.object({
  firstName: z.string().trim().max(100, "First name must be 100 characters or fewer").optional(),
  lastName: z.string().trim().max(100, "Last name must be 100 characters or fewer").optional(),
  email: z.string().trim().email("Enter a valid email address"),
  roleIds: z.array(z.string().min(1)).min(1, "Choose at least one role"),
})

export type EditAdminUserFormValues = z.infer<typeof editAdminUserSchema>

export const roleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters").max(100, "Role name must be 100 characters or fewer"),
  description: z.string().trim().max(500, "Description must be 500 characters or fewer").optional(),
  permissionIds: z.array(z.string().min(1)),
})

export type RoleFormValues = z.infer<typeof roleSchema>
