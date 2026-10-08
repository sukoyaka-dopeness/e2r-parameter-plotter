# ParameterPlotter EN/JA Locale Human Browser Acceptance

Date: 2026-10-08

Status: **HUMAN BROWSER ACCEPTED / PASS / CLOSED — BOUNDED LOCALE MILESTONE**

## Accepted source

Human Browser Acceptance applies to ParameterPlotter source commit
`5d7c23647ec14b9c7738d52056c4c1b05895f8b9`, including the fix for rendering
Datasets with unnamed Entities. The current repository HEAD is documentation
commit `4b5e545cf37b72fb8e557cfdb370506d026df618`; it adds the independent
Entity-drawer menu-visibility follow-up and does not change runtime source.

This acceptance covers the EN/JA locale presentation and the specific
interactions listed below. It is not acceptance of ParameterPlotter as a whole,
release readiness, publication, or every runtime surface and interaction.
Dimension Assessment Candidate `0.1.0` remains non-Stable.

## Human Browser results — PASS

- JA and EN Workspace presentation.
- Header, Footer, and Dataset title.
- Browser-local saved-state status and E2R JSON Export guidance.
- Profile, Radar, Quadrant, and Matrix presentation.
- JA and EN Dimension empty states.
- Entity and Dimension drawers.
- Entity create/edit form wording and Dimension create-form wording.
- English Workspace and all four view surfaces at 390px width.
- Entity and Dimension drawers and their create forms at 390px width.
- More menu at 390px and dismissal with Escape.
- EN → JA → EN locale switching.
- Preservation across locale changes of Dataset content, Entity count,
  selection, and active view.
- Normal rerender after creating an Entity without a name.
- Browser-local recovery after reload with the unnamed Entity retained.
- JA Entity-description placeholder **エンティティの説明を入力**.

The unnamed-Entity rerender was rechecked by Human in the real browser after
source fix `5d7c23647ec14b9c7738d52056c4c1b05895f8b9` and passed.

## Coverage limits

The 390px Matrix check had zero Dimensions and covered its empty state. It did
not newly verify populated Matrix cells or horizontal scrolling. Human
acceptance evidence for value-bearing Profile, Radar, Quadrant, and Matrix
exists in the earlier [successor functional acceptance record](./successor-human-acceptance-2026-10-06.md),
but this locale acceptance did not retest every value-editing interaction.
This is not blanket acceptance of every overlay, validation path, Entity or
Dimension operation, Assessment operation, or accessibility behavior.

The locale and browser interactions above are Human Browser Acceptance. The
automated checks are recorded separately: at documentation time,
`npm.cmd run check` passed syntax checks for 26 application modules and all
83 tests. These checks do not replace or expand the Human acceptance scope.

## Independent open follow-ups

- **Entity drawer menu visibility / internal scrolling:** Human observed that
  opening the ellipsis menu for the final unnamed Entity in a 13-Entity English
  list clipped Edit/Delete until manually scrolling the drawer. Edit itself
  worked. This is an independent, **OPEN / NOT IMPLEMENTED / NOT ACCEPTED** UX
  follow-up, recorded in the [current implementation status](./successor-first-implementation.md).
  It is not a locale failure.
- **`dimensionDisplayName()` undefined `range` reference:** the current
  `workspace-actions.js` contains a reference to `range` in this function with
  no local definition. Its triggering conditions and user-visible impact have
  not been verified. It remains an independent, **UNINVESTIGATED / UNFIXED**
  functional-quality follow-up, not a locale failure.

Neither follow-up withdraws or changes this bounded locale PASS. The broader
real-browser overlay audit, full Product acceptance, final pre-public-release
audit, and all publication gates remain separate.
