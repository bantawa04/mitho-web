# Product Context

Mitho Cha is a Nepal-focused food discovery and review platform. Primary surfaces are:
- `mitho-web`: Next.js public site, admin UI, and business workspace
- `mitho-api`: Go REST API used by web and mobile clients

Core product expectations:
- Businesses can be listed publicly.
- Reviews and trust signals are central to the product.
- Admin/internal moderation gates exist for sensitive workflows.
- Nepal location hierarchy matters across search, SEO, and business pages.

Business onboarding and ownership:
- `Add business` and `Claim business` are separate flows.
- Add business submits a listing for admin review. It does not grant dashboard access.
- Claim business verifies ownership and unlocks management access only after approval.
- Claim legal documents are verification-only assets, not normal long-term business media.

Keep product assumptions Nepal-first unless the task explicitly broadens scope.

