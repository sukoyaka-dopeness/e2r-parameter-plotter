# ParameterPlotter successor bounded implementation

Date: 2026-10-05

Status: **BROAD FUNCTIONAL HUMAN ACCEPTANCE `b9a8e1fee6499c191c66033296e98965d777684e` / WORKSPACE BACKUP REMOVAL HUMAN-ACCEPTED `34f72fad67b9d59b011dbad3880ff0f5a09a0f45` / CURRENT LOCAL SOURCE `88e6348d077167757f96c7e01e59063cbc90035b` INCLUDES HUMAN-APPROVED EN/JA LOCALE WORDING CORRECTIONS, HUMAN BROWSER ACCEPTANCE PENDING / UNPUBLISHED / CANDIDATE NOT STABLE**

This is a bounded successor implementation in the canonical
e2r-parameter-plotter repository. It does not change the historical
Candidate B first-slice acceptance, which remains session-only and
Human-accepted, or the separate Prototype 2 closure record.

The dated implementation and audit sections below preserve their original
checkpoint status. The latest locale checkpoint and its remaining Human
review boundary are recorded at the end of this document.

## Product boundary at the implementation checkpoint

This section records the Product boundary used to build and accept the tested
implementation. The latest Human-selected Product direction and the remaining
implementation gap are recorded at the end of this document; the historical
implementation and acceptance evidence below is not rewritten.

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
snapshot matches Validator local commit
`6533e970ddc5d5131a1f39fe88e22d8f6402c416`; the accepted ParameterPlotter
source including that snapshot is local commit
`b9a8e1fee6499c191c66033296e98965d777684e`. Both commits remain unpublished.

Application code is still intentionally flat at this first successor
checkpoint. Domain mutations are isolated in successor-domain.js, workspace
recovery rules in workspace-recovery.js, and the static server safely serves
nested browser modules. Further organization remains incremental and
responsibility-based; no fixed directory layout is prescribed.

The local server uses port 4180 by default and accepts a `PORT` override when
that port is occupied. The current successor review server is
<http://localhost:4181>. The subsequent functional Human and real-browser
acceptance evidence is recorded in
[successor Human Acceptance](./successor-human-acceptance-2026-10-06.md).

## Supporting verification

- ParameterPlotter application: npm run check and focused unit tests.
- Canonical Validator repository: npm run validate, including its existing
  fixtures and the new Candidate semantic tests.
- Vendored browser modules: node scripts/sync-validator-vendor.mjs --check.
- e2r-spec Candidate/schema validation and the repository validation gate.
- git diff --check in each changed repository.

The automated checks support, but do not replace, the Human and browser
acceptance recorded in the linked result. Acceptance applies to the tested
local working tree now fixed at source commit
`b9a8e1fee6499c191c66033296e98965d777684e`; the source remains local and
unpublished. It does not grant Candidate Stable status or authorize release or
deployment.

After acceptance, local commits `a27b6ef5056291cbe1c5a2ff80e69a43c55aa5c8`
and `35e8a8c1612d4aa9ce00feef75f255d4d5a6776d` added a copy-only direct
Dataset Entity Description placeholder correction and the Human-decided
optional endpoint-label presentation, respectively. The latter shows numeric
MIN/MAX without supplying Low/High labels when labels were not authored, and
retains explicit Candidate labels when present. Both changes have automated
regression coverage and do not change Candidate semantics or the accepted
behavior baseline. The exact Human-accepted source remains
`b9a8e1fee6499c191c66033296e98965d777684e`.

Commit `623b73b77d055be7f38d8d87ba109e7c8947c0a3` further corrected empty
endpoint-label fields so they do not leave orphan separators. The same
presentation helper now owns the Profile, Radar, Quadrant, Matrix, and
Dimension Pool range paths. A 390px real-browser review covered all four views,
including Radar spoke additions and Quadrant axis selection; this is a
post-Acceptance correction and does not replace the accepted source revision.

## Post-Acceptance source-readiness review

Reviewed 2026-10-06 against local source commit
`623b73b77d055be7f38d8d87ba109e7c8947c0a3` and its successor status record.
This is a technical readiness audit, not a new Functional Human Acceptance,
release, or deployment approval.

