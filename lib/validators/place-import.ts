import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => !value || /^https?:\/\/.+/i.test(value), "Enter a valid URL")

function optionalNumberString(label: string, options?: { min?: number; max?: number }) {
  return z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true
      const parsed = Number(value)
      if (!Number.isFinite(parsed)) return false
      if (typeof options?.min === "number" && parsed < options.min) return false
      if (typeof options?.max === "number" && parsed > options.max) return false
      return true
    }, `Enter a valid ${label}`)
}

const optionalIntegerString = (label: string, options?: { min?: number; max?: number }) =>
  optionalNumberString(label, options).refine((value) => !value || Number.isInteger(Number(value)), `Enter a whole-number ${label}`)

export const placeImportSearchSchema = z.object({
  query: z.string().trim().min(2, "Search query must be at least 2 characters").max(120, "Search query must be 120 characters or fewer"),
  latitude: optionalNumberString("latitude", { min: -90, max: 90 }),
  longitude: optionalNumberString("longitude", { min: -180, max: 180 }),
  radiusMeters: optionalIntegerString("radius", { min: 1, max: 50000 }),
  maxResults: optionalIntegerString("result count", { min: 1, max: 20 }),
})

export type PlaceImportSearchFormValues = z.infer<typeof placeImportSearchSchema>

export const placeImportCandidateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Name must be 255 characters or fewer"),
  phone: z.string().trim().max(100, "Phone must be 100 characters or fewer"),
  website: optionalUrl,
  formattedAddress: z.string().trim().max(2000, "Formatted address must be 2000 characters or fewer"),
  addressLine1: z.string().trim().max(255, "Address line 1 must be 255 characters or fewer"),
  addressLine2: z.string().trim().max(255, "Address line 2 must be 255 characters or fewer"),
  provinceId: optionalIntegerString("province"),
  districtId: optionalIntegerString("district"),
  municipalityId: optionalIntegerString("municipality"),
  wardNo: optionalIntegerString("ward number", { min: 1 }),
  latitude: optionalNumberString("latitude", { min: -90, max: 90 }),
  longitude: optionalNumberString("longitude", { min: -180, max: 180 }),
  establishmentTypeId: z.string().trim().max(26, "Establishment type is invalid"),
  adminNotes: z.string().trim().max(4000, "Notes must be 4000 characters or fewer"),
})

export type PlaceImportCandidateFormValues = z.infer<typeof placeImportCandidateSchema>
