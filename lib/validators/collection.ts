import { z } from "zod"

export const collectionVisibilityOptions = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
] as const

export const collectionSchema = z.object({
  title: z.string().trim().min(2, "Collection title should be at least 2 characters.").max(60, "Keep the title under 60 characters."),
  description: z
    .string()
    .trim()
    .max(240, "Keep the description under 240 characters.")
    .optional()
    .or(z.literal("")),
  visibility: z.enum(["private", "public"]),
})

export type CollectionFormValues = z.infer<typeof collectionSchema>
