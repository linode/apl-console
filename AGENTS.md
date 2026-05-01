# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-29
**Commit:** e886ddbd
**Branch:** main

## OVERVIEW

Akamai App Platform Console — React 18 / TypeScript / MUI 5 web UI for managing containerized apps, teams, services, secrets, and platform resources. Talks to APL API via auto-generated RTK Query client.

## STRUCTURE

```
src/
├── components/       # Reusable UI (95 files) — MUI wrappers, RJSF form widgets, animations
├── pages/            # Route pages — feature dirs with overview/ + create-edit/ pattern
│   ├── builds/
│   ├── catalogs/
│   ├── code-repositories/
│   ├── network-policies/
│   ├── secrets/          # platform/ and team/ subdirs
│   ├── services/
│   ├── teams/
│   └── workloads/
├── redux/            # RTK store + auto-generated API client (otomiApi.ts)
├── hooks/            # Custom hooks (auth, settings, drawer, responsive)
├── contexts/         # CollapseDrawer, Settings, ShellDrawer contexts
├── theme/            # MUI theme: palette, shadows, fonts, 46 component overrides
├── utils/            # Helpers, permissions, schema utils, error handling
├── layouts/          # Shell, Base, Paper layout wrappers
├── providers/        # Context providers
├── i18n/             # i18next setup
└── common/           # Shared types/constants
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new page/feature | `src/pages/{feature}/` | Follow overview/ + create-edit/ pattern |
| Add reusable component | `src/components/` | MUI-wrapped, see existing for style |
| API integration | `src/redux/otomiApi.ts` | AUTO-GENERATED — run `npm run gen:store` |
| Add RTK Query hook | `src/redux/hooks.ts` | Typed hooks for useAppDispatch/Selector |
| Custom form widget | `src/components/rjsf/` | RJSF widget/field overrides |
| Theme override | `src/theme/overrides/` | One file per MUI component |
| Add custom hook | `src/hooks/` | Follow use{Name} convention |
| Error handling | `src/utils/error.tsx` | Centralized error utilities |
| Permissions/RBAC | `src/utils/permission.ts` | Auth checks |
| Routing | `src/App.tsx` | React Router v5 with Switch/Route |
| i18n translations | `public/i18n/` | JSON files per language |

## CONVENTIONS

- **Imports**: baseUrl is `src/` — use absolute imports (e.g., `import X from 'components/Y'`)
- **Commits**: Conventional Commits enforced via Commitizen + commitlint
- **Formatting**: Prettier on save, enforced via lint-staged + Husky pre-commit
- **Linting**: ESLint Airbnb + Prettier + TypeScript rules; unused imports are errors
- **State**: RTK Query for API state, React contexts for UI state (settings, drawers)
- **Forms**: React Hook Form + Yup validation for standard forms; RJSF for dynamic JSON Schema forms
- **Routing**: React Router v5 (NOT v6) — uses Switch, Route, useHistory, useParams
- **TypeScript**: strict mode OFF (tsconfig)

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** edit `src/redux/otomiApi.ts` manually — it's auto-generated from OpenAPI spec
- **DO NOT** use React Router v6 APIs — project uses v5
- **DO NOT** add `@ts-ignore` or `as any` — fix the types properly
- **DO NOT** mix Redux for UI state that's already in contexts (settings, drawers)
- **DEPRECATED**: `AppCard.tsx` label pattern is deprecated (see component comments)

## COMMANDS

```bash
make dev          # Start dev server + TS watcher + Chrome debugging
make test         # Run tests (Jest + RTL, watchAll=false)
make lint         # ESLint + TypeScript type check
make build        # Production build
make gen-store    # Regenerate RTK Query API from OpenAPI spec
make clean        # Remove node_modules + build
```

## NOTES

- Node >=20 <21 required (engines field enforced)
- `PUBLIC_URL` is set to `##CONTEXT_PATH##` at build time — replaced by deployment
- Proxy config in `src/setupProxy.js` for local API dev
- Socket.io client present for real-time features
- RJSF (React JSON Schema Form) v5 used for dynamic forms — custom widgets in `src/components/rjsf/`
- Package name is still `otomi-console` (historical — was Otomi before Akamai rebrand)
