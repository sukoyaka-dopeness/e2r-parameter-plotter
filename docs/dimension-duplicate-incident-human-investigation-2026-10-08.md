# Duplicate Dimension Addition Incident — Human Browser Investigation

Date: 2026-10-08

Status: **INVESTIGATED / DATASET RECOVERED / DOCUMENTATION CHECKPOINT**

This record captures Human browser evidence after the bounded
`dimensionDisplayName()` correction in source commit
`17ab99275ab7c8c9b949e189150d9716291782bd`. It does not add a new runtime fix,
or broaden the EN/JA locale acceptance or Dimension-authoring acceptance.

## Incident and cause

When adding a Dimension with a name already in use, the **Save dimension**
action appeared not to respond. Changing the name did not avoid the symptom.
Repeated attempts resulted in 24 Dimensions in the Dataset.

Human inspected the first ParameterPlotter tab's DevTools Sources and observed
`Uncaught ReferenceError: range is not defined` in
`workspace-actions.js` → `dimensionDisplayName()`, reached during Matrix
rerendering. That tab was still executing JavaScript loaded before the fix.
From another tab, Human fetched the server's `workspace-actions.js` and
confirmed it contained `const range = dimensionRange(dimension);`. The local
server was therefore serving the corrected file while the original tab kept
its already-loaded, pre-fix JavaScript. The incident is evidence of a stale
runtime in that tab; it does not show the same exception in the corrected
source.

At least some Save actions had already added a Dimension to the Dataset even
though the subsequent render failed and the action appeared unsuccessful.
The 24 exported Dimensions had distinct IDs: 19 had the name `同名` and 5 had
the name `違う`. The available evidence does not map each individual click to
an individual addition, so it does not establish that every repeated click
created exactly one Dimension.

## Human browser confirmation of the fixed source

In a new tab, Human continued editing the Dataset containing 13 Entities, 24
Dimensions, and 0 Assessments. The corrected source rendered the Dataset
successfully. Human checked duplicate Dimension columns and their ID
disambiguation in Matrix, and duplicate Dimension headings in Profile. This is
limited real-browser regression evidence for the fix in commit `17ab992`.

Human did **not** repeat Dimension creation/save against the corrected source
in this investigation. This evidence does not establish comprehensive
Dimension authoring acceptance, every view/interaction, or full Product
acceptance.

## Dataset preservation and recovery

Human preserved an Export containing all 24 Dimensions. After approving
removal of those test Dimensions, a separate recovery JSON was derived from
the preserved Export by removing only its Dimensions. It retained 13 Entities,
12 Events, and 57 Relations; the canonical sample was not changed. Human
imported that recovery JSON and confirmed 13 Entities, 0 Dimensions, and 0
Assessments. The Profile empty state and browser-local saved-workspace status
also displayed normally. The original 24-Dimension Export remains preserved.

## Unresolved observation and boundaries

When closing the tab that had executed the pre-fix code, no unsaved-form
discard confirmation appeared. The reason is unknown; the draft may already
have been consumed during the failed submission path. This observation does
not establish a `beforeunload` defect, and this checkpoint makes no change to
draft protection or save behavior.

The earlier [Dimension display-name correction record](./dimension-display-name-quality-follow-up-2026-10-08.md)
documents the root code defect and automated regression checks. This incident
adds Human evidence that the corrected source renders duplicate Dimensions in
Matrix and Profile, while leaving new-save behavior unaccepted. The EN/JA
locale milestone remains **HUMAN BROWSER ACCEPTED / PASS / CLOSED** within its
recorded scope. The independent Entity-drawer menu visibility/internal-scroll
follow-up remains **OPEN / NOT IMPLEMENTED / NOT ACCEPTED**. Dimension
Assessment Candidate `0.1.0` remains non-Stable.
