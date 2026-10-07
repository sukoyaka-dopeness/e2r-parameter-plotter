# Workspace Backup/Restore removal — Human Acceptance

Date: 2026-10-07

Status: **BOUNDED RUNTIME CORRECTION HUMAN-ACCEPTED / CLOSED**

## Accepted source

Human Browser Acceptance applies to ParameterPlotter source commit
`34f72fad67b9d59b011dbad3880ff0f5a09a0f45`, which removes user-managed
Workspace Backup/Restore from the initial Product while retaining
browser-local persistence and E2R Dataset JSON Export as separate
responsibilities.

This bounded acceptance does not replace the earlier Functional Human
Acceptance at `b9a8e1fee6499c191c66033296e98965d777684e`. That revision remains
the historical acceptance baseline for the broader successor functional
behavior. Dimension Assessment Candidate
`draft.github.sukoyaka-dopeness.dimension-assessment` version `0.1.0` remains
Human-adopted and non-Stable.

## Human Browser evidence — PASS

- The More menu contains only **Open E2R Dataset** and **Export E2R JSON**;
  Workspace Backup and Restore controls are absent.
- Reload restores Dataset edits through browser-local persistence.
- Dataset replacement can be cancelled while preserving loss-sensitive
  current work. Explicit discard switches to the incoming Dataset without
  mixing in the replaced Dataset's changes.
- E2R JSON Export produces a file containing the Dataset changes. Before
  export, status is **Dataset: Changes not exported**; after export it is
  **Dataset: Matches last Export baseline**, while **Browser workspace: Saved
  locally** remains an independent status.
- Reload after export restores the exported Dataset content and preserves both
  clean Export-baseline and saved browser-workspace status.
- An unapplied Entity edit draft triggers the browser's leave confirmation on
  reload. Cancelling reload preserves the draft; cancelling the Entity edit
  discards only the draft and does not mutate the Dataset.

## Evidence not run

- Real-browser storage failure injection, including quota exhaustion or
  unavailable storage, remains **NOT RUN**. Existing automated tests cover the
  degraded/unsaved handling and preservation of the previous browser-local
  copy when a write fails.
- Screen-reader acceptance and other accessibility cases outside this bounded
  correction were not part of this acceptance.

## Preserved Product boundary

Browser-local automatic persistence and same-browser-profile recovery remain.
E2R Dataset JSON remains the portable save/exchange artifact. Browser-local
persistence is not Dataset Export, and memory-only work is not reported as
saved. Dataset replacement, reload, exit, pending-work, and degraded/unsaved
protection remain in force. Unknown/opaque Dataset preservation, Validator
eligibility, Entity lifecycle, and Candidate 0.1.0 semantics were not changed.

No push, release, tag, deployment, Pages publication, or Hub publication was
performed.
