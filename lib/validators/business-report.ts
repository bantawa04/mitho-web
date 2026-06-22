import { z } from "zod"

export const businessReportReasons = [
  "phone",
  "address",
  "hours",
  "website_social",
  "business_closed",
  "duplicate",
  "wrong_photos",
  "other",
] as const

export const businessReportSchema = z
  .object({
    reason: z.enum(businessReportReasons, "Choose what looks incorrect."),
    suggestedCorrection: z.string().trim().max(2000, "Correction must be 2000 characters or fewer").optional(),
    note: z.string().trim().max(2000, "Note must be 2000 characters or fewer").optional(),
    reporterEmail: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!data.suggestedCorrection?.trim() && !data.note?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a correction or short note.",
        path: ["note"],
      })
    }
  })

export type BusinessReportFormValues = z.infer<typeof businessReportSchema>

export const reportResolutionSchema = z.object({
  resolutionNote: z.string().trim().min(2, "Add a short operator note.").max(2000, "Note must be 2000 characters or fewer"),
})

export type ReportResolutionFormValues = z.infer<typeof reportResolutionSchema>
