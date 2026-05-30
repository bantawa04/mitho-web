import type { ListAdminUsersParams } from "@/types/admin-users"

export const queryKeys = {
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
