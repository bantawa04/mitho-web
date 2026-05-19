# Business Lifecycle and Account Deletion Plan

Last reviewed: 2026-05-19

## Purpose

This document captures the recommended long-term product and backend policy for:

- closing, archiving, or removing businesses
- handling business ownership when a user deletes their account
- preserving platform trust, public listing history, and ownership continuity at scale

This is intended as a future backend reference, not just a UI note.

## Core Principle

Treat **businesses** and **user accounts** as separate domain entities.

- A `user account` is a person’s identity and access record.
- A `business` is a platform listing with public utility, history, metadata, reviews, and claim state.

Because of that:

- deleting a user account should **not** automatically delete a business listing
- changing business ownership should **not** require changing the public business identity
- closure, archival, and deletion should be modeled as **different lifecycle actions**

## Recommended Business Lifecycle Model

Avoid hard deletion by default.

Recommended business states:

- `active`
- `temporarily_closed`
- `permanently_closed`
- `unclaimed`
- `archived`
- `draft`
- `suspended`

### State meanings

#### `active`
- public listing is visible
- owner tools are available
- business can receive normal operational updates

#### `temporarily_closed`
- listing remains public
- clearly marked as temporarily closed
- reviews, photos, and history remain visible
- owner can reopen without losing data

Use for:
- renovations
- seasonal pauses
- short-term operational shutdowns

#### `permanently_closed`
- listing remains public as historical place data
- clearly marked as permanently closed
- no active growth or marketing features
- no normal customer expectation of current service

Use for:
- shutdowns
- relocation without continuity
- ended operations

#### `unclaimed`
- listing still exists publicly
- no active owner currently controls it
- future eligible business users may re-claim it

Use for:
- imported/place-directory listings
- businesses left behind after ownership is removed
- ownership transfer gaps

#### `archived`
- hidden from the owner’s active dashboard by default
- used for internal cleanup of old business workspaces
- should not be used as the public “closed” status

Use for:
- abandoned setup flows
- duplicates that need to be retained internally
- stale operational records

#### `draft`
- business has not been fully published yet
- safe candidate for stronger delete/remove actions

#### `suspended`
- admin/moderation state
- used for fraud, abuse, policy review, or temporary platform action

## Recommended Actions for Business Owners

Do not expose “Delete business” as the normal primary action.

Recommended owner-facing actions:

### 1. Temporarily close business
- reversible
- keeps listing public
- preserves all business data

### 2. Mark permanently closed
- more final than temporary closure
- keeps public historical record visible
- may require stronger confirmation than temporary closure

### 3. Archive business workspace
- removes clutter from the dashboard
- does not imply the public listing should disappear

### 4. Request listing removal
- not immediate hard delete
- should go through review or guarded rules
- appropriate only for:
  - duplicate listings
  - incorrect/spam listings
  - never-published draft mistakes

### 5. Delete draft
- allowed only for safe draft-stage listings with no meaningful public history

## Hard Deletion Policy

Hard deletion should be rare.

Recommended rules:

### Allow hard delete only for:
- `draft` businesses that were never meaningfully published
- obvious duplicates merged elsewhere
- admin-approved spam/fraud records

### Do not hard delete by default when:
- business has reviews
- business has claim history
- business has customer-generated content
- business was publicly visible for any meaningful period

Reason:
- historical review context matters
- public listing continuity matters
- future ownership or re-claim is easier if the record remains intact

## Account Deletion Policy

When a user deletes their account, handle the account lifecycle separately from the business lifecycle.

### If the user has no business ownership
- proceed with normal account deletion flow
- delete or anonymize personal profile data according to policy
- remove follow graph relationships, private collections, and customer-only state as required

### If the user owns or manages businesses
Do **not** allow immediate self-serve account deletion until business responsibility is resolved.

Require one of the following first:

- transfer ownership to another eligible user
- remove themselves from all managed businesses
- convert sole-owner businesses to `unclaimed`
- request support/admin review for exceptional cases

## Sole Owner Rules

If the deleting user is the last owner of a business:

### Recommended default outcome
- business remains on the platform
- ownership link is removed
- business becomes `unclaimed`
- dashboard access is removed
- public listing remains live unless separately closed or moderated

