# Home Sample Locale Alignment: The Ashen Crown

Status: **IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

The existing Home action, “Open Sample Dataset · The Ashen Crown,” selects
`samples/ashen-crown.en.e2r.json` for English UI and
`samples/ashen-crown.ja.e2r.json` for Japanese UI. The selection uses the
already resolved ParameterPlotter UI locale. It does not add locale behavior
to Dataset Handoff, override a saved language preference, or translate
Dataset-authored text.

The Japanese action label is localized as
「サンプルデータセットを開く · 灰冠の王国」 to match the Japanese Dataset
title. This changes only the UI label; EN/JA sample selection is unchanged.

Both files are byte-for-byte copies of the E2R-SPEC canonical samples from
commit `25de41d2bd3b502d6e53b7ff775776d4a6e21ddf`:

| Dataset | Source | SHA-256 | Content |
| --- | --- | --- | --- |
| EN | `e2r-spec/examples/ashen-crown.en.e2r.json` | `044187116106ce27178eb2457df8f0dad3ee68d6bb656800bede68900e306552` | 10 Entities, 12 Events, 57 Relations, Candidate 0.2.0, 7 Dimensions, 70 Assessments |
| JA | `e2r-spec/examples/ashen-crown.ja.e2r.json` | `745d3d293cc07cd84e076090d8f152deea69c5818f535f2cf9e9cbc51c65ec2f` | Same Core IDs and assessment payload; localized dimension text and distinct Dataset ID |

The Dataset owner and source of truth remain E2R-SPEC. These bundled copies
add no Dataset facts. Candidate 0.2.0 remains non-Stable. The previous bounded
Human Browser Acceptance applies to the EN bundled sample only; this locale
alignment and the JA Home acquisition path have not received Human Browser
Acceptance.

The source change is limited to choosing the existing sample file before
calling the existing `receiveDataset` replacement-safety path. A failed
fetch still reports an error without replacing the active Dataset. No
sample-specific Handoff, URL fragment, or saved-locale contract was changed.

Automated verification checks both files with the vendored Validator, checks
the exact source digests, compares localized files' Dimension IDs, ranges,
integer constraints, Assessment tuples, Core IDs, and version declarations,
and checks the locale-to-file mapping. Human Browser Acceptance remains
pending for EN/JA Home selection, display, and ordinary acquisition safety.
The Japanese label correction is covered by an automated assertion; the
Human Browser Acceptance boundary remains unchanged.
