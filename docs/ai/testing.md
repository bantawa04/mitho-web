# Testing and Verification

## API

Common checks:
- `go test ./...`
- `make swagger` when Swagger annotations change
- `make migrate-fix-sum` after migration conflict resolution
- `make migrate-deploy` to apply pending local/dev migrations
- `make seed-dev` or `make seed-bootstrap` when seed-backed features change

Migration expectations:
- Add or update migrations before wiring dependent code.
- Keep migrations reversible when practical.
- Do not apply destructive migration commands against production-like data without explicit human confirmation.

## Web

Common checks:
- `bunx tsc --noEmit`
- `bun run lint`
- browser smoke check for touched flows when UI changes are significant

Package manager:
- Use Bun commands by default in `mitho-web`.

