import type { ListAdminUsersParams } from "@/types/admin-users"
import type { ListBusinessesParams } from "@/types/business"
import type { ListMediaParams } from "@/types/media"

export const queryKeys = {
  businesses: {
    all: ["businesses"] as const,
    list: (params?: ListBusinessesParams) => ["businesses", "list", params] as const,
    detail: (id: string) => ["businesses", "detail", id] as const,
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
