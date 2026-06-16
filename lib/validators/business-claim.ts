import { z } from "zod"

export const claimRoleOptions = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "authorized-team-member", label: "Authorized team member" },
] as const

const phonePattern = /^[+]?[\d\s()-]{7,}$/

// Mirrors AllowedClaimDocumentUploadMimeTypes / MaxClaimDocumentBytes on the API.
const acceptedDocumentMimeTypes = ["image/jpeg", "image/png", "image/webp"]
const maxDocumentBytes = 10 * 1024 * 1024

export const businessClaimSchema = z.object({
  claimantName: z
    .string()
    .trim()
    .min(2, "Claimant name must be at least 2 characters.")
    .max(80, "Claimant name should stay under 80 characters."),
  role: z.enum(["owner", "manager", "authorized-team-member"], {
    message: "Choose your role for this business.",
  }),
  businessPhone: z
    .string()
    .trim()
    .refine((value) => phonePattern.test(value), "Enter a valid business phone number."),
  businessEmail: z
    .string()
    .trim()
    .email("Enter a valid business email address."),
  panVatNumber: z
    .string()
    .trim()
    .min(5, "Enter the PAN/VAT number.")
    .max(32, "PAN/VAT number should stay under 32 characters."),
  verificationDocument: z
    .custom<File | null>((value) => value === null || value instanceof File, "Upload the PAN/VAT document.")
    .refine((value) => value instanceof File, "Upload the PAN/VAT document.")
    .refine(
      (value) => !(value instanceof File) || acceptedDocumentMimeTypes.includes(value.type),
      "Upload an image file (JPG, PNG, or WebP).",
    )
    .refine(
      (value) => !(value instanceof File) || value.size <= maxDocumentBytes,
      "The document must be 10MB or smaller.",
    ),
  authorizationConfirmed: z.boolean().refine((value) => value, {
    message: "You need to confirm that you are allowed to claim this listing.",
  }),
})

export type BusinessClaimFormValues = z.infer<typeof businessClaimSchema>
export type BusinessClaimFormInputValues = z.input<typeof businessClaimSchema>
