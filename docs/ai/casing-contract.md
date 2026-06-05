# API Casing Contract

Backend behavior:
- Request DTO `json` tags in Go should use `snake_case`.
- API middleware converts incoming request keys from `camelCase` to `snake_case` before binding.
- Backend responses are rewritten to `camelCase` before clients receive them.

Frontend behavior:
- Send request payloads in `camelCase`.
- Define frontend types in `camelCase`.
- Expect API responses in `camelCase`.

Debug rule:
- If required request fields appear missing even though frontend payload looks correct, first check backend request DTO tags for incorrect `camelCase` usage.