- ParameterPlotter `npm run check`: **PASS**, syntax for 19 application
  modules and 50/50 tests.
- Canonical Validator `npm run validate`: **PASS**, 136/136 tests and 3/3
  fixture tests. Its source is local commit
  `6533e970ddc5d5131a1f39fe88e22d8f6402c416`; the vendored browser modules
  match all 14 canonical modules (`node scripts/sync-validator-vendor.mjs
  --check`). That Validator commit remains ahead of the published Validator
  `main`.
- e2r-spec `npm run validate`: **PASS**, including the 13 Dimension
  Assessment Candidate `0.1.0` checks. Existing mixed changes in that checkout
  were left untouched.
- The local static server returned the application entry, CSS, main module,
  and vendored Validator modules successfully. HTML asset references and
  browser module imports are relative, so they resolve beneath a repository
  subpath as well as at an origin root. No hosted subpath deployment was
  available to smoke-test.
- The repository's only workflow is a read-only `Check` running
  `npm run check`; it grants `contents: read` and does not publish or deploy.
  The latest available public runs pass on the published Candidate B source
  (`785e701`), not on this unpublished successor source.
- The repository is public under the canonical identity, carries the approved
  description and topics, and has a blank homepage URL. MIT license notices
  are present for the app and vendored Validator. `package.json` is private
  and has no package version, so npm publication is not configured.

The source is locally verified, but the successor is not yet on public
`main`. No formal release identity/version or hosting/deployment target is
selected. Browser-local storage write-failure injection remains **NOT RUN in a
real browser**; current evidence for that failure path is automated only. The
exact Human-accepted source remains `b9a8e1fee6499c191c66033296e98965d777684e`;
the current post-Acceptance source has not received a new Human functional
acceptance. Candidate `0.1.0` remains non-Stable.

## Product / UI completion follow-up - 2026-10-07

Source commit `111be04898f354efe92856dfdd355ca89845fa59` moves Open E2R
Dataset, Restore Workspace Backup, Export E2R JSON, and Download Workspace
Backup under a non-primary More disclosure, keeps the native file inputs
available outside collapsed disclosure content, and corrects View control
semantics. This is a post-Acceptance correction, not a new Human functional
acceptance. The separate [Product/UI completion audit](./product-ui-completion-audit-2026-10-07.md)
records the cross-app surface inventory, evidence limits, and remaining Human
gates. Its local documentation checkpoint is `e6733aad51cd083e54329a6d59a9de5f364186d3`.

The new disclosure was rendered and reviewed in desktop-sized Edge. Keyboard
focus, Escape dismissal/restoration, and outside-click dismissal were checked
in the desktop browser; the disclosure has not received its own 390px browser
review. The previous 390px review covers the four visualization views only.
The native file picker was not opened during this audit, and no real
screen-reader test was performed. The 54/54 application test result and
syntax/diff checks are automated evidence, not Human Acceptance of this
source.

The app still has no Home route, EN/JA interface, Footer/Credits surface,
built-in sample Dataset, or user guide. Those gaps and the choices needed for
Home/startup behavior, language scope and terminology, sample content and
provenance, Credits/identity, and Dataset-title authoring are itemized in the
linked audit. No new Dataset workflow, title editing, sample, release identity,
or deployment target was chosen here.

## Historical references and separate follow-ups

- Candidate B first-slice acceptance remains in
  first-slice-human-acceptance-2026-10-04.md; it is not superseded as a
  historical Human result.
- Prototype 2 remains 19 Human PASS / 0 PENDING / B3 NOT RUN, closed in its
  e2r-spec authority.
- The previously recorded Quadrant resize-to-scroll connector defect and
  waiting-Entity plot-click discoverability remain separate follow-ups. This
  implementation does not promote them to blockers.
- The accepted source and acceptance record are fixed in local commits
  `b9a8e1fee6499c191c66033296e98965d777684e` and
  `a46c853abe8d4fdf702130c67b21f93daf9aea51`. No push, tag, release,
  deployment, Pages publication, or Hub listing has occurred.

## Current Human-selected Product direction  E2026-10-07

