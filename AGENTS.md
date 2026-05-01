# Mitho Web Agent Runbook

This document is the implementation runbook for coding agents working in the `mitho-web` Next.js frontend.

> For full product context, domain roadmap, and backend API contracts, refer to the backend `agent.md` (mitho-api runbook). This document covers frontend concerns only.

---

## Project Context

Mitho Cha is a Nepal-focused food discovery and review platform. This Next.js app is the primary web client, backed by the `mitho-api` Go REST API. The mobile client is a separate React Native app sharing the same API.

---

## Stack

- **Framework:** Next.js (App Router)
- **UI components:** Radix UI primitives, wrapped in internal components
- **Styling:** (add here: Tailwind CSS / CSS Modules / etc.)
- **Forms:** React Hook Form + Zod
- **API calls:** Axios (via a central instance) + TanStack Query
- **Global state:** Zustand
- **Auth:** JWT access token + refresh token (storage strategy TBD — see Auth section)
- **Language:** TypeScript (strict mode expected)

---

## Project Structure

```
app/                        # Next.js App Router — pages and layouts
  (auth)/                   # Route group: login, signup, etc.
  (main)/                   # Route group: main app shell
  layout.tsx                # Root layout
  proxy.ts             # Route protection logic

components/
  ui/                       # Wrapped Radix UI primitives (buttons, dialogs, inputs, etc.)
  shared/                   # Reusable cross-feature components
  <feature>/                # Feature-scoped components (e.g., review/, business/)

hooks/                      # Custom React hooks (data fetching hooks live here)
lib/
  api/                      # Axios instance and API service functions
  validators/               # Zod schemas (one file per domain/form)
  utils/                    # Pure utility functions
store/                      # Zustand stores (one file per concern)
types/                      # Shared TypeScript types and API response types
```

> When adding a new feature, follow this structure. Do not scatter API calls or Zod schemas into page or component files.

---

## API Integration Conventions

### Axios Instance

All API calls must go through the central Axios instance at `lib/api/client.ts`. Never instantiate Axios directly in a component, hook, or store.

The instance must:
- Set `baseURL` from `process.env.NEXT_PUBLIC_API_URL`
- Attach the JWT access token to every request via a request interceptor
- Handle `401` responses via a response interceptor that attempts token refresh, then retries the original request once
- On refresh failure, clear auth state and redirect to login

```ts
// lib/api/client.ts (pattern reference)
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token via request interceptor
// handle 401 + refresh via response interceptor
```

### Auth Token Storage

**Decision pending.** Until decided, do not hardcode a storage strategy. Keep token read/write behind a single abstraction in `lib/api/auth-tokens.ts` that exports `getAccessToken`, `setAccessToken`, `getRefreshToken`, `setRefreshToken`, `clearTokens`. This isolates any future storage change to one file.

Candidates under consideration:
- `httpOnly` cookies (recommended for XSS safety — requires backend to set `Set-Cookie`)
- In-memory + Zustand (safe from XSS but lost on refresh — requires silent refresh on mount)
- `localStorage` (avoid unless no other option — XSS risk)

### API Service Functions

Each domain gets a file under `lib/api/` (e.g., `lib/api/businesses.ts`, `lib/api/reviews.ts`). These files export plain async functions that call the Axios instance and return typed responses. TanStack Query hooks call these functions — they do not call Axios directly.

```ts
// lib/api/reviews.ts
export async function fetchBusinessReviews(businessId: string): Promise<Review[]> {
  const { data } = await apiClient.get(`/businesses/${businessId}/reviews`);
  return data;
}
```

### TanStack Query Conventions

- All server state lives in TanStack Query. Do not duplicate server state in Zustand.
- Query keys must be centralized in `lib/api/query-keys.ts` as a typed constant object.
- Custom hooks wrapping `useQuery` / `useMutation` live in `hooks/` (e.g., `hooks/useBusinessReviews.ts`).
- Page and component files call hooks only — never `useQuery` or `useMutation` directly.

```ts
// hooks/useBusinessReviews.ts
export function useBusinessReviews(businessId: string) {
  return useQuery({
    queryKey: queryKeys.businessReviews(businessId),
    queryFn: () => fetchBusinessReviews(businessId),
  });
}
```

### Response Shape

The backend wraps all responses consistently. Define a shared `ApiResponse<T>` type in `types/api.ts` and use it across all service functions. Never use `any` for API response types.

### Backend Casing

The backend performs automatic camelCase conversion on responses. Expect camelCase field names in all API responses. Define TypeScript types accordingly — do not use snake_case field names in frontend types.

---

## Form Handling Pattern

All forms must use React Hook Form + Zod. The pattern is always:

1. Define a Zod schema in `lib/validators/<domain>.ts`
2. Infer the TypeScript type from the schema with `z.infer`
3. Pass the schema to `useForm` via `zodResolver`
4. Register fields and handle submit through React Hook Form

```ts
// lib/validators/review.ts
export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  body: z.string().min(10, "Review must be at least 10 characters"),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// components/review/CreateReviewForm.tsx
const form = useForm<CreateReviewInput>({
  resolver: zodResolver(createReviewSchema),
});
```

Never validate form data manually or outside of Zod. Never call an API mutation without first passing through React Hook Form's `handleSubmit`.

