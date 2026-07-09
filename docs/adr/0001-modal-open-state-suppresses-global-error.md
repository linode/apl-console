---
status: proposed
---

# Suppress global page error while any modal is open

To prevent visual conflict between modal content and page-level errors, the application tracks open modal state globally and suppresses rendering of the top-level Error component while at least one modal is open. We chose this over a ConfigureGit-only fix because the problem is cross-cutting, and we chose explicit modal lifecycle dispatch over ad-hoc button handlers because it is more resilient to close/unmount edge cases.
