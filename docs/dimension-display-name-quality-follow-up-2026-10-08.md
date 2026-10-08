# Dimension Display Name Functional Quality Follow-up

Date: 2026-10-08

Status: **FIXED / AUTOMATED REGRESSION COVERED**

## Finding

Current `workspace-actions.js` had an undefined `range` reference inside
`dimensionDisplayName()`. The function reached that reference when at least two
Dimensions had the same name and a candidate pair also shared both endpoint
labels. In that case it threw `ReferenceError: range is not defined` while
checking whether a short ID was needed.

This was reproducible by calling the current function with two Dimensions
named `Confidence`, both labeled `Low` and `High`, and both bounded from 0 to
10. It could interrupt any rendering path that asks for this display name,
including Profile Dimension headings and the Dimension selector labels used
by the view controls. The exact runtime error occurred before checking numeric
bounds or unit, so even non-identical Dimensions with matching name and
endpoint labels could trigger it.

## Correction

The function now derives the current Dimension's range with the existing
`dimensionRange()` helper before comparing it with same-name Dimensions. It
retains the existing presentation policy:

- Unique names display as before.
- Same-name Dimensions display their endpoint/range and optional unit details.
- An ID suffix is added only when another Dimension matches the endpoint
  labels, numeric bounds, and unit.
- Existing surface-specific `dimensionNeedsId()` behavior for duplicate or
  visually similar names is unchanged.

No Dataset, Dimension, Assessment, ID, locale, or Candidate contract changed.
Canonical sample data was not modified. This correction does not reopen or
withdraw the bounded EN/JA locale Human Browser Acceptance.

## Verification

`workspace-actions.test.mjs` now covers exact duplicate Dimensions, same-name
Dimensions with different ranges, visually similar names, and Profile markup
rendering with exact duplicates. `npm.cmd run check` passes syntax checks for
26 application modules and all 86 tests.

These are automated checks, not Human Browser Acceptance. A browser smoke check
of populated views with duplicate Dimensions was not performed in this
checkpoint. The locale milestone remains Human Accepted within its documented
scope; full Product acceptance and the independent Entity drawer menu-scroll
follow-up remain separate.
