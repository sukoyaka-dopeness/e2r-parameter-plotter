# Dimension Assessment Candidate 0.2.0 Human Browser Acceptance Closure

Date: 2026-10-08

## Status

**HUMAN BROWSER ACCEPTED / PASS / CLOSED**

**BOUNDED CANDIDATE 0.2.0 INTEGRATION**

Accepted ParameterPlotter runtime source:
`a2b4c311013c946f1006a3c8ad58bade22743110`
(`Add Dimension Assessment Candidate 0.2.0 support`). Documentation commits
do not change this accepted runtime source. Candidate `0.2.0` remains a
non-Stable Candidate.

## Evidence and closure

This closure combines the Human Browser PASS results in the [initial Human
Browser review](./candidate-0.2.0-human-browser-review-2026-10-08.md) with the
two additional Human-reported browser checks below. The earlier review's
`PENDING` disposition accurately described the checkpoint before these two
checks; this closure supersedes that pending disposition without removing or
rewriting the earlier evidence.

### Candidate 0.1.0 ordinary edit — PASS

Using E2R-SPEC `basic.json`, the Human changed the Dimension name `Impact` to
`Impact test` and saved. The exported JSON retained:

- Dimension name `Impact test`;
- Dimension Assessment payload `specVersion: 0.1.0`;
- matching Specification Extension `uses` version `0.1.0`;
- two Dimensions and three Assessments with values `-2`, `0`, and `3`; and
- no implicitly added Description.

This is Human Browser PASS that ordinary editing of the `0.1.0` Dataset does
not silently upgrade it.

### Upgrade dialog Escape cancellation — PASS

The Human reports that Escape closed the explicit-upgrade confirmation dialog
without applying the upgrade. No claim is made about focus restoration or
other unreported focus details. This is Human browser evidence; it does not
mean a dedicated automated interaction test was added.

## Accepted bounded scope

The accepted scope is the combination of the initial review's reported Human
Browser PASS cases and the two additions above:

- New Dataset authoring with first Dimension save at exact Candidate `0.2.0`;
- optional Description create, display, edit/removal, validation, reload, and
  Export behavior, including multiline and markup-like plain text;
- explicit upgrade from Candidate `0.1.0`, the confirmation and cancellation
  paths, preservation of Dimensions, IDs, scales, Assessments, and aligned
  Specification Extension version declarations;
- browser-local saved and unsaved draft behavior as reported;
- English/Japanese UI switching without translating Dataset Description; and
- the reported Profile, Radar, Quadrant, and Matrix states, including the
  distinction between zero and unassessed values.

The earlier Dimension 2-2 Description omission was an intentional deletion
test, not a data-loss defect. The unsaved Description lost on reload was also an
intentional reload-protection test, not a save defect.

## Automated verification and limits

Automated verification remains separate from Human Browser Acceptance.
`npm.cmd run check` on the accepted source passed syntax checks for 26
application modules and **94/94 tests**. The tests cover model-level
`0.1.0` ordinary-edit version preservation and upgrade data preservation.
There is no focused automated interaction test for Upgrade-dialog Escape; its
PASS above is based on the Human's browser report.

This closure does not accept untested browser families, hosted/deployed
behavior, focus restoration, every validation or overlay path, all Assessment
authoring behavior, or ParameterPlotter as a whole. It is not Stable
registration, cross-app interoperability acceptance, release readiness, or
publication approval.

## Independent follow-ups retained

- Entity drawer end-of-list action-menu visibility / internal scrolling remains
  **OPEN / NOT IMPLEMENTED / NOT HUMAN-ACCEPTED**.
- Cross-App More-menu presentation remains **OPEN / NOT IMPLEMENTED /
  NOT HUMAN-ACCEPTED**. The NarrativeLine reference direction is Human-selected
  and recorded separately; implementation is not accepted.
- The Ashen Crown canonical EN/JA sample and ParameterPlotter bundled sample
  remain unchanged and are outside this closure.
- Candidate Stable registration, public release, and deployment remain
  separate future decisions and are not authorized here.

The previously accepted EN/JA locale milestone remains unchanged.
