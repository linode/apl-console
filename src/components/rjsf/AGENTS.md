# src/components/rjsf

## OVERVIEW

Custom widgets, fields, and templates for React JSON Schema Form (RJSF) v5 with MUI integration.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Custom widget | Root `*Widget.tsx` | Checkbox, Checkboxes, Radio, CodeEditor |
| Custom field | Root `*Field.tsx` | String, Array, OneOf, Description, Title |
| Field template | `FieldTemplate/` | Layout template for form fields |
| Form wrapper | `Form.tsx` | Top-level RJSF form with MUI theme |
| Shared styles | `styles.tsx` | Common RJSF styling utilities |

## CONVENTIONS

- Widgets handle user input (checkboxes, radios, code editor)
- Fields handle data structure (arrays, oneOf, strings)
- Templates handle layout (field arrangement, labels)
- All integrate with `@rjsf/mui` — extend, don't replace
- `CodeEditorWidget.tsx` wraps Monaco editor for YAML/JSON editing
