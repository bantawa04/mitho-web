import type { BusinessFormValues, BusinessOwnerFormValues } from "@/lib/validators/admin"
import type { Business } from "@/types/business"

export function readAmenityFlag(record: Record<string, unknown> | undefined, snakeKey: string, camelKey: string) {
  const value = record?.[snakeKey] ?? record?.[camelKey]
  return value === true
}

export function readLocationId(...values: Array<number | string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return String(value)
    if (typeof value === "string" && /^\d+$/.test(value)) return value
  }

  return ""
}

export function readWardNo(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  if (typeof value === "string" && /^\d+$/.test(value)) return value
  return ""
}

function buildSharedBusinessFormValues(business: Business): BusinessOwnerFormValues {
  const amenities = business.amenities
  const services = amenities?.services as Record<string, unknown> | undefined
  const payment = amenities?.payment as Record<string, unknown> | undefined
  const facilities = amenities?.facilities as Record<string, unknown> | undefined
  const dietary = amenities?.dietary as Record<string, unknown> | undefined

  return {
    name: business.name,
    description: business.description ?? "",
    establishmentTypeId: business.establishmentTypeId ?? "",
    cuisineIds: business.cuisines?.map((cuisine) => cuisine.id) ?? [],
    logoId: business.logo?.id ?? "",
    bannerId: business.banner?.id ?? "",
    photos: business.photos?.map((photo) => photo.id) ?? [],
    phone: business.phone,
    phoneSecondary: business.phoneSecondary ?? "",
    email: business.email ?? "",
    provinceId: readLocationId(business.provinceId, business.province?.id),
    districtId: readLocationId(business.districtId, business.district?.id),
    municipalityId: readLocationId(business.municipalityId, business.municipality?.id),
    wardNo: readWardNo(business.wardNo),
    area: business.area ?? "",
    nearestLandmark: business.nearestLandmark ?? "",
    addressNote: business.addressNote ?? "",
    latitude: business.latitude ?? null,
    longitude: business.longitude ?? null,
    websiteUrl: business.links?.website ?? "",
    facebookUrl: business.links?.facebook ?? "",
    instagramUrl: business.links?.instagram ?? "",
    twitterUrl: business.links?.twitter ?? "",
    youtubeUrl: business.links?.youtube ?? "",
    tiktokUrl: business.links?.tiktok ?? "",
    amenityDineIn: readAmenityFlag(services, "dine_in", "dineIn"),
    amenityTakeaway: readAmenityFlag(services, "takeaway", "takeaway"),
    amenityDelivery: readAmenityFlag(services, "delivery", "delivery"),
    amenityCash: readAmenityFlag(payment, "cash", "cash"),
    amenityCard: readAmenityFlag(payment, "card", "card"),
    amenityQr: readAmenityFlag(payment, "qr", "qr"),
    amenityParking: readAmenityFlag(facilities, "parking", "parking"),
    amenityWifi: readAmenityFlag(facilities, "wifi", "wifi"),
    amenityAirConditioning: readAmenityFlag(facilities, "air_conditioning", "airConditioning"),
    amenityOutdoorSeating: readAmenityFlag(facilities, "outdoor_seating", "outdoorSeating"),
    amenityVegetarian: readAmenityFlag(dietary, "vegetarian", "vegetarian"),
    amenityVegan: readAmenityFlag(dietary, "vegan", "vegan"),
    amenityHalal: readAmenityFlag(dietary, "halal", "halal"),
    amenityNonVeg: readAmenityFlag(dietary, "non_veg", "nonVeg"),
  }
}

export function buildBusinessOwnerFormValues(business: Business): BusinessOwnerFormValues {
  return buildSharedBusinessFormValues(business)
}

export function buildAdminBusinessFormValues(business: Business): BusinessFormValues {
  return {
    ...buildSharedBusinessFormValues(business),
    listingStatus: business.listingStatus,
  }
}
