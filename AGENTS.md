# Mitho Web Agent Rules

This file governs frontend work in `mitho-web`. Keep only behavior-critical rules here. Put long product context, workflow detail, and background explanation in `../docs/ai/`.

## Scope

- Applies to Next.js app code, frontend API clients, hooks, forms, and UI components.
- Overrides root guidance for files under `mitho-web/`.

## Core Frontend Structure

- Keep API functions in `lib/api/`.
- Keep TanStack Query wrappers in `hooks/`.
- Keep Zod schemas in `lib/validators/`.
- Keep shared types in `types/`.
- Keep client/UI state only in Zustand stores under `store/`.
- Keep reusable primitives in `components/ui/`.

## API Integration Rules

- Use the central Axios client in `lib/api/client.ts`.
- Do not call Axios or `fetch` directly in components, pages, or stores.
- Send request payloads in `camelCase` and expect responses in `camelCase`.
- Define query keys centrally and access server state through TanStack Query hooks.
- Do not duplicate server state in Zustand.

## Forms and Search

- Use React Hook Form with Zod for all forms.
- Do not place Zod schemas inline inside feature/page components.
- Inputs that drive backend queries should use the reusable debounce hook pattern.
- Keep raw input state for rendering, use debounced state for filtering/query params, default `300ms`.

## Component and Rendering Rules

- Do not use raw Radix primitives directly in feature/page code when a local wrapper belongs in `components/ui/`.
- Prefer Server Components by default and keep `"use client"` boundaries as low as possible.
- Client-only hooks such as TanStack Query must stay in Client Components.

## Auth and Access

- Auth is backend-session-cookie based. Do not add browser token storage.
- Route protection belongs in `proxy.ts`, not in individual pages.
- Do not assume add-business submission grants business workspace access. Claim approval is the access gate.

## Design System Guardrails

- Public pages and dashboard pages use different visual systems.
- Public pages may be warmer and more editorial.
- Dashboard/business workspace pages should stay operational, restrained, and low-decoration.
- Shared components should stay neutral or accept explicit context variants.

## Verification

- Run `bunx tsc --noEmit` after frontend changes.
- Run `bun run lint` when touching shared UI, routing, or broad frontend behavior.
- Browser smoke test significant UI changes when the flow is easy to verify locally.

## Avoid

- Do not store server data in Zustand.
- Do not hardcode API base URLs or secrets.
- Do not use `any` for API response types when a real type can be defined.
- Do not bypass React Hook Form submission flow for validated forms.