---

## Component Conventions

### Radix UI Wrapping

Never use raw Radix UI primitives directly in page or feature component files. All Radix primitives must be wrapped into internal components under `components/ui/`. This keeps the API surface consistent and allows global style/behavior changes in one place.

```
components/ui/
  Button.tsx         # wraps Radix or custom
  Dialog.tsx         # wraps Radix Dialog
  Input.tsx          # wraps Radix + React Hook Form compatible
  Select.tsx         # wraps Radix Select
  ...
```

### Component Scope Rules

- `components/ui/` — generic, no business logic, no API calls
- `components/shared/` — reusable cross-feature, may accept data as props
- `components/<feature>/` — feature-scoped, may call feature hooks, no direct API calls

### Server vs Client Components

App Router defaults to Server Components. Follow these rules:
- Prefer Server Components for data display pages where possible.
- Mark components `"use client"` only when they need interactivity, hooks, or browser APIs.
- Never call TanStack Query hooks in Server Components — those are client-only.
- Keep `"use client"` boundaries as low in the tree as possible.

---

## Auth Flow

### Session State

Auth state (user profile, login status) lives in a Zustand store at `store/authStore.ts`. This store is the single source of truth for whether the user is logged in and who they are.

### Route Protection

Protected routes are enforced in `proxy.ts` at the Next.js edge. The middleware checks for a valid token and redirects unauthenticated users to `/login`. Do not implement route protection inside individual page components.

### Auth API Endpoints (from backend)
- `POST /api/auth/login` — returns access token + refresh token
- `POST /api/auth/signup` — creates account
- `POST /api/auth/refresh` — takes refresh token, returns new access token
- `POST /api/auth/logout` — invalidates refresh token

On login success: store tokens via `lib/api/auth-tokens.ts`, update Zustand auth store.
On logout: call logout endpoint, clear tokens, reset auth store, redirect to `/login`.

---

## Zustand Store Conventions

- One store file per concern under `store/` (e.g., `store/authStore.ts`, `store/uiStore.ts`).
- Stores hold **client/UI state only** — never cache server data in Zustand (that belongs in TanStack Query).
- Keep store actions inside the store definition, not scattered across components.
- Export typed hooks from the store file for component consumption.

```ts
// store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
}
export const useAuthStore = create<AuthState>()(...)
```

---

## Environment Variables

All environment variables must be declared in `.env.local` (local) and documented in `.env.example` (committed). Never hardcode URLs or secrets.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for mitho-api backend |

---

## What NOT to Do

- **Do not call Axios or fetch directly in components or pages.** All API calls go through `lib/api/` service functions called by TanStack Query hooks.
- **Do not store server state in Zustand.** TanStack Query owns server state. Zustand owns client/UI state.
- **Do not use raw Radix UI primitives in feature or page files.** Always go through `components/ui/` wrappers.
- **Do not put Zod schemas inline in component files.** Schemas live in `lib/validators/`.
- **Do not bypass React Hook Form's `handleSubmit` to call mutations.** Validation must always run before submission.
- **Do not use `any` for API response types.** Define proper types in `types/`.
- **Do not add `"use client"` to a component unnecessarily.** Default to Server Components and push the client boundary down.
- **Do not implement route protection inside page components.** Protection belongs in `proxy.ts`.
- **Do not hardcode the API base URL.** Always use `process.env.NEXT_PUBLIC_API_URL`.
- **Do not store tokens in `localStorage`** until the auth storage decision is finalized. Use the `lib/api/auth-tokens.ts` abstraction.

---

## Execution Checklist (for each new feature)

1. **Sync understanding**
   - Check existing feature folder structure for patterns.
   - Read the relevant backend API contract from the backend runbook.

2. **Define types**
   - Add API response types to `types/`.

3. **Add Zod schema**
   - Add form validation schema to `lib/validators/<domain>.ts`.

4. **Add API service function**
   - Add to `lib/api/<domain>.ts` using the central Axios instance.
   - Add query keys to `lib/api/query-keys.ts`.

5. **Add TanStack Query hook**
   - Add `useQuery` or `useMutation` wrapper to `hooks/`.

6. **Build UI components**
   - Add Radix-based UI primitives to `components/ui/` if new ones are needed.
   - Add feature components to `components/<feature>/`.

7. **Add page/route**
   - Add under `app/` in the appropriate route group.
   - Ensure protected routes are covered by `proxy.ts`.

8. **Verify**
   - TypeScript compiles with no errors: `tsc --noEmit`
   - No ESLint errors: `next lint`
   - Auth flow and protected route behavior tested manually.

---

## Quality Gates for Agent PRs

Before submitting feature PRs, verify all of the following:

- [ ] No direct Axios/fetch calls in components, pages, or stores.
- [ ] All forms have a Zod schema and use `zodResolver` with React Hook Form.
- [ ] No raw Radix primitives used outside `components/ui/`.
- [ ] No server state duplicated in Zustand.
- [ ] All API response types are explicitly typed (no `any`).
- [ ] Query keys are defined in `lib/api/query-keys.ts`.
- [ ] `"use client"` is used only where genuinely required.
- [ ] New environment variables are documented in `.env.example`.
- [ ] `tsc --noEmit` passes with no errors.
- [ ] `next lint` passes with no errors.