# First application slice boundary

Status: **Historical Candidate B first Product slice HUMAN-ACCEPTED (2026-10-04). Current successor implementation status is in [successor-first-implementation.md](successor-first-implementation.md); it does not reopen or replace this checkpoint.**

## Historical boundary

The statements below describe the accepted Candidate B first slice at its
2026-10-04 Human acceptance. The successor implementation has a separate
boundary and current status.

## Product responsibility

Provide one single-user workspace to compare selected E2R Entities using explicitly defined Dimensions and inspect the same application-local temporary Entity–Dimension values through Profile, Radar, Quadrant, and Matrix.

The imported Dataset is read-only. Temporary Dimensions, Entities, and comparison values are held in the browser tab's `sessionStorage`. This slice makes no durability or recovery promise beyond that session; session end may lose temporary work, and the application displays that limitation. Replacing the imported Dataset warns before discarding temporary work and allows the user to keep the current workspace.

This repository uses its own session-storage namespace. It does not load or migrate Prototype 1/2 browser-session records. A same-tab reload retains the current session value in the local check; a newly opened tab starts with its own empty workspace. Neither behavior is a recovery promise after the session ends.

## Explicitly outside this slice

- Portable Observation or Dimension/value contract.
- Dataset mutation, write-back, or export.
- Shared workspace, accounts, authentication, or cloud persistence.
- Cross-session durability, backup, or recovery.
- Core, Extension, schema, or Validator changes.

The Prototype 2 acceptance and its `19 Human PASS / 0 PENDING / B3 NOT RUN` status remain historical behavioral evidence. This production repository does not reopen or amend that acceptance record.

## Source and implementation boundary

This repository is the canonical production application source. e2r-spec remains the specification, Roadmap, and research authority. Prototype 2 is a behavioral reference, not the production authority. Runtime modules and focused tests were selected from its accepted implementation where they directly support this first slice; this repository owns subsequent application changes. The application uses browser-native ES modules and a local static server, with no backend or third-party runtime dependency. No production framework or portable data model is selected by this implementation.

The initial source is intentionally flat at the repository root. For this first slice, its current size and responsibility boundaries do not justify creating `src/`, `tests/`, or feature-specific directories solely for appearance. Source modules and focused tests are individually discoverable here, while the root scripts and package metadata remain simple.

This is a starting choice, not a permanent flat-layout rule. Reconsider organization when concrete maintenance friction appears, such as a growing number of responsibilities that are hard to navigate, source and tests becoming difficult to distinguish, repeated edits crossing unrelated responsibilities, or a stable boundary that benefits from independent testing or change. Then reorganize incrementally around the responsibilities involved. Do not preselect directory names, file-count thresholds, or a fixed tree; follow the evidence at that time and the workspace's accepted responsibility-based modularization guidance.

The current modules separate session and range/value rules, four projection renderers, and focused interaction/presentation helpers for validation, random candidates, drag geometry, focus, and destructive confirmation. `main.js` composes the workspace and coordinates user workflows. Further extraction should accompany a concrete change that benefits from a smaller responsibility boundary; no framework or fixed layout is imposed.

The reviewed source is published on the public `main` at
`e31c67af3f89a23f959d151091e8f144f413624d`. GitHub Actions `Check` Run #1 / `verify`
passed, as did the local syntax check and all 26 tests. The first Product slice
has now been Human-accepted; see the [first-slice acceptance record](first-slice-human-acceptance-2026-10-04.md).

The earlier pre-publication wording in this document described the state at
the initial source review and is superseded by the publication and acceptance
status above. No tag, release, deployment, or formal product name is adopted.
