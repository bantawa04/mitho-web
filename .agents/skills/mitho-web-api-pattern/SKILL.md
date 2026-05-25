---
name: mitho-web-api-pattern
description: Use this skill when adding or refactoring backend API integration in mitho-web. It enforces the project pattern `component/page -> queries -> services -> shared Axios API`, with type-safe request and response shapes, no direct API calls from UI files, and naming/layout modeled after the ecommerce-customer app.
---

# Mitho Web API Pattern

Use this skill whenever we connect `mitho-web` to `mitho-api` or refactor existing frontend data access.

The required chain is:

`component or page -> query hook in queries/ -> service in services/ -> shared Axios instance`

## Rules

1. UI files call query hooks only.
2. Query hooks call service functions only.
3. Service files own the HTTP call and use the shared Axios instance only.
4. Request payloads and response data must be typed with `interface` or `type`.
5. Never call `fetch`, `axios`, or the shared API instance directly from pages, screens, or components.

## Directory Contract

Create or use these directories at repo root:

- `config/api.ts`
  - Shared Axios instance
  - Base URL from env
  - Common headers
  - Request/response interceptors
  - `withCredentials: true` for Mitho cookie auth

- `services/FeatureService.ts`
  - Raw API functions
  - Request/response types for that feature if not shared elsewhere
  - Returns typed data only

- `queries/featureQuery.ts`
  - `useQuery`, `useMutation`, `useInfiniteQuery`
  - Query keys
  - UI-level success/error handling when needed

- `types/response.ts`
  - Shared response envelopes such as success and paginated responses

- `types/feature.ts`
  - Shared domain entities when used across multiple services/components

## Workflow

### 1. Define types first

Before writing the service, define:

- response entity type
- request payload type
- envelope type if needed

Use explicit names like:

- `Business`
- `BusinessClaim`
- `CreateBusinessPayload`
- `UpdateProfilePayload`
- `ISuccessResponse<T>`
- `PaginatedResponse<T>`

Do not use `any`.

### 2. Add or reuse the shared Axios instance

The shared API instance lives in `config/api.ts`.

It should handle:

- `baseURL`
- `Accept` and `Content-Type`
- cookie auth via `withCredentials: true`
- auth/session interceptors if the app needs refresh behavior

Do not create feature-specific Axios instances unless there is a very strong reason.

### 3. Write the service

Each service file should contain plain async functions only.

Good examples:

- `getProfile()`
- `updateProfile(payload)`
- `getAllProducts(filters, appends)`
- `submitBusinessClaim(payload)`

Service rules:

- keep the function side-effect free except for the API call
- type the Axios response
- return typed data
- build params/payload shape here, not in the component

For simple endpoints, return the unwrapped entity:

```ts
export const getProfile = async (): Promise<CustomerProfile> => {
  const { data } = await API.get<ISuccessResponse<CustomerProfile>>("/profile")
  return data.data
}
```

For paginated/meta responses, return the whole typed response:

```ts
export const getAllProducts = async (
  filters: ShopProductFilters,
  appends: ShopProductAppends,
): Promise<ShopProductsResponse<ShopProduct>> => {
  const { data } = await API.get<ShopProductsResponse<ShopProduct>>("/shop", {
    params,
  })
  return data
}
```

### 4. Write the query hook

The query file is the only layer the UI imports.

Use:

- `useQuery` for reads
- `useMutation` for writes
- `useInfiniteQuery` for infinite lists

Query rules:

- query key must include the real dependencies
- query fn must call the service
- prefer `select` for small UI-oriented reshaping
- keep toast logic or mutation success/error UX here, not in the service

Example:

```ts
export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: () => getProfile(),
    enabled,
  })
}
```

Mutation example:

```ts
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload: UpdateCustomerProfilePayload) => updateProfile(payload),
  })
}
```

### 5. Use it from the UI

In a page, screen, or component:

- import the query hook
- never import the service
- never import the Axios instance

## Naming Conventions

- service files: `ProfileService.ts`, `BusinessService.ts`
- query files: `profileQuery.ts`, `businessQuery.ts`
- payload types: `CreateXPayload`, `UpdateXPayload`
- response entity types: singular nouns like `Profile`, `Business`
- list/meta responses: `PaginatedResponse<T>` or feature-specific typed responses

Keep names boring and obvious.

## Mitho-Specific Guidance

- Default to cookie-authenticated requests, so the shared API instance should send credentials.
- If a backend response uses `{ success, data, message }`, type it with `ISuccessResponse<T>` and unwrap in the service unless the caller needs the envelope.
- If the endpoint has pagination/meta, keep the meta in the service return type and let the query decide whether to select or pass the full response through.
- If the feature is local to one domain, keep request types close to the service. If multiple screens share the entity, move it to `types/feature.ts`.

## What to Avoid

- Direct API calls in React components
- Query hooks that construct raw `axios` calls themselves
- Service functions returning `AxiosResponse`
- Untyped payloads
- `Record<string, any>`
- Copy-pasted query keys that ignore filters or pagination inputs

## Reference Pattern

Read [references/ecommerce-customer-pattern.md](references/ecommerce-customer-pattern.md) when you need concrete examples from the existing Beauty Essentials customer app.
