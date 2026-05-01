# src/redux

## OVERVIEW

Redux Toolkit store with auto-generated RTK Query API client from OpenAPI spec.

## WHERE TO LOOK

| File | Purpose | Notes |
|------|---------|-------|
| `store.tsx` | Store configuration | Configures middleware + RTK Query |
| `otomiApi.ts` | Generated API client | **DO NOT EDIT** — run `npm run gen:store` |
| `emptyApi.ts` | Base API slice | RTK Query base with `/api/` baseUrl |
| `hooks.ts` | Typed Redux hooks | `useAppDispatch`, `useAppSelector` |
| `reducers.ts` | Root reducer | Combines API + custom reducers |
| `openapi-config.ts` | Codegen config | Points to API spec URL for generation |

## ANTI-PATTERNS

- **NEVER** edit `otomiApi.ts` — regenerate with `npm run gen:store`
- **NEVER** use raw axios for API calls — use RTK Query hooks
- **NEVER** add state that belongs in React contexts (UI state like drawers, settings)
