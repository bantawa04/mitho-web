import type { ListAdminUsersParams } from "@/types/admin-users"
import type { ListPublicCreatorsParams } from "@/lib/api/profile"
import type { ListAdminCustomersParams } from "@/types/admin-customers"
import type { ListBusinessesParams } from "@/types/business"
import type { ListBusinessClaimsParams } from "@/types/business-claims"
import type { ListCollectionsParams } from "@/types/collections"
import type { ListAdminGalleryParams } from "@/types/gallery"
import type { ListMediaParams } from "@/types/media"
import type { ListAdminReviewsParams, ListBusinessReviewsParams, ListMyReviewsParams } from "@/types/reviews"

export const queryKeys = {
  nepalAdmin: {
    provinces: {
      all: ["nepal-admin", "provinces"] as const,
      list: () => ["nepal-admin", "provinces", "list"] as const,
    },
    districts: {
      all: ["nepal-admin", "districts"] as const,
      list: (provinceId: number | null) => ["nepal-admin", "districts", provinceId] as const,
    },
    municipalities: {
      all: ["nepal-admin", "municipalities"] as const,
      list: (districtId: number | null) => ["nepal-admin", "municipalities", districtId] as const,
    },
  },
  businesses: {
    all: ["businesses"] as const,
    list: (params?: ListBusinessesParams) => ["businesses", "list", params] as const,
    detail: (id: string) => ["businesses", "detail", id] as const,
    mine: ["businesses", "mine"] as const,
    hours: (id: string) => ["businesses", id, "hours"] as const,
    gallery: (id: string) => ["businesses", id, "gallery"] as const,
  },
  establishmentTypes: {
    all: ["establishment-types"] as const,
    list: () => ["establishment-types", "list"] as const,
  },
  cuisines: {
    all: ["cuisines"] as const,
    list: () => ["cuisines", "list"] as const,
  },
  businessClaims: {
    all: ["business-claims"] as const,
    claimable: (search: string) => ["business-claims", "claimable", search] as const,
    claimableDetail: (id: string | null) => ["business-claims", "claimable", "detail", id] as const,
  },
  media: {
    all: ["media"] as const,
    list: (params?: ListMediaParams) => ["media", "list", params] as const,
  },
  collections: {
    all: ["collections"] as const,
    list: (params?: ListCollectionsParams) => ["collections", "list", params] as const,
    detail: (id: string) => ["collections", "detail", id] as const,
    publicList: (username: string, params?: Pick<ListCollectionsParams, "page" | "perPage">) =>
      ["collections", "public", username, "list", params] as const,
    publicDetail: (username: string, id: string) => ["collections", "public", username, "detail", id] as const,
  },
  profiles: {
    public: (username: string) => ["profiles", "public", username] as const,
    directory: (params: ListPublicCreatorsParams) => ["profiles", "directory", params] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    list: (businessId: string, params?: ListBusinessReviewsParams) => ["reviews", "business", businessId, params] as const,
    mine: (businessId: string) => ["reviews", "business", businessId, "mine"] as const,
    myList: (params?: ListMyReviewsParams) => ["reviews", "my-list", params] as const,
  },
  admin: {
    users: {
      all: ["admin", "users"] as const,
      list: (params: ListAdminUsersParams) => ["admin", "users", "list", params] as const,
    },
    customers: {
      all: ["admin", "customers"] as const,
      list: (params: ListAdminCustomersParams) => ["admin", "customers", "list", params] as const,
    },
    roles: {
      all: ["admin", "roles"] as const,
      list: () => ["admin", "roles", "list"] as const,
    },
    permissions: {
      all: ["admin", "permissions"] as const,
      list: () => ["admin", "permissions", "list"] as const,
    },
    establishmentTypes: {
      all: ["admin", "establishment-types"] as const,
      list: () => ["admin", "establishment-types", "list"] as const,
    },
    cuisines: {
      all: ["admin", "cuisines"] as const,
      list: () => ["admin", "cuisines", "list"] as const,
    },
    businessClaims: {
      all: ["admin", "business-claims"] as const,
      list: (params: ListBusinessClaimsParams) => ["admin", "business-claims", "list", params] as const,
      detail: (id: string | null) => ["admin", "business-claims", "detail", id] as const,
    },
    reviews: {
      all: ["admin", "reviews"] as const,
      list: (params: ListAdminReviewsParams) => ["admin", "reviews", "list", params] as const,
      detail: (id: string | null) => ["admin", "reviews", "detail", id] as const,
    },
    gallery: {
      all: ["admin", "gallery"] as const,
      list: (params: ListAdminGalleryParams) => ["admin", "gallery", "list", params] as const,
    },
  },
}
