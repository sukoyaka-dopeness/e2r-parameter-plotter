# Dimension Assessment Candidate 0.2.0 Human Browser Review

Date: 2026-10-08

## Status

**HUMAN BROWSER REVIEW PASS FOR REPORTED CASES / FORMAL BOUNDED ACCEPTANCE
DISPOSITION PENDING.**

This record separates the Human's reported browser results from automated
verification and identifies two behaviors not confirmed in the browser. It
does not mark untested behavior as PASS. Candidate `0.2.0` remains a Candidate,
not Stable.

## Accepted source boundary

The reviewed ParameterPlotter source is commit
`a2b4c311013c946f1006a3c8ad58bade22743110`
(`Add Dimension Assessment Candidate 0.2.0 support`). The current application
HEAD matches this revision. The application worktree had no tracked source
changes; its existing untracked `.github/FUNDING.yml` was left untouched.

The Human reports using Microsoft Edge InPrivate at `http://localhost:4182`.
The results below are Human-reported browser evidence; Codex did not repeat
these interactions in a browser during this checkpoint.

## Human Browser Review results

### New Dataset and Candidate 0.2.0 — PASS

- A new Dataset accepted Entity and Dimension creation. Saving its first
  Dimension created the Dimension Assessment payload at exact version `0.2.0`.
- A multiline Description was saved and displayed. Markdown-like and HTML-like
  characters appeared as plain text.
- A Dimension without a Description could be created. Clearing a Description
  omitted the field from Export JSON. Whitespace-only input showed a validation
  error and was not saved.
- Assessment values `0` and `7` were recorded. Export retained version `0.2.0`
  and the Description.

The previously reported missing Description for Dimension 2-2 was an intentional
Description-deletion test. It is not evidence of a Description-loss defect.

### Existing Candidate 0.1.0 and explicit upgrade — PASS for reported actions

- An existing `0.1.0` Dataset loaded; its Dimension editor did not expose
  Description and offered an explicit upgrade.
- The upgrade explanation dialog and its Cancel button were exercised.
- After approval, Description editing was available. Before/after Export JSON
  showed the payload version and the matching Specification Extension `uses`
  declaration aligned at `0.2.0`.
- Existing Dimensions, IDs, scales, and Assessments were retained. The E2R-SPEC
  `basic.json` fixture's three Assessment values (`-2`, `0`, and `3`) remained
  after upgrade. No Description was generated automatically.

The Human did not report testing ordinary `0.1.0` edits before upgrade or using
Escape to dismiss the upgrade dialog. Those actions are not Human Browser PASS.
The focused model test covers `0.1.0` ordinary-edit version preservation; the
source contains Escape dismissal and opener-focus restoration for the upgrade
dialog, but there is no focused automated interaction test for that Escape
path.

### Description and browser-local recovery — PASS

- After upgrade, a multiline Description was entered. F5 with an unapplied
  draft displayed the browser reload warning; proceeding without saving did
  not apply the draft.
- Saving with `評価軸を保存` displayed the Description in Dimension Pool.
  Reload after saving retained it.
- Export retained the Description line break and the existing Assessments.

The unsaved-draft loss was an intentional reload-protection test, not a save
failure.

### EN/JA and visualizations — PASS for reported cases

- The UI switched between Japanese and English. Switching UI locale did not
  translate or alter the Japanese Dataset Description.
- Profile retained the distinction between Assessment values and unassessed
  Dimensions.
- Matrix showed 2 Entities by 2 Dimensions, with three assessed values and one
  unassessed cell.
- Quadrant placed Entity A after selecting Impact and Confidence. Entity B,
  which lacked a Confidence Assessment, was not plotted as if its value were
  zero.
- Radar correctly presented its three-spoke minimum guidance when only two
  Dimensions were available. After adding `Radar Test`, Entity B's values
  (Impact `3`, Confidence `0.5`, Radar Test `8`) rendered a three-spoke plot.
  Entity A, which had no Radar Test Assessment, was shown without inventing a
  complete three-value profile.
- The Human reported no rendering breakage or JavaScript exception in the
  tested cases.

## Automated verification (separate from Human evidence)

On the accepted source revision, `npm.cmd run check` passed: syntax checks for
26 application modules and **94/94 tests**. Relevant regression tests cover
Description preservation through model-level browser-local recovery and Export,
omitted/multiline/plain-text/long Description validation, blank and
whitespace-only input handling, `0.1.0` ordinary-edit version preservation,
explicit upgrade data preservation and Specification Extension alignment, and
rollback when upgrade validation fails.

These automated checks do not upgrade any untested browser interaction to
Human acceptance. In particular, the upgrade Escape path has no focused
automated interaction test.

## Independent follow-ups and boundaries

These items are not reopened or closed by this review:

- Entity drawer end-of-list action-menu visibility / internal scrolling remains
  an independent **OPEN / NOT IMPLEMENTED / NOT HUMAN-ACCEPTED** UX follow-up.
- Cross-App More-menu presentation remains **OPEN / NOT IMPLEMENTED /
  NOT HUMAN-ACCEPTED**. The Human-selected NarrativeLine text-row reference is
  recorded separately; the three applications do not thereby have accepted
  implementations.
- Candidate Stable registration, The Ashen Crown canonical EN/JA sample
  updates, public release, and deployment are outside this checkpoint.

This review does not alter the accepted EN/JA locale milestone or broaden the
acceptance of ParameterPlotter as a whole.

## Required final disposition

The reported cases pass within the bounds above. Before marking this
Candidate 0.2.0 browser checkpoint formally accepted and closed, the Human must
either accept the stated limits (including the two untested browser actions) or
request those actions be exercised in a browser. No untested behavior is
implicitly accepted by this record.
