# The Ashen Crown EN Bundled Sample: Human Browser Acceptance Closure

Date: 2026-10-08

Status: **HUMAN BROWSER ACCEPTED / PASS / CLOSED (BOUNDED ASHEN CROWN EN BUNDLED SAMPLE INTEGRATION)**

Accepted ParameterPlotter source: `52933b5bf7e0f40ea290f57ff83454faae23f060`.

Canonical source: E2R-SPEC commit
`25de41d2bd3b502d6e53b7ff775776d4a6e21ddf`.

This is the later Human disposition for the previously pending review in the
[bundled sample sync record](./ashen-crown-bundled-sample-sync-2026-10-08.md).
That original record remains unchanged as historical evidence of the pending
state and of the earlier Codex browser-control initialization failure.

## Human Browser Review — PASS

Human reviewed the English bundled sample in Edge InPrivate at `localhost:4182`
and explicitly confirmed its acquisition route: Home's **Open Sample Dataset ·
The Ashen Crown** action.

Human-provided screenshots and report confirm within this bounded review:

- The Dataset displayed 10 Entities, 7 Dimensions, and 70 Assessments.
- Profile showed Darius Halden with Diplomatic Skill `5`, Contribution to
  Concord `-4`, and explicit zero values.
- Radar displayed a shape based on the three selected Dimensions' values.
- Quadrant used Diplomatic Skill for X and Contribution to Concord for Y, with
  Darius plotted at `(5, -4)`.
- Matrix displayed the seven Dimensions and their values, including explicit
  zero and Concord `-4` as recorded values rather than missing Assessments.
- After switching the UI between EN and JA, the English Dataset-authored Entity
  names, Dimension names, endpoint labels, and values remained English and
  unchanged; fixed UI wording followed the selected UI locale.

This is a Human Browser PASS for the acquisition route and the visible sample
content/view/locale behavior listed above. It does not mean Human individually
audited all 70 Assessment cells, repeated all create/edit/save/Export actions,
or tested every browser.

## Separate automated evidence

At the sample-sync checkpoint, automated checks established that the bundled
file was byte-identical to canonical EN, with SHA-256
`044187116106ce27178eb2457df8f0dad3ee68d6bb656800bede68900e306552`. The exact
Candidate and Specification declaration versions were `0.2.0`; 7 Dimensions,
70 Assessments, explicit zero, and Concord `-4` were retained. `npm.cmd run
check` passed syntax validation for 26 application modules and all 95 tests.
Focused automated render tests exercised Profile, Radar, Quadrant, and Matrix.
These are machine verification results, distinct from this Human Browser
Review.

Codex's browser-control runtime failed during initialization before selecting
a browser or tab. That limitation remains recorded as an automation-environment
failure, not an application failure or a browser PASS; the later Human Browser
review supplies its own evidence.

## Acceptance boundary

Closed scope: **ParameterPlotter Home acquisition and presentation of the
The Ashen Crown English bundled sample — HUMAN BROWSER ACCEPTED / PASS / CLOSED**.

This does not accept the whole ParameterPlotter Product, the canonical EN/JA
pair across applications, or use in Hub, NarrativeLine, or LiaisonScape.
Candidate 0.2.0 remains non-Stable. The separate Candidate 0.2.0 integration
acceptance and the canonical JA text-repair acceptance remain Accepted /
Closed without being reopened. Stable promotion, release, deployment, and
publication are not authorized.

Independent UI follow-ups remain open: Entity drawer menu visibility/internal
scrolling; Workspace/right Drawer same-role button-size consistency in EN/JA;
and the Human-selected Cross-App More-menu presentation, which remains
unimplemented and not Human-accepted. These are unrelated to this sample
acceptance.
