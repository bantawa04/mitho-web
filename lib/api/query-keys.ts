import type { ListAdminUsersParams } from "@/types/admin-users"
import type { ListBusinessesParams } from "@/types/business"
import type { ListMediaParams } from "@/types/media"

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
  },
  establishmentTypes: {
    all: ["establishment-types"] as const,
    list: () => ["establishment-types", "list"] as const,
  },
  media: {
    all: ["media"] as const,
    list: (params?: ListMediaParams) => ["media", "list", params] as const,
  },
  admin: {
    users: {
      all: ["admin", "users"] as const,
      list: (params: ListAdminUsersParams) => ["admin", "users", "list", params] as const,
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
  },
}
