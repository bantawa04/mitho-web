import { z } from "zod"

const optionalUrl = z.string().trim().url("Enter a valid URL").or(z.literal("")).default("")

export const businessSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name must be 200 characters or fewer"),
  description: z.string().trim().max(2000, "Description must be 2000 characters or fewer").optional(),
  listingStatus: z.enum(["pending_review", "published", "suspended", "rejected"]),
  establishmentTypeId: z.string().trim().optional(),
  logoId: z.string().optional(),
  bannerId: z.string().optional(),
  photos: z.array(z.string()).optional(),
  phone: z.string().trim().min(1, "Phone is required").max(30, "Phone must be 30 characters or fewer"),
  phoneSecondary: z.string().trim().max(30, "Phone must be 30 characters or fewer").optional(),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  provinceId: z.string().trim().min(1, "Province is required"),
  districtId: z.string().trim().min(1, "District is required"),
  municipalityId: z.string().trim().min(1, "Municipality is required"),
  wardNo: z.string().trim().min(1, "Ward No. is required").regex(/^\d+$/, "Ward No. must be a whole number"),
  area: z.string().trim().max(100, "Area must be 100 characters or fewer").optional(),
  addressLine1: z.string().trim().min(1, "Address line 1 is required").max(200, "Address must be 200 characters or fewer"),
  addressLine2: z.string().trim().max(200, "Address must be 200 characters or fewer").optional(),
  landmark: z.string().trim().max(200, "Landmark must be 200 characters or fewer").optional(),
  // Links
  websiteUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  // Amenities — services
  amenityDineIn: z.boolean().optional(),
  amenityTakeaway: z.boolean().optional(),
  amenityDelivery: z.boolean().optional(),
  // Amenities — payment
  amenityCash: z.boolean().optional(),
  amenityCard: z.boolean().optional(),
  amenityEsewa: z.boolean().optional(),
  amenityKhalti: z.boolean().optional(),
  amenityQr: z.boolean().optional(),
  // Amenities — facilities
  amenityParking: z.boolean().optional(),
  amenityWifi: z.boolean().optional(),
  amenityAirConditioning: z.boolean().optional(),
  amenityOutdoorSeating: z.boolean().optional(),
  amenityServiceCharge: z.boolean().optional(),
  // Amenities — dietary
  amenityVegetarian: z.boolean().optional(),
  amenityVegan: z.boolean().optional(),
  amenityHalal: z.boolean().optional(),
})

export type BusinessFormValues = z.infer<typeof businessSchema>

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
