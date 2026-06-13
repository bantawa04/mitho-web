import { z } from "zod"

export const addReviewSchema = z.object({
  title: z.string().trim().min(3, "Add a short title (at least 3 characters).").max(120, "Title should stay under 120 characters."),
  rating: z.number().min(1, "Choose a rating.").max(5, "Choose a valid rating."),
  body: z.string().trim().min(10, "Review should be at least 10 characters.").max(5000, "Review should stay under 5000 characters."),
  tips: z.string().trim().max(500, "Tips should stay under 500 characters.").optional().or(z.literal("")),
})

export type AddReviewFormValues = z.infer<typeof addReviewSchema>

export const reviewReplySchema = z.object({
  body: z.string().trim().min(1, "Reply is required.").max(5000, "Reply should stay under 5000 characters."),
})

export type ReviewReplyFormValues = z.infer<typeof reviewReplySchema>
