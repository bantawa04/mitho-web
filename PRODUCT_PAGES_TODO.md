# Mitho Product Pages TODO

Last reviewed: 2026-03-26

This file tracks page creation progress for Mitho Cha across customer, business, and admin/superadmin surfaces.

## Suggested status usage
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done

## Phase 1 MVP

### Customer
- [ ] `/` Home / discovery
- [ ] `/explore` Search and filter results
- [ ] `/business/[slug]` Business detail page
- [ ] `/categories/[slug]` Category detail / listings
- [ ] `/cities/[slug]` City detail / listings
- [ ] `/top-rated` Top rated listings
- [ ] `/login` Shared Google OAuth entry point
- [ ] `/profile` Customer profile
- [ ] `/profile/reviews` My reviews
- [ ] `/profile/saved` Saved places / collections
- [ ] `/profile/settings` Account settings

### Business
- [ ] `/for-business` Business landing page
- [ ] `/business/claim` Claim business flow
- [ ] `/dashboard` Business dashboard home
- [ ] `/dashboard/businesses` Business list / switcher
- [ ] `/dashboard/businesses/[id]/overview` Business overview
- [ ] `/dashboard/businesses/[id]/edit` Edit business profile
- [ ] `/dashboard/businesses/[id]/hours` Manage business hours
- [ ] `/dashboard/businesses/[id]/photos` Manage media
- [ ] `/dashboard/businesses/[id]/reviews` Review management / replies
- [ ] `/dashboard/businesses/[id]/analytics` Business analytics
- [ ] `/dashboard/settings` Business account settings

### Admin / Superadmin
- [ ] `/admin` Admin dashboard home
- [ ] `/admin/reviews/moderation` Review moderation queue
- [ ] `/admin/business-claims` Business claim approvals / rejections
- [ ] `/admin/businesses` Business management
- [ ] `/admin/businesses/[id]` Business detail / moderation view
- [ ] `/admin/users` User management
- [ ] `/admin/establishment-types` Establishment type management
- [ ] `/admin/reported-content` Reports / abuse handling
- [ ] `/admin/settings` Admin settings

## Phase 2

### Customer
- [ ] `/nearby` Nearby recommendations
- [ ] `/reviews/[id]` Shareable review detail page
- [ ] `/collections` My collections index
- [ ] `/collections/[id]` Collection detail page
- [ ] `/feed` Following / social discovery feed
- [ ] `/users/[username]` Public user profile
- [ ] `/notifications` Notifications center

### Business
- [ ] `/dashboard/businesses/[id]/offers` Offers / deals management
- [ ] `/dashboard/team` Team members / permissions
- [ ] `/dashboard/billing` Billing and plans
- [ ] `/dashboard/campaigns` Promotions / sponsored placements

### Admin / Superadmin
- [ ] `/admin/staff` Staff management
- [ ] `/admin/audit-logs` Audit logs
- [ ] `/admin/featured-content` Featured content curation
- [ ] `/admin/promotions` Promotion / sponsored content management
- [ ] `/admin/analytics` Platform analytics

## Cross-cutting decisions to track
- [x] Use a single Google OAuth entry point at `/login`
- [ ] Define role-based redirect rules after login
- [ ] Define access-denied / unauthorized UX for role-protected pages
- [ ] Preserve intended destination after login when user opens a protected page
- [ ] Confirm whether business users share the same user account model with role-based access
- [ ] Confirm whether `admin` and `superadmin` remain the same role in UI for MVP
- [ ] Finalize navigation for customer header / mobile tab bar
- [ ] Finalize business dashboard sidebar structure
- [ ] Finalize admin dashboard sidebar structure
- [ ] Decide which pages need SEO-friendly public routes first
- [ ] Decide whether saved places and collections are the same MVP feature or separate

## Notes
- Current product direction is discovery-first: trusted local food reviews in Nepal.
- Reviews, moderation, and business replies are product-critical and should shape both business and admin surfaces.
- Auth direction: one shared Google OAuth flow, then redirect users based on role and intended destination.
- This tracker is intentionally page-focused; backend implementation tracking lives in [BACKEND_API_TODO.md](/Users/pawan/projects/mitho/mitho-api/BACKEND_API_TODO.md).
