import { z } from "zod"

export const inviteStaffSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
})

export type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>
