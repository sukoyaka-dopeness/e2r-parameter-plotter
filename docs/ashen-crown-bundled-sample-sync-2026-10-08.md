# The Ashen Crown Bundled Sample Sync — 2026-10-08

## Status

**IMPLEMENTED / AUTOMATED VERIFICATION PASS / HUMAN BROWSER ACCEPTANCE PENDING**

This checkpoint synchronizes only ParameterPlotter's existing English bundled
sample. It does not reopen Candidate 0.2.0's bounded Human Browser Acceptance.

## Source and acquisition path

The source is E2R-SPEC canonical English Dataset
`examples/ashen-crown.en.e2r.json` from commit
`25de41d2bd3b502d6e53b7ff775776d4a6e21ddf`. The bundled
`samples/ashen-crown.en.e2r.json` is byte-for-byte identical; both have SHA-256
`044187116106ce27178eb2457df8f0dad3ee68d6bb656800bede68900e306552`.
E2R-SPEC remains authoritative.

The existing Home action `Open Sample Dataset · The Ashen Crown` still fetches
`./samples/ashen-crown.en.e2r.json`. No Japanese bundled copy, sample selector,
or alternate acquisition path was added.

## Synchronized content and preservation

The bundled Dataset contains 10 Entities, 12 Events, 57 Relations, 7
Dimensions, and all 70 Entity/Dimension Assessments. It matches the canonical
Dataset's IDs, names, ranges, `integerOnly` settings, endpoint labels,
Descriptions, and Assessment values. Its exact Dimension Assessment payload
version and matching Specification Extension declaration are both `0.2.0`.
Explicit zero values and Darius's `Contribution to Concord` value `-4` are
retained.

Dataset ID `ashen-crown-en-v1`, all Core Object IDs and content, Metadata,
History declaration, and other existing Extension content match the
canonical source. UI locale remains independent of Dataset language; the
English sample is not translated when Japanese UI is selected. Acquisition,
browser-local recovery, replacement protection, and Export implementations
were not changed.

## Verification

- `npm.cmd run check`: **PASS**; syntax check covered 26 application modules
  and all **95/95 tests passed**.
- The bundled sample test checks its pinned SHA-256, `0.2.0` payload/declaration,
  7 Dimensions, 70 Assessments, explicit zero, and the negative Concord value;
  the vendored Validator accepts the Dataset.
- A focused renderer test hydrated the bundled Dataset through the current
  application model and exercised Profile, Radar, Quadrant, and Matrix output.
  It confirmed that the selected assessment values, three-spoke Radar polygon,
  plotted Darius point, and `-4` Matrix cell are present.
- `samples/README.md` records the canonical source commit and matching digest.

These are automated source/test results, not a real-browser run or Human
Browser Acceptance. A Codex browser smoke was attempted, but the browser
control runtime exited during initialization with `trusted Node process exited
unexpectedly; kernel reset` on both attempts, before a browser or tab was
selected. No browser result is claimed. No browser storage was read, replaced,
or modified.

## Pending Human Browser Acceptance

Human review should open the Home sample action and confirm the bundled English
Dataset and its seven Dimensions/70 Assessments in Profile, Radar, Quadrant,
and Matrix; verify that explicit `0` and the `-4` Concord value display; and
switch to Japanese UI to confirm that Dataset-authored English text remains
unchanged. This review is limited to the bundled sample integration. Existing
locale and Candidate 0.2.0 acceptance records remain unchanged.

ParameterPlotter's bundled sample update does not change Candidate maturity or
authorize Hub integration, Cross-App acceptance, release, deployment, or
publication.
