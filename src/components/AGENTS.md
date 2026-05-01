# src/components

## OVERVIEW

95+ reusable UI components — MUI wrappers, form widgets, layout primitives, and animation utilities.

## STRUCTURE

```
components/
├── rjsf/            # JSON Schema Form custom widgets/fields (see own AGENTS.md)
├── animate/          # Framer Motion animation wrappers and variants
│   └── variants/     # Predefined animation variant configs
├── forms/            # Form-specific components (9 files)
├── Breadcrumb/       # Breadcrumb navigation (8 files)
├── Button/           # Button variants: Action, Link, Tag, base Button
└── *.tsx             # Individual components (MUI wrappers, modals, tables, etc.)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add MUI wrapper | Root `*.tsx` | Wrap MUI component, re-export with project defaults |
| Add animation | `animate/` | Use Framer Motion, add variants to `variants/` |
| Add form component | `forms/` | Form-specific UI elements |
| Add button variant | `Button/` | Styled button via `Styled*.ts` pattern |
| JSON Schema form widget | `rjsf/` | See `rjsf/AGENTS.md` |

## CONVENTIONS

- Components are flat files in root — no unnecessary nesting
- MUI components are thin wrappers that apply project defaults
- Animations use Framer Motion (not CSS transitions)
- `*Style.ts` files contain styled-components (Emotion) for complex styling
- `*Types.ts` files contain shared TypeScript interfaces
- Test files are colocated: `Component.test.tsx` next to `Component.tsx`
