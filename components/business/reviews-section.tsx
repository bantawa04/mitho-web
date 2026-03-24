"use client"

import * as React from "react"
import { MithoReviewCard } from "@/components/ui/mitho-review-card"
import { MithoPagination } from "@/components/ui/mitho-pagination"

const allReviews = [
  {
    author: "Priya Sharma",
    authorImage: "/woman-portrait.png",
    rating: 5,
    date: "2 days ago",
    content:
      "Amazing food! The momos here are the best I've had in Kathmandu. The staff is friendly and the ambiance is cozy. Highly recommend the steamed chicken momos and the thukpa.",
    media: [
      { type: "image" as const, src: "/momos-dumplings.jpg" },
      { type: "image" as const, src: "/thukpa-soup.jpg" },
    ],
    helpful: 24,
    ownerResponse: {
      content:
        "Thank you so much for your kind words, Priya! We're delighted you enjoyed our momos and thukpa. Looking forward to serving you again soon!",
      date: "1 day ago",
    },
  },
  {
    author: "Ramesh Thapa",
    authorImage: "/thoughtful-man-portrait.png",
    rating: 4,
    date: "1 week ago",
    content:
      "Good food and reasonable prices. The dal bhat set is generous and tasty. Only minor complaint is the wait time during peak hours can be a bit long.",
    helpful: 12,
  },
  {
    author: "Sita Gurung",
    authorImage: "/diverse-woman-smiling.png",
    rating: 5,
    date: "2 weeks ago",
    content:
      "My go-to place for authentic Nepali food! The sekuwa is fantastic and reminds me of home cooking. Love the traditional decor too.",
    media: [{ type: "image" as const, src: "/sekuwa-grilled-meat.jpg" }],
    helpful: 8,
  },
  {
    author: "Bikash Rai",
    authorImage: "/young-man-contemplative.png",
    rating: 4,
    date: "3 weeks ago",
    content:
      "Great spot for lunch with colleagues. The set meal is value for money and the portions are generous. Service is quick and friendly.",
    helpful: 6,
  },
  {
    author: "Maya Tamang",
    authorImage: "/middle-aged-woman.png",
    rating: 5,
    date: "1 month ago",
    content:
      "Brought my family here for a celebration and we all loved it! The newari khaja set was authentic and delicious. Will definitely come back.",
    media: [{ type: "image" as const, src: "/newari-food-platter.jpg" }],
    helpful: 15,
  },
  {
    author: "Sujan Shrestha",
    authorImage: "/man-glasses.png",
    rating: 3,
    date: "1 month ago",
    content:
      "Food is decent but nothing exceptional. The place gets quite crowded during lunch hours which can be uncomfortable. Prices are fair though.",
    helpful: 4,
  },
]

const REVIEWS_PER_PAGE = 3

interface ReviewsSectionProps {
  sortOrder?: string
}

export function ReviewsSection({ sortOrder = "all" }: ReviewsSectionProps) {
  const [currentPage, setCurrentPage] = React.useState(1)

  // Sort reviews based on sortOrder
  const sortedReviews = React.useMemo(() => {
    const reviews = [...allReviews]
    if (sortOrder === "latest") {
      return reviews // Already sorted by latest in mock data
    } else if (sortOrder === "oldest") {
      return reviews.reverse()
    }
    return reviews
  }, [sortOrder])

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE)

  const paginatedReviews = React.useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
    return sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE)
  }, [sortedReviews, currentPage])

  // Reset to page 1 when sort order changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [sortOrder])

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="space-y-4">
        {paginatedReviews.map((review, index) => (
          <MithoReviewCard key={`${review.author}-${index}`} {...review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <MithoPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </section>
  )
}