This is the cleanest scalable default because it:

- preserves public utility
- avoids accidental listing loss
- allows future reclaim
- separates people from place records

## Ownership Model Recommendation

Support multiple business-user relationships instead of a single owner field.

Recommended relationship model:

- `business_users`
  - `business_id`
  - `user_id`
  - `role`
  - `status`
  - `created_at`
  - `removed_at`

Suggested roles:

- `owner`
- `manager`

Suggested membership statuses:

- `active`
- `pending`
- `revoked`

Benefits:

- safer ownership transfer
- easier support/admin recovery
- better auditability
- cleaner handling when one user deletes their account

## Backend-Ready Business Status Model

Recommended fields on `businesses`:

- `public_status`
  - `active`
  - `temporarily_closed`
  - `permanently_closed`
  - `unclaimed`
  - `suspended`
- `workspace_status`
  - `active`
  - `archived`
  - `draft`
- `claimed_at`
- `closed_at`
- `archived_at`
- `suspended_at`
- `deletion_requested_at`
- `deletion_reason`

Keep public status and internal workspace status separate.

That prevents confusion like:
- “archived in dashboard” accidentally meaning “closed to customers”

## Recommended Account Deletion Workflow

### Step 1: pre-check
When a user initiates account deletion:

- count managed businesses
- count owned businesses
- determine whether the user is the last owner on any business

### Step 2: block if unresolved businesses exist
If business responsibility is unresolved:

- stop deletion flow
- show exact businesses affected
- guide user to:
  - transfer ownership
  - leave manager roles
  - convert business to unclaimed if sole owner

### Step 3: finalize ownership resolution
After all business responsibilities are handled:

- remove business-user links
- apply unclaimed fallback where needed

### Step 4: delete account
- delete/anonymize user account per policy
- preserve audit trail references where legally and operationally required

## Audit and Compliance Recommendation

Maintain event logs for:

- business status changes
- ownership transfers
- claim approvals
- unclaiming due to account deletion
- deletion requests
- admin removals

Useful event types:

- `business_claim_submitted`
- `business_claim_approved`
- `business_transferred`
- `business_marked_temporarily_closed`
- `business_marked_permanently_closed`
- `business_unclaimed`
- `business_archived`
- `business_deletion_requested`
- `user_account_deletion_blocked_due_to_business_ownership`
- `user_account_deleted`

This becomes important for:

- support operations
- moderation disputes
- ownership recovery
- future admin tooling

## UI/UX Implications for Future Work

### In business settings
Prefer a `Business status` section with actions like:

- `Temporarily close`
- `Mark permanently closed`
- `Archive workspace`
- `Request listing removal`

Keep destructive actions separated from normal operational settings.

### In account settings
If the user manages businesses:

- show a warning before account deletion
- list the businesses affected
- require resolution before final deletion

### In dashboard lists
Support filters or visual markers for:

- active
- temporarily closed
- permanently closed
- unclaimed
- archived

## Scalability Notes

This plan is designed to scale because it:

- does not depend on a single-owner-only model
- preserves listings independently from user identity
- keeps reversible and irreversible actions separate
- avoids destructive deletion as the default
- supports future admin, moderation, and recovery workflows

## Recommended MVP Implementation Order

### Phase 1
- support `active`, `temporarily_closed`, `permanently_closed`, `unclaimed`
- support multiple business users
- prevent account deletion when unresolved owned businesses exist

### Phase 2
- ownership transfer workflow
- archive workspace behavior
- deletion request flow

### Phase 3
- admin removal review tools
- automated recovery flows
- richer audit logs and compliance tooling

## Final Recommendation

### Business deletion / closure
Use:

- `temporarily_closed`
- `permanently_closed`
- `archived`
- `unclaimed`

Avoid normal hard delete.

### User account deletion with business ownership
Use:

- no automatic business deletion
- ownership resolution before account deletion
- fallback to `unclaimed` when last owner leaves

This is the most future-proof and scalable model for Mitho because it protects:

- public listing continuity
- customer trust
- ownership recoverability
- backend clarity
- long-term admin operations