Human selected **ParameterPlotter** as the formal Product name. Initial Product
scope includes Dataset title editing using existing Metadata
(`extensions.metadata.title`), with no new top-level Dataset name. The Ashen
Crown is the selected main sample direction; semantic sample facts and
provenance remain Human-authored/approved and this decision did not change
sample data.

Selected Japanese core terms are Dimension ↁE評価軸 (or 「軸、Ein narrow
context), Assessment ↁE値, Profile ↁEプロファイル, Radar ↁEレーダー,
Quadrant ↁE四象陁E and Matrix ↁEマトリクス. This does not settle all
dialog, confirmation, error, or empty-state copy; those require cross-app
comparison with NarrativeLine and LiaisonScape. Home/acquisition should align
with their current pattern: Continue Editing only when recoverable browser-local
work exists, plus New Dataset, Open E2R Dataset, and Open Sample Dataset. Shell
visual language should follow their accepted/current evidence; exact CSS,
markup, and breakpoints remain unselected.

Human explicitly superseded the earlier selection of browser-local persistence
plus user-managed Workspace Backup/Restore. Current initial Product direction
retains browser-local automatic persistence and same-browser/profile recovery,
but excludes Download Workspace Backup and Restore Workspace Backup. E2R
Dataset JSON remains the portable save/exchange artifact. Existing Dataset
replacement/exit loss protection and visible degraded/unsaved handling remain;
removing Backup does not treat memory-only work as saved or waive loss warnings.
Exact storage-failure retry/recovery UX remains open.

The 2026-10-07 bounded runtime correction removes Workspace Backup/Restore from
source `34f72fad67b9d59b011dbad3880ff0f5a09a0f45`. Human accepted this
correction as a separate checkpoint; see the [Workspace Backup/Restore removal
acceptance result](workspace-backup-removal-human-acceptance-2026-10-07.md).
Browser-local persistence and recovery, Dataset Export, replacement/unload
loss protection, and visible degraded or unsaved handling remain separate
responsibilities. This correction does not transfer Functional Human
Acceptance from source `b9a8e1fee6499c191c66033296e98965d777684e` to later
source changes.

## Formal Product identity synchronization - 2026-10-07

Human selected **ParameterPlotter** as the formal Product name. Local source
commit `2940b3fbf390e185781f3844f263bfe9401757c5` applies that identity to the
application heading, document/browser title, and local server startup message.
It is a post-Acceptance correction and does not extend either the broad
functional acceptance at `b9a8e1fee6499c191c66033296e98965d777684e` or the
bounded Workspace Backup/Restore removal acceptance at
`34f72fad67b9d59b011dbad3880ff0f5a09a0f45`.

## Home and Dataset acquisition implementation - 2026-10-07

The current local source adds Home as the startup and primary Dataset
acquisition surface, with **Continue Editing** shown only when a saved,
recoverable browser-local workspace exists. **New Dataset**, **Open E2R
Dataset**, and **Open Sample Dataset · The Ashen Crown** are the other Home
actions. The sample is an unchanged bundled copy of the E2R-SPEC canonical
English example; see [sample provenance](../samples/README.md).

Workspace actions retain **Home** navigation and the secondary **More** menu
with **Open E2R Dataset** and **Export E2R JSON**. Browser-local continuity is
described separately from portable E2R JSON. New, sample, and file acquisition
reuse the existing replacement confirmation when loss-sensitive work exists;
Cancel retains the active workspace, and explicit discard activates the
incoming Dataset. Existing reload/exit, pending-draft, and degraded/unsaved
protection remains in force. Workspace Backup/Restore is not reintroduced.

This is a post-Acceptance implementation checkpoint, not a transfer of
Functional Human Acceptance from `b9a8e1fee6499c191c66033296e98965d777684e`
or Workspace Backup/Restore removal acceptance from
`34f72fad67b9d59b011dbad3880ff0f5a09a0f45`. Automated and Codex browser
verification are recorded separately from Human Browser Acceptance in
[Home and acquisition verification](./home-startup-acquisition-2026-10-07.md).

## Current EN/JA locale wording checkpoint - 2026-10-08

