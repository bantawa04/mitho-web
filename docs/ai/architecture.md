# Architecture Notes

## API

- Domain-oriented layout under backend `internal/`.
- Standard flow: handler -> service -> repository -> database.
- Keep handlers thin, services authoritative for business rules, repositories focused on persistence.
- Register new domains through Fx modules and router wiring.

## Web

- App Router structure under `app/`.
- API functions in `lib/api/`, query wrappers in `hooks/`, schemas in `lib/validators/`, shared types in `types/`, UI state in `store/`.
- Reusable primitives belong in `components/ui/`.
- Feature UIs belong in feature folders and should consume hooks rather than call transport directly.

## Shared

- Keep backend and frontend contracts additive when possible.
- Prefer extending existing patterns over inventing one-off local structures.

