import { z } from "zod"

const websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i
const phonePattern = /^[+]?[\d\s()-]{7,}$/

export const BUSINESS_ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "authorized-team-member", label: "Authorized team member" },
] as const

export const addBusinessSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters.")
    .max(80, "Business name should stay under 80 characters."),
  primaryCategory: z
    .string()
    .min(1, "Choose a valid business category."),
  shortNote: z
    .string()
    .trim()
    .max(140, "Short note should stay under 140 characters.")
    .optional()
    .or(z.literal("")),
  provinceId: z.string().trim().min(1, "Choose a valid province."),
  districtId: z.string().trim().min(1, "Choose a valid district."),
  municipalityId: z.string().trim().min(1, "Choose a valid municipality."),
  wardNo: z.string().trim().min(1, "Ward No. is required.").regex(/^\d+$/, "Ward No. must be a whole number."),
  area: z
    .string()
    .trim()
    .max(100, "Area / Neighbourhood should stay under 100 characters.")
    .optional()
    .or(z.literal("")),
  addressLine1: z
    .string()
    .trim()
    .min(4, "Address 1 is required.")
    .max(120, "Address 1 should stay under 120 characters."),
  addressLine2: z
    .string()
    .trim()
    .max(120, "Address 2 should stay under 120 characters.")
    .optional()
    .or(z.literal("")),
  landmark: z
    .string()
    .trim()
    .max(120, "Landmark should stay under 120 characters.")
    .optional()
    .or(z.literal("")),
  latitude: z
    .number()
    .min(-90, "Choose a valid location from the map.")
    .max(90, "Choose a valid location from the map.")
    .nullable(),
  longitude: z
    .number()
    .min(-180, "Choose a valid location from the map.")
    .max(180, "Choose a valid location from the map.")
    .nullable(),
  phone: z
    .string()
    .trim()
    .refine((value) => phonePattern.test(value), "Enter a valid phone number."),
  publicEmail: z
    .string()
    .trim()
    .email("Enter a valid public email address."),
  website: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || websitePattern.test(value), "Enter a valid website URL.")
    .optional()
    .or(z.literal("")),
  facebookUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || websitePattern.test(value), "Enter a valid Facebook URL.")
    .optional()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || websitePattern.test(value), "Enter a valid Instagram URL.")
    .optional()
    .or(z.literal("")),
  tiktokUrl: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || websitePattern.test(value), "Enter a valid TikTok URL.")
    .optional()
    .or(z.literal("")),
  relationshipRole: z.enum(["owner", "manager", "authorized-team-member"], {
    message: "Choose your relationship to the business.",
  }),
  authorizationConfirmed: z.boolean().refine((value) => value, {
    message: "You need to confirm that you are allowed to manage this listing.",
  }),
}).superRefine((values, ctx) => {
  if (values.latitude === null || values.longitude === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Place the marker on the map to save the business location.",
      path: ["latitude"],
    })
  }
})

export type AddBusinessFormValues = z.infer<typeof addBusinessSchema>
