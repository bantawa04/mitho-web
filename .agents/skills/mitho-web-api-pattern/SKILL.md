---
name: mitho-web-api-pattern
description: Use this skill when adding or refactoring backend API integration in mitho-web. It defines the Mitho project boundary for typed API access, React Query hooks, server-side data functions, shared Axios usage, and avoiding raw HTTP calls from reusable UI.
---

# Mitho Web API Pattern

Use this skill whenever we connect `mitho-web` to `mitho-api` or refactor existing frontend data access.

Use the right pattern for the rendering context:

- Client-side data: `client component/page -> query hook -> service/API function -> shared Axios instance`
- Server-side data: `server page/layout/component -> server data function -> fetch or server API client`

## Rules

1. Client UI files call query hooks for remote data.
2. Query hooks call service/API functions only.
3. Client service/API files own browser HTTP calls and use the shared Axios instance.
4. Server pages, layouts, route handlers, and Server Actions may use server-only data functions instead of React Query.
5. Request payloads and response data must be typed with `interface` or `type`.
6. Never call `axios` or the shared API instance directly from reusable components.
7. Do not force React Query into Server Components just to satisfy the client-side pattern.

## Directory Contract

Prefer the current Mitho layout unless intentionally migrating a whole feature:

- `config/api.ts`
  - Shared Axios instance
  - Base URL from env
  - Common headers
  - Request/response interceptors
  - `withCredentials: true` for Mitho cookie auth

- `lib/api/feature.ts` or `services/FeatureService.ts`
  - Raw API functions
  - Request/response types for that feature if not shared elsewhere
  - Returns typed data only
  - Uses the shared Axios instance for client/browser requests

- `hooks/use-feature.ts` or `queries/featureQuery.ts`
  - `useQuery`, `useMutation`, `useInfiniteQuery`
  - Query keys
  - UI-level success/error handling when needed

- `lib/server/feature.ts`, `server/feature.ts`, or another clearly server-only module
  - Server Component, Route Handler, or Server Action data functions
  - May use Next.js `fetch` when caching, revalidation, request memoization, or cookie/header handling matters
  - Must not be imported into client components

- `types/response.ts`
  - Shared response envelopes such as success and paginated responses

- `types/feature.ts`
  - Shared domain entities when used across multiple services/components

## Workflow

### 1. Choose client or server data access

Use React Query when the data is needed by a Client Component or needs client-side cache behavior:

- interactive dashboards
- tables with filters/search/pagination
- auth session hydration
- forms and mutations
- optimistic updates or query invalidation

Use a server data function when the data belongs to initial render or a server-only boundary:

- Server Components and layouts
- metadata generation
- route handlers
- Server Actions
- SEO/public pages where server rendering is the natural source of truth
- data that benefits from Next.js `fetch` caching, revalidation, or request memoization

### 2. Define types first

Before writing the service or server data function, define:

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

### 3. Add or reuse the shared Axios instance

The shared browser/client API instance lives in `config/api.ts`.

It should handle:

- `baseURL`
- `Accept` and `Content-Type`
- cookie auth via `withCredentials: true`
- auth/session interceptors if the app needs refresh behavior

Do not create feature-specific Axios instances unless there is a very strong reason.

### 4. Write the client service/API function

Each client service/API file should contain plain async functions only.

Good examples:

- `getProfile()`
- `updateProfile(payload)`
- `listBusinesses(filters)`
- `submitBusinessClaim(payload)`

Service rules:

- keep the function side-effect free except for the API call
- type the Axios response
- return typed data
- build params/payload shape here, not in the component
- do not return `AxiosResponse`

For simple endpoints, return the unwrapped entity:

```ts
export const getProfile = async (): Promise<Profile> => {
  const { data } = await API.get<ISuccessResponse<Profile>>("/profile")
  return data.data
}
```

For paginated/meta responses, return the whole typed response:

```ts
export const listBusinesses = async (
  filters: BusinessFilters,
): Promise<PaginatedResponse<Business>> => {
  const { data } = await API.get<PaginatedResponse<Business>>("/businesses", {
    params: filters,
  })
  return data
}
```

### 5. Write the query hook

For client components, the query hook is the only data layer the UI imports.

Use:

- `useQuery` for reads
- `useMutation` for writes
- `useInfiniteQuery` for infinite lists

Query rules:

- query key must include the real dependencies
- query fn must call the service/API function
- prefer `select` for small UI-oriented reshaping
- keep toast logic or mutation success/error UX here, not in the service

Example:

```ts
export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled,
  })
}
```

Mutation example:

```ts
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
  })
}
```

### 6. Use it from client UI

In a client page, screen, or component:

- import the query hook
- never import the service/API function
- never import the Axios instance

### 7. Use server data functions from server files

For Server Components, layouts, metadata, route handlers, and Server Actions:

- import a server-only data function
- keep response typing and envelope unwrapping in that function
- use Next.js `fetch` when you need `cache`, `next.revalidate`, request memoization, or easy cookie/header forwarding
- keep auth and authorization checks inside Server Actions and route handlers

## Naming Conventions

- client API/service files: `lib/api/profile.ts`, `lib/api/businesses.ts`, `ProfileService.ts`, or `BusinessService.ts`
- query hook files: `hooks/use-profile.ts`, `hooks/use-businesses.ts`, `profileQuery.ts`, or `businessQuery.ts`
- server data files: `lib/server/profile.ts`, `lib/server/businesses.ts`, or another clearly server-only location
- payload types: `CreateXPayload`, `UpdateXPayload`
- response entity types: singular nouns like `Profile`, `Business`
- list/meta responses: `PaginatedResponse<T>` or feature-specific typed responses

Keep names boring and obvious.

## Mitho-Specific Guidance

- Default to cookie-authenticated requests, so the shared API instance should send credentials.
- If a backend response uses `{ success, data, message }`, type it with `ISuccessResponse<T>` and unwrap in the service unless the caller needs the envelope.
- If the endpoint has pagination/meta, keep the meta in the service return type and let the query decide whether to select or pass the full response through.
- If the feature is local to one domain, keep request types close to the service. If multiple screens share the entity, move it to `types/feature.ts`.
- Folder names matter less than the boundary: UI should not own HTTP details, query hooks should own React Query behavior, and service/server functions should own API contracts.

## What to Avoid

- Direct API calls in React components
- Query hooks that construct raw `axios` calls themselves
- Service functions returning `AxiosResponse`
- Importing client Axios services into Server Components when a server data function is more appropriate
- Using React Query in Server Components just to match the client pattern
- Untyped payloads
- `Record<string, any>`
- Copy-pasted query keys that ignore filters or pagination inputs