Current local source is `88e6348d077167757f96c7e01e59063cbc90035b`. The
Human-approved browser-local status says **Workspace saved in this browser** /
**ブラウザー内に作業状態を保存しました**, followed by **To save an E2R
Dataset file, use Export E2R JSON.** / **E2Rデータセットのファイル保存は、別途
「E2R JSONを書き出す」から行います。** This changes presentation copy only;
browser-local persistence and E2R JSON Export remain separate behaviors.

The Dimension drawer starts with **Dimension Pool** / **評価軸一覧**, without
the `PORTABLE DATA` eyebrow. Its empty state is **No Dimensions yet.** /
**評価軸はまだありません。** Workspace summaries use ordinary Dimension
counts. Technical and developer-facing Candidate/portable references remain
outside this normal-UI wording change; Candidate `0.1.0` remains non-Stable.

Human Browser Review later found the JA Entity creation textarea still had the
fixed-UI placeholder `Describe this Entity`. Source commit
`88e6348d077167757f96c7e01e59063cbc90035b` localizes it as
**エンティティの説明を入力**. Dataset-authored names and descriptions remain
unchanged.

Machine validation on this source: `npm.cmd run check` passed syntax checks
for 26 application modules and all 80 tests. The local server returned HTTP
200 at `http://localhost:4180/`. Real-browser inspection was not completed:
the Computer Use state call failed during Windows sandbox setup with
`helper_unknown_error: setup refresh had errors`. HTTP availability and test
results are not browser evidence or Human Browser Acceptance. Human Browser
Acceptance of the locale presentation remains pending.

## EN/JA locale Human Browser Acceptance — 2026-10-08

The bounded EN/JA locale presentation milestone is now **HUMAN BROWSER
ACCEPTED / PASS / CLOSED** for source commit
`5d7c23647ec14b9c7738d52056c4c1b05895f8b9`. The detailed Human evidence and
coverage limits are recorded in [the locale acceptance result](./locale-human-acceptance-2026-10-08.md).
This acceptance closes the locale milestone only; it does not establish
complete Product acceptance, overall public-release readiness, or publication
authorization. Candidate `0.1.0` remains non-Stable.

## Human-observed Entity drawer menu visibility follow-up — 2026-10-08

**Status: OPEN / NOT IMPLEMENTED / NOT HUMAN-ACCEPTED**

During Human Browser Acceptance, the English Entity Pool showed 13 Entities.
Opening the ellipsis menu for the unnamed final Entity, **Entity 13**, placed
**Edit Entity** and **Delete** partly outside the drawer's visible area. A
manual scroll inside the drawer revealed both actions, and selecting **Edit
Entity** opened the edit form normally. This is an action-visibility and
drawer-scroll UX issue, not a localization gap or an Entity editing failure.

The requested follow-up is to reveal both menu actions when opening a menu
would clip them, scrolling only as far as needed inside the Entity drawer. If
both actions are already visible, opening the menu should not scroll. The page
and background Workspace should not scroll. Existing menu behavior, focus,
keyboard interaction, and accessibility must be preserved. The implementation
method is intentionally undecided until the current code and browser behavior
are examined during that follow-up.

This is Human-observed evidence for the English, 13-Entity, bottom-of-list
case. Narrow layouts, Japanese UI, keyboard-only operation, focus behavior, and
screen-reader behavior were not checked as part of this observation. Track it
independently from locale acceptance; it does not withdraw or alter any
previously recorded locale PASS result. No implementation or Human acceptance
of this UX follow-up is implied.

## Dimension display-name functional-quality follow-up — 2026-10-08

The independent `dimensionDisplayName()` undefined-`range` failure has been
reproduced and fixed. Same-name Dimensions with matching endpoint labels no
longer interrupt display-name checks or Profile rendering. Regression coverage
for exact duplicates, different numeric ranges, visually similar names, and
Profile markup is recorded in the [correction result](./dimension-display-name-quality-follow-up-2026-10-08.md).
Automated checks pass; this does not add Human Browser Acceptance. The bounded
EN/JA locale acceptance remains PASS, and the Entity drawer menu-visibility
follow-up above remains open and unimplemented.
