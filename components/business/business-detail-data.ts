import type { BusinessPageData } from "@/components/business/business-detail-types"

const richReviews = [
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

export const richBusinessPageData: BusinessPageData = {
  name: "Himalayan Flavors",
  coverImage: "/placeholder.svg?height=600&width=1200",
  rating: 4.3,
  reviewCount: 294,
  categories: ["Restaurant", "Nepali", "Tibetan"],
  location: "Thamel, Kathmandu",
  isOpen: true,
  heroNote:
    "A reliable stop for comforting plates, generous portions, and the kind of food people in the neighborhood actually recommend to friends.",
  breadcrumbItems: [
    { label: "Home", href: "/" },
    { label: "Kathmandu", href: "/city/kathmandu" },
    { label: "Restaurants", href: "/city/kathmandu/restaurants" },
    { label: "Himalayan Flavors" },
  ],
  visitInfo: {
    address: "123 Thamel Street, Kathmandu 44600, Nepal",
    phone: "+977 1-4234567",
    website: "www.himalayanflavors.com",
    email: "info@himalayanflavors.com",
    hours: [
      { day: "Monday - Friday", time: "10:00 AM - 10:00 PM" },
      { day: "Saturday - Sunday", time: "9:00 AM - 11:00 PM" },
    ],
    cuisines: ["Nepali", "Tibetan", "Indian"],
    amenities: ["wifi", "parking", "takeaway", "cards", "dineIn", "vegan"],
    mapImage: "/map-kathmandu-thamel-location-pin.jpg",
    mapDescription: "Close to the heart of Thamel and easy to share with friends.",
    mapLinkText: "Open website and directions",
    goodToKnow:
      "Best for casual dinners, comforting plates, and taking out-of-town friends somewhere dependable.",
  },
  galleryItems: [
    { type: "image", src: "/restaurant-interior-cozy.jpg", alt: "Restaurant interior" },
    { type: "image", src: "/nepali-momo-dish.jpg", alt: "Steamed momo platter" },
    { type: "image", src: "/newari-food-platter.jpg", alt: "Newari food platter" },
    { type: "image", src: "/restaurant-exterior-storefront.jpg", alt: "Restaurant exterior" },
    { type: "image", src: "/chef-cooking-nepali-food.jpg", alt: "Chef preparing food" },
    { type: "image", src: "/nepali-thali-plate.jpg", alt: "Nepali thali plate" },
    { type: "image", src: "/steamed-momo-nepali-dumplings.jpg", alt: "Steamed momo basket" },
    { type: "image", src: "/dal-bhat-nepali-meal-set.jpg", alt: "Dal bhat meal set" },
    { type: "video", src: "/video.mp4", alt: "Short kitchen video", thumbnail: "/chef-cooking-nepali-food.jpg" },
    { type: "image", src: "/restaurant-interior-cozy.jpg", alt: "Evening dining corner" },
  ],
  galleryTotalCount: 10,
  menuItems: [
    {
      name: "Steamed Momo",
      price: "Rs. 200",
      imageUrl: "/steamed-momo-nepali-dumplings.jpg",
      note: "The plate most reviewers mention first.",
      isPopular: true,
    },
    {
      name: "Dal Bhat Set",
      price: "Rs. 350",
      imageUrl: "/dal-bhat-nepali-meal-set.jpg",
      note: "Comforting, filling, and dependable.",
    },
    {
      name: "Thukpa",
      price: "Rs. 220",
      imageUrl: "/thukpa-tibetan-noodle-soup.jpg",
      note: "A strong pick on colder evenings.",
    },
    {
      name: "Sekuwa",
      price: "Rs. 400",
      imageUrl: "/sekuwa-nepali-grilled-meat.jpg",
      note: "Worth it when you want something smoky.",
    },
  ],
  menuLink: "#",
  ratingsData: {
    ratings: { 5: 156, 4: 89, 3: 32, 2: 12, 1: 5 },
    averageRating: 4.3,
    totalReviews: 294,
  },
  reviews: richReviews,
  addReviewPrompt: "Share the details that actually help the next person decide.",
}

export const emptyBusinessPageData: BusinessPageData = {
  name: "Patan Courtyard Kitchen",
  coverImage: null,
  rating: null,
  reviewCount: 0,
  categories: ["Restaurant", "Nepali"],
  location: "Patan, Lalitpur",
  isOpen: true,
  heroNote:
    "A newly listed neighborhood spot on Mitho. The essentials are here, but the community has not added photos, dishes, or reviews yet.",
  breadcrumbItems: [
    { label: "Home", href: "/" },
    { label: "Lalitpur", href: "/city/lalitpur" },
    { label: "Restaurants", href: "/city/lalitpur/restaurants" },
    { label: "Patan Courtyard Kitchen" },
  ],
  visitInfo: {
    address: "Mangal Bazaar Lane, Patan, Lalitpur 44700, Nepal",
    phone: "+977 1-5523456",
    website: "www.patancourtyardkitchen.com",
    email: "hello@patancourtyardkitchen.com",
    hours: [
      { day: "Sunday - Friday", time: "11:00 AM - 9:30 PM" },
      { day: "Saturday", time: "11:00 AM - 10:00 PM" },
    ],
    cuisines: ["Nepali", "Newari"],
    amenities: ["takeaway", "cards", "dineIn"],
    mapImage: "/map-kathmandu-thamel-location-pin.jpg",
    mapDescription: "Tucked just off the Patan courtyard lanes and easy to reach on foot.",
    mapLinkText: "Open website and directions",
    goodToKnow:
      "Looks like a calm local option for lunch or a casual evening meal, but the community has not filled in the details yet.",
  },
  galleryItems: [],
  galleryEmptyMessage: "This business has not uploaded photos yet. You can still save it, visit it, or add the first review after you go.",
  menuItems: [],
  menuEmptyMessage: "Menu highlights have not been added yet. Once diners start reviewing, the dishes people mention most can show up here.",
  menuLink: undefined,
  ratingsData: null,
  reviews: [],
  reviewsEmptyMessage: "No one has reviewed this place on Mitho yet. If you visit, your review can help the next person decide with confidence.",
  addReviewPrompt: "Be the first to leave a useful review for this place.",
}
