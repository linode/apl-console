---
status: proposed
---

# Suppress global page error while any modal is open

To prevent visual conflict between modal content and page-level errors, the application tracks open modal state globally and suppresses rendering of the top-level Error component while at least one modal is open. We chose this over a ConfigureGit-only fix because the problem is cross-cutting, and we chose explicit modal lifecycle dispatch over ad-hoc button handlers because it is more resilient to close/unmount edge cases.

## Considered options

- Restrict the fix to ConfigureGitModal only. Rejected because it would leave the same overlap risk in other modals.
- Solve with backdrop and z-index changes only. Rejected because global errors remain visible behind the modal and continue to compete visually.
- Hide all global banners and toasts. Deferred to future work to keep this change scoped and low-risk.

## Consequences

- Modal components should participate through a shared modal wrapper long term for consistency; direct per-modal dispatch is acceptable as an incremental step.
- The reducer must remain defensive and never let open modal count drop below zero.
- Future contributors should treat this behavior as intentional UI policy, not incidental styling.
