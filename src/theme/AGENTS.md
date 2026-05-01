# src/theme

## OVERVIEW

MUI v5 theme configuration — palette, typography, shadows, breakpoints, and 46 component overrides.

## STRUCTURE

```
theme/
├── index.tsx          # Theme provider entry point
├── palette.ts         # Color palette definitions
├── shadows.ts         # Box shadow tokens
├── font.ts            # Typography scale + font families
├── breakpoints.ts     # Responsive breakpoint values
├── theme.d.ts         # Theme type augmentations
├── keyframes/         # CSS keyframe animation definitions
└── overrides/         # MUI component style overrides (46 files)
    └── index.ts       # Barrel export combining all overrides
```

## CONVENTIONS

- **One override file per MUI component** in `overrides/` (e.g., `Button.ts`, `Card.ts`)
- Override files export a function receiving the theme → return component style overrides
- `overrides/index.ts` aggregates all overrides into single object
- `.tsx` extension used when override contains JSX (Alert, Checkbox, Chip, Rating, etc.)
- Theme type extensions go in `theme.d.ts` (module augmentation)
- Fonts: Comfortaa (display) + Roboto (body) via typeface packages
