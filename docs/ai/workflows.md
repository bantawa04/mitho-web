# Important Workflows

## Add Business

- Public listing submission flow.
- User may start before login; auth can be prompted at submit time if the flow supports it.
- Submission enters admin review.
- Approval makes the listing public or claimable as intended by the feature.
- Submission alone does not grant business workspace access.

## Claim Business

- Ownership verification flow for an existing listing.
- Only claim approval grants management access.
- Claim documents are private verification assets.
- Internal users review and approve or reject claims from admin surfaces.

## Review and Moderation

- Public-facing data must respect moderation/publish gates.
- Internal/admin tooling may expose draft, pending, or rejected states when the feature requires it.

## Search UX

- For inputs that trigger backend queries, keep raw input local and use a debounced value for the actual request.
- Default debounce is `300ms` unless the feature clearly needs a different delay.

