# ParameterPlotter successor bounded implementation

Date: 2026-10-05

Status: **HUMAN-AUTHORIZED / LOCAL IMPLEMENTATION IN PROGRESS / AUTOMATED CHECKS PASS / NOT HUMAN-ACCEPTED / UNCOMMITTED / UNPUBLISHED**

This is a bounded successor implementation in the canonical
e2r-parameter-plotter repository. It does not change the historical
Candidate B first-slice acceptance, which remains session-only and
Human-accepted, or the separate Prototype 2 closure record.

## Product boundary

- Single-user workspace; new Entities are created directly in the active E2R
  Dataset. Candidate B tempEntities are not migrated, restored, converted,
  or automatically promoted.
- Dataset Entity ordinary editing is limited to name and description;
  IDs remain immutable. Blank or whitespace-only input removes the optional
  field. Unchanged fields and all other Core fields and Extensions are
  preserved.
- Incident Relations block Entity deletion. ParameterPlotter does not edit or
  delete Relations. If it cannot safely target a current Relation in a
  Relation-owning application, it explains that the Relation must be resolved
  there before deletion.
- Dimension Assessment Candidate 0.1.0 data remains inside the E2R Dataset:
  Dimensions and Entity Assessments are portable facts; view, selection,
  placement, chart geometry, and interaction state are application state.
  The Candidate is Human-adopted but not Stable.
- The Validator is a read-only diagnostic dependency. Error-invalid,
  parseable Datasets open as diagnostic read-only inspection. Warnings do not
  blanket-block authoring or Export. Unsupported Candidate data stays opaque.
  Dataset Export revalidates, blocks on errors, and preserves visible warnings.
- Applied Entity, Dimension, and Assessment mutations mark the Dataset as
  changed. Dataset Export establishes a clean baseline only for its handed-off
  Dataset snapshot; it does not claim that the user retained the file or clear
  pending drafts, browser-persistence status, or Workspace Backup status.
- Browser-local persistence, E2R Dataset Export, and the self-contained
  ParameterPlotter Workspace Backup are separate. The backup carries the
  Dataset dependency snapshot with its Candidate Dimensions and Assessments.
  It is not an E2R Dataset artifact.
- Workspace restore replaces the whole active workspace. Loss-sensitive
  current work requires explicit confirmation; Cancel and Discard and Restore
  are available, while making a separate backup remains optional. Failure
  before activation leaves the active and prior persisted workspaces intact.
  A browser write failure after an incoming workspace is activation-ready
  applies it in memory as visibly degraded/unsaved and retains the previous
  persisted copy until the new workspace is written.
- Browser-storage failure does not silently appear successful or prevent
  current-session editing. Unapplied authoring drafts are separately disclosed
  and protected on replacement and unload.
- No Dataset write-back, portable Observation model, account, shared
  workspace, cloud persistence, Stable registration, release, or deployment is
  included.

## Implementation and source boundary

The local successor source integrates the E2R Validator's Candidate
0.1.0 checks and ships a browser-loadable snapshot under
vendor/e2r-validator/. The canonical Validator source remains in
C:\Users\extra\E2R\e2r-validator; scripts/sync-validator-vendor.mjs
synchronizes the browser copy from that adjacent checkout. The vendored
snapshot currently includes Candidate support that is still uncommitted in
the Validator repository. Review both repository diffs together before either
source is committed.

Application code is still intentionally flat at this first successor
checkpoint. Domain mutations are isolated in successor-domain.js, workspace
recovery rules in workspace-recovery.js, and the static server safely serves
nested browser modules. Further organization remains incremental and
responsibility-based; no fixed directory layout is prescribed.

The local server uses port 4180 by default and accepts a `PORT` override when
that port is occupied. The current successor review server is
<http://localhost:4181>. A supporting browser smoke check is recorded in the
e2r-spec implementation result; it is not visual or first-successor Human
acceptance.

## Supporting verification

- ParameterPlotter application: npm run check and focused unit tests.
- Canonical Validator repository: npm run validate, including its existing
  fixtures and the new Candidate semantic tests.
- Vendored browser modules: node scripts/sync-validator-vendor.mjs --check.
- e2r-spec Candidate/schema validation and the repository validation gate.
- git diff --check in each changed repository.

These are machine evidence only. They do not grant Candidate Stable status,
Human acceptance, or publication.

## Historical references and separate follow-ups

- Candidate B first-slice acceptance remains in
  first-slice-human-acceptance-2026-10-04.md; it is not superseded as a
  historical Human result.
- Prototype 2 remains 19 Human PASS / 0 PENDING / B3 NOT RUN, closed in its
  e2r-spec authority.
- The previously recorded Quadrant resize-to-scroll connector defect and
  waiting-Entity plot-click discoverability remain separate follow-ups. This
  implementation does not promote them to blockers.
- No commit, push, tag, release, deployment, Pages publication, or Hub listing
  has occurred.
