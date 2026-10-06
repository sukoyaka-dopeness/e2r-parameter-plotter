# ParameterPlotter successor functional Human Acceptance

Date: 2026-10-06

Status: **FUNCTIONAL ACCEPTANCE HUMAN-ACCEPTED / CLOSED FOR THE TESTED LOCAL WORKTREE**

This is acceptance of the bounded successor application behavior against the
Human-adopted Product decisions and Dimension Assessment Candidate `0.1.0`.
It is not Candidate Stable registration, cross-consumer interoperability
acceptance, release approval, or deployment approval.

## Accepted source and evidence boundary

Human tested the local working tree based on checkpoint
`a4bf167f2b1b5d025a12acab8b88be0c388635e3`, including the successor wiring,
regression-hardening, and presentation changes listed in the implementation
checkpoint. That exact accepted source set is now fixed in local commit
`b9a8e1fee6499c191c66033296e98965d777684e` (`fix: close successor browser
acceptance gaps`). The source commit contains the previously tested changes.
This acceptance record is a later documentation commit. The source remains
unpublished, and any later source change must be assessed against this evidence
before treating it as the accepted implementation.

Later local commits `a27b6ef5056291cbe1c5a2ff80e69a43c55aa5c8`,
`35e8a8c1612d4aa9ce00feef75f255d4d5a6776d`, and
`623b73b77d055be7f38d8d87ba109e7c8947c0a3` add a copy-only direct Dataset
Entity Description placeholder correction, implement the Human-decided
endpoint-label presentation policy, and suppress orphan separators when label
fields are present but empty. Automated regression tests cover these
corrections. None replaces or broadens the exact Human-accepted source above;
the later source has not received a new Human functional acceptance.

The evidence combines direct Human operation in Microsoft Edge, Codex-led
real-browser operation at `http://localhost:4181/`, and repository-local
automated checks. Automated evidence is identified separately below and is
not presented as Human browser evidence.

## Acceptance results

| Area | Result | Evidence |
| --- | --- | --- |
| Dataset open/replacement loss protection | **PASS — Human browser** | Replacement confirmation appeared for changed work; Cancel preserved the current workspace; explicit Discard and Open replaced it. |
| Dataset Export lifecycle | **PASS — Human browser** | Successful E2R JSON download handoff established the clean baseline; a later Dataset mutation returned the state to Changes not exported. Export remained separate from browser persistence and Workspace Backup. |
| Workspace persistence and backup/restore | **PASS — Human browser** | Reload continuity, separate Workspace Backup, restore confirmation, and workspace restoration were exercised. |
| Pending draft reload protection | **PASS — Human Edge** | With a clean Dataset and saved browser workspace, an unsaved Dimension-name draft triggered Edge's reload confirmation. Cancel retained the draft and statuses; continuing reload discarded only the draft and restored the saved Dimension, clean baseline, saved workspace, 10 Entities, 1 Dimension, and 0 Assessments. |
| Entity lifecycle | **PASS — Human browser** | Direct Dataset Entity creation and editing worked; an Entity with incident Relations was blocked from deletion; zero-incident deletion required confirmation. |
| Dimension and Assessment authoring | **PASS — Human browser** | Dimension create/edit, Assessment create/delete, Dimension deletion with dependent Assessment cleanup, and Profile/Matrix reflection were exercised. |
| Assessment numeric contract | **PASS — Codex real browser** | Zero and inclusive range endpoints were recorded; out-of-range values were rejected without replacing the prior value; integer-only Dimensions accepted integers and rejected decimals. |
| Dimension range validation and Rescale | **PASS — Human and Codex real browser** | Invalid equal/incomplete bounds were rejected without mutating the Dataset. Human review and Back left data unchanged; approved Rescale applied the reviewed range and value together. Browser test confirmed `7 → 4` for integer-only 0–10 to 0–5. |
| Dataset Export and reopen | **PASS — Codex real browser** | Export produced parseable Candidate `0.1.0` JSON, set the clean baseline, and reopening restored Entity, Dimension, Assessment, and diagnostics. |
| Warning-only and opaque content | **PASS — Codex real browser** | A warning-only unknown Extension Dataset allowed supported Entity editing and Export; the unknown sibling Extension payload survived Export unchanged and remained after reopen. |
| Validator error handling | **PASS — Codex real browser** | A parseable error-invalid Dataset opened in diagnostic read-only mode; Entity, Dimension, and Assessment authoring and Export were unavailable. |
| Browser-local write-failure handling | **PASS — automated; browser failure injection NOT RUN** | Regression tests cover degraded/unsaved continuation and preservation of the previous persisted copy. No real browser storage failure was induced during acceptance. |

No unresolved functional FAIL remains in the accepted scope. The browser
storage-failure path is covered by state/transaction tests but was not induced
in a live browser; this evidence limitation is retained rather than described
as a browser PASS. The listed Human and Codex browser cases passed.

## Final Gate

- ParameterPlotter `npm.cmd run check`: **PASS**, syntax check and 46/46 tests.
- e2r-validator `npm.cmd test`: **PASS**, 136/136 tests, including Candidate
  `0.1.0` validation.
- e2r-spec `npm.cmd run validate`: **PASS**, including 13 Dimension Assessment
  Candidate payload/semantic cases.
- ParameterPlotter vendored Validator synchronization check:
  **PASS** (`node scripts/sync-validator-vendor.mjs --check`).
- `git diff --check`: **PASS** in the reviewed worktrees.
- Candidate status remains **Human-adopted Candidate `0.1.0`, not Stable**.
- No release, tag, deployment, Pages publication, or Hub listing is included.

## Non-blocking follow-ups and out-of-scope evidence

The tested worktree includes bounded presentation corrections for Dataset
title/identity visibility, inactive View-tab affordance, Dimension option
checkbox association, and stale action-specific notices. The Dataset Entity
Description placeholder and absent-endpoint-label presentation were corrected
after acceptance in the follow-ups noted above. A subsequent 390px local
real-browser review checked Profile, Radar (including adding three spokes),
Quadrant (including selecting both axes), and Matrix. All displayed numeric
MIN/MAX without empty-label separators; no new clipping or horizontal overflow
was seen. The Matrix's existing horizontal table scroll remained usable. This
narrow review is evidence about the post-Acceptance correction only and does
not change the Human-accepted source boundary. Existing Prototype 2 Quadrant
connector and waiting-Entity discoverability follow-ups remain separate. This
record does not claim Human functional acceptance of the later source.

Other browsers, hosted/deployed behavior, Candidate Stable registration, and
cross-consumer interoperability were **NOT RUN** and are outside this bounded
local application functional acceptance. Candidate `0.1.0` remains non-Stable.
