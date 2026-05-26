# Ecommerce Customer Pattern Reference

Use these files as the source pattern:

- Axios instance: `/Users/pawan/projects/beauty-essentials/v2/ecommerce-customer/config/api.ts`
- Query example: `/Users/pawan/projects/beauty-essentials/v2/ecommerce-customer/queries/profileQuery.ts`
- Service example: `/Users/pawan/projects/beauty-essentials/v2/ecommerce-customer/services/ProfileService.ts`
- Response envelopes: `/Users/pawan/projects/beauty-essentials/v2/ecommerce-customer/types/response.ts`

## Pattern Summary

### 1. Shared Axios instance

The app uses one `API` instance that:

- sets `baseURL`
- sets common headers
- injects auth in a request interceptor
- handles retry/401/404 behavior in a response interceptor

This is the only place where raw Axios setup belongs.

### 2. Service layer

Services:

- import `API`
- define request/response types
- perform the HTTP request
- return typed data

Example shape:

```ts
export interface CustomerProfile {
  firstName: string | null
  lastName: string | null
  email: string
}

export type UpdateCustomerProfilePayload = Partial<
  Pick<CustomerProfile, "firstName" | "lastName">
>

export const getProfile = async (): Promise<CustomerProfile> => {
  const { data } = await API.get<ISuccessResponse<CustomerProfile>>("/profile")
  return data.data
}
```

### 3. Query layer

Queries:

- import service functions
- define `useQuery` / `useMutation`
- own query keys
- optionally own toast UX

Example shape:

```ts
export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: () => getProfile(),
    enabled,
  })
}
```

### 4. Typed response envelopes

Shared envelopes are in `types/response.ts`.

Examples:

```ts
export interface ISuccessResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    totalPages: number
    perPage: number
    totalItems: number
  }
}
```

## How to Apply This in Mitho Web

When adding a new endpoint:

1. add or reuse the entity/payload types
2. add the service function in `services/`
3. add the query hook in `queries/`
4. import the query hook from the page/component

Never skip the service layer.
