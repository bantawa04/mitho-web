import { MithoImageGallery } from "@/components/ui/mitho-image-gallery"

const galleryItems = [
  { type: "image" as const, src: "/nepali-momo-dish.jpg", alt: "Momo dish" },
  { type: "image" as const, src: "/restaurant-interior-cozy.jpg", alt: "Restaurant interior" },
  { type: "image" as const, src: "/nepali-dal-bhat.jpg", alt: "Dal Bhat" },
  { type: "video" as const, src: "/video.mp4", alt: "Restaurant video", thumbnail: "/chef-cooking-nepali-food.jpg" },
  { type: "image" as const, src: "/restaurant-exterior-storefront.jpg", alt: "Storefront" },
  { type: "image" as const, src: "/nepali-thali-plate.jpg", alt: "Thali plate" },
  { type: "image" as const, src: "/butter-tea-nepali.jpg", alt: "Butter tea" },
  { type: "image" as const, src: "/nepali-sel-roti.jpg", alt: "Sel Roti" },
]

export function GallerySection() {
  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Photos & Videos</h2>
      <MithoImageGallery items={galleryItems} />
    </section>
  )
}
