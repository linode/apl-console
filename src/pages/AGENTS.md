# src/pages

## OVERVIEW

Route-level page components organized by feature domain. Each feature follows a consistent directory pattern.

## STRUCTURE

```
pages/
├── builds/              # Container image build management
├── catalogs/            # Catalog quickstart deployments
├── code-repositories/   # Git repository management
├── network-policies/    # Ingress/egress network policies
│   └── create-edit/     # CRUD forms (8 files — most complex)
├── secrets/
│   ├── platform/        # Platform-level sealed secrets
│   └── team/            # Team-scoped secrets
├── services/
│   ├── overview/        # Service list
│   └── create-edit/     # Service CRUD
├── teams/
│   ├── overview/        # Team list
│   └── create-edit/     # Team CRUD
├── workloads/           # Workload management
│   └── create-edit/
├── App.tsx              # Platform app detail page
├── Apps.tsx             # Platform apps listing
├── Dashboard.tsx        # Main dashboard
├── Policies.tsx         # Policy listing
├── Policy.tsx           # Single policy view
├── Setting.tsx          # Single setting page
├── SettingsOverview.tsx # Settings listing
├── Users.tsx / User.tsx # User management
└── types.ts             # Shared page-level types
```

## CONVENTIONS

- **Feature pattern**: `{feature}/overview/` for listing + `{feature}/create-edit/` for CRUD
- **Simple pages**: Single `*.tsx` file at pages root (Dashboard, Users, Policies)
- **Data fetching**: Use RTK Query hooks from `redux/otomiApi.ts` — never raw axios in pages
- **Routing**: Pages are mounted in `App.tsx` via React Router v5 Route components
- **Secrets**: Split into `platform/` (sealed secrets via kubeseal) and `team/` subdirs
- **Network policies**: Most complex feature — 8 files in create-edit for rule builders
