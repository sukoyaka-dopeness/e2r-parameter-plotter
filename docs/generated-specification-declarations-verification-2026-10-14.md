# Generated Dataset Specification declarations

Status: PARAMETERPLOTTER HUMAN ACCEPTED / CLOSED (BOUNDED) — 2026-10-17; G3 HUMAN ACCEPTED / CLOSED (BOUNDED)

## Adopted product direction

Human authorized exact version declarations when ParameterPlotter generates
Extensions. This is distinct from the historical Export-only acceptance:
[2026-10-12 bounded Export closure](../../e2r-spec/docs/cross-app/cross-app-export-specification-declaration-alignment-human-browser-review-and-closure-proposal-2026-10-12.md).
That historical evidence and its boundaries remain unchanged.

The applicable specifications are
[Metadata 1.0.0](../../e2r-spec/extensions/metadata-extension.md) and
[Specification 0.1.0](../../e2r-spec/extensions/specification-extension.md).
Metadata has no common `version` wrapper. Its exact version is declared in
Specification `uses`. The Specification payload declares itself through
`specVersion`; it must not also appear in `uses`.

## Implementation

- Only explicit New Dataset starts with Specification `0.1.0`, `uses: []`.
  The non-created startup placeholder remains unchanged and is not persisted.
- Title application creates/updates Metadata and safely completes declarations.
  Metadata-only data receives `{extension: 'metadata', version: '1.0.0'}`.
- Removing the last Metadata field removes its matching exact 1.0.0 declaration
  from a supported Specification payload. Dataset identity or other Metadata
  fields keep Metadata and its declaration. Existing future-version declarations
  are not guessed or downgraded.
- Generation or explicit editing/upgrade of supported Dimension Assessment
  completes declarations at the mutation boundary, including direct Assessment
  edits. Exact supported versions remain 0.1.0 and 0.2.0. Empty existing Dimension
  Assessment payloads remain present and declared after their last Dimension is
  deleted, following the existing serialization contract.
- `dataset-specification.js` reuses the previous Export completion algorithm.
  The same conservative completeness check is shared by generation and Export.
  No Validator suppression or schema change was introduced.

## External data and safety

Import, load and ordinary serialization/save do not automatically complete
legacy declarations. Explicit supported editing may complete a declaration
when all Dataset/object Extension occurrences have precisely known versions.
Unknown Extensions, unsupported payload versions or any existing Specification
payload prevent new declaration synthesis. Supported existing declarations may
receive only the new authoring-owned entry; other entries and additional
Specification information are preserved. Invalid existing declarations remain
diagnostic read-only. No partial Metadata-only declaration is invented beside
undeclared unknown payloads; the legitimate warnings remain in such cases.

Dataset replacement, revision checks, Single Active Editor, write gate,
refusal latch, draft protection and Return/Export recovery are unchanged.
Export-only completion still uses a copy and does not mutate an unedited legacy
Workspace or Export baseline. No saved Workspace migration was performed.

## Verification and review boundary

- Focused generation/title/Export model tests: 32/32 PASS.
- Full `npm run check`: 237/237 PASS; 42 application modules checked.
- Actual ES-module graph in isolated DOM contexts: 12 scenarios PASS, including
  New Dataset, title application, browser-local save, explicit reload-equivalent
  new-document resume, JSON Export and title removal. Generated Metadata and
  Specification match between memory, stored data and JSON; no declaration
  warning remains in those supported cases. Ownership/recovery regressions pass.
- Build: 64 static files. Diff check: PASS.

These are automated/DOM results, not Human or native-browser Acceptance.
Human should check New Dataset -> apply `test` -> save -> reload -> Continue ->
Export, and title removal/reapplication. Review exported Metadata/Specification,
then a supported Dimension creation/edit. Confirm legitimate external unknown
Extension diagnostics remain visible. Existing Human browsers, localStorage and
servers were not operated.

Single Active Editor remains HUMAN ACCEPTANCE PENDING. Existing bounded
acceptances are not expanded. Tab C Root Cause UNRESOLVED, Diagnostics D2 OPEN
and PUBLIC RELEASE NO-GO remain unchanged. No commit or public action was made.

## G3 evidence reconciliation — 2026-10-17

This section records the later G3 review. The Single Active Editor PENDING
statement above is the historical status at this document's original checkpoint;
its separate formal result is HUMAN ACCEPTED / CLOSED (BOUNDED). The G3 evidence
matrix below preceded the later Human decision. Individual G3 browser source revision and
independent same-session operation trace were not supplied.

| Case | Human Browser report | File inspection / Validator re-evaluation | Source audit / automated evidence | Limit |
| --- | --- | --- | --- | --- |
| G3-A — invalid, incomplete Specification | Human saw `unknown_extension` warning, `specification_declaration_missing` error, Diagnostic read-only inspection, and disabled title editing. | `G3-unknown-extension.e2r.json` is invalid with those warning/error codes. | Validator completeness check emits the error; ParameterPlotter disables authoring and Export for error-invalid data. | A Human Export-blocking click was not reported; its prohibition is Source Audit, not Human Browser evidence. |
| G3-B — valid unknown Extension, no Specification | Human changed the title and confirmed `G3-B-updated` after Reload in editable mode. | `G3-B-valid-unknown.e2r.json` and `G3-B-updated.e2r.json` are valid. The latter differs only by Metadata title; the unknown payload is equal and no Specification was synthesized. The resulting Metadata version is unspecified, with a warning. | The conservative declaration helper and focused tests preserve unknown data without guessing a version. | The Human report and submitted JSON establish the bounded workflow; no independent operation log or bytewise saved-Workspace capture links every step. |
| G3-C — valid declared unknown Extension | Human saw `unknown_extension` and `specification_unavailable` warnings, changed the title to `G3-C-updated`, saw Workspace saved, then confirmed the title, warnings, and editable state after Ctrl+R before Export. Human submitted `G3-C-updated.e2r (1).json`. | Both the original `G3-C-declared-unknown.e2r.json` and submitted Export are valid with warnings. Unknown payload, its existing `uses` entry/version `1.0.0`, and Specification `specVersion: 0.1.0` are unchanged. The only JSON changes are Metadata title and `metadata` version `1.0.0` in `uses`. | The supported-title mutation test preserves existing unknown declarations and adds only the authored Metadata declaration. | Saved-Workspace bytes and an independent same-session trace were not captured. |

File inspection, current Validator re-evaluation, Source Audit, and tests are
distinct from the Human Browser observations. The prior focused rerun passed
9/9 ParameterPlotter declaration tests and 23/23 Validator Specification and
Extension tests. This evidence does not establish every unknown Extension form,
browser/profile, hosting environment, or operation interleaving.

The original single G3 procedure required title editing and JSON Export on the
invalid G3-A fixture. That conflicts with the adopted error-invalid read-only
and Export refusal contract. **Acceptance candidate, pending Human decision:**
replace that procedure with G3-A (invalid/read-only safety), G3-B (valid unknown
payload without Specification), and G3-C (valid declared unknown payload), with
the bounded evidence above. The candidate supports G3-A+B+C as the proposed
scope; it does not mark any case formally accepted or close G3. Human must
approve both the procedure replacement and G3 Formal Closure. No new Product,
Cross-App Safety, or Public Release Acceptance follows from this proposal;
ParameterPlotter Public Release remains NO-GO.

## G3 formal Human decision — 2026-10-17

Human formally approved replacing the original single G3 procedure with three
cases: G3-A (invalid Dataset / diagnostic read-only safety), G3-B (valid unknown
Extension without Specification), and G3-C (valid declared unknown Extension).
Human also approved **G3: HUMAN ACCEPTED / CLOSED (BOUNDED)** based on the Human
Browser reports, submitted JSON comparison, Validator re-evaluation, Source
Audit, automated tests, and the explicit limits in the evidence matrix above.
The preceding Acceptance Candidate paragraph is retained as the historical
pre-decision proposal; its pending language no longer describes current G3 status.

G3-A accepts the observed diagnostics and disabled title editing on the invalid
Dataset. Export prohibition rests on Source Audit, not a Human Export refusal
operation. G3-B accepts the Human-observed title change, Reload restoration and
editable state, alongside file-confirmed unknown payload preservation and no
invented Specification declaration. G3-C accepts the Human-observed warnings,
title change, saved indication, Reload restoration, editable state and subsequent
Export, alongside file-confirmed preservation of the unknown payload, existing
declaration/version and `specVersion`, with only Metadata title and its exact
`uses` entry added.

There is no byte-level record of the saved Workspace or independent same-session
operation log. This is not a check of every unknown Extension form, browser,
environment, or operation order. No unobserved action is promoted to Human
Browser PASS. Generated Extension Declaration Integrity as a whole remains
separately pending Human Acceptance. This G3 closure does not change G1/G2 or
other independent review states, Single Active Editor's bounded closure,
Cross-Context Workspace Safety, or ParameterPlotter Public Release NO-GO.

## Generated Extension Declaration Integrity formal Human decision — 2026-10-17

The preceding G3-only status and the original 2026-10-14 review instructions
are historical checkpoints. Human approved using the earlier bounded G1/G2
Human Browser PASS reports as acceptance evidence, the later isolated Codex
browser verification as supplementary evidence, and the existing G3-A/B/C
formal bounded closure. Human did not require a repeat download-completion test.
The individual G1/G2 Human review source hashes and stepwise operation logs were
not reported; their PASS is limited to the reported browser review, not to each
later Codex-observed internal detail.

| Original acceptance area | Case and evidence | Boundary |
| --- | --- | --- |
| Explicit New Dataset Specification bootstrap; generated Metadata title declaration, removal and reapplication; Workspace save, Reload and Export consistency | **G1:** earlier Human Browser PASS (bounded). At ParameterPlotter HEAD `d02c9a057c7976cb82dae298befb9c6f5344cbb3` plus the then-existing uncommitted worktree, Codex used a fresh isolated Chrome profile at a uniquely identified localhost URL. UI operations directly showed Specification `0.1.0` / `uses: []` in saved Workspace after New Dataset; title application added Metadata and its `1.0.0` `uses` entry; removal cleared both; reapplication restored both. Saved Workspace and Reload restoration were inspected. The generation/title/Export model and isolated DOM checks above supply automated evidence for Export parity. | The Codex browser saw an Export request, but its download was canceled; no completed G1 download or downloaded JSON was confirmed in that run. Codex browser inspection is not Human Browser PASS. |
| Generated and edited Dimension Assessment declaration; Workspace save, Reload and Export consistency | **G2:** earlier Human Browser PASS (bounded). In the same isolated Codex browser Dataset, UI creation and editing produced a Dimension Assessment `0.2.0` payload and matching exact `uses` entry in saved Workspace; Reload retained the edited payload and declarations. The actual Export Blob JSON captured in that test tab matched the saved Workspace Dataset. The focused automated tests also cover Assessment editing, deletion and supported legacy upgrade boundaries. | The captured Blob is Export payload evidence, not proof that the browser completed a download. Previous `G2-test` JSON files provide separate file evidence; they have no independent same-session trace tying them to the later Codex run. |
| Unknown or unsupported external Extension safety; truthful declarations and visible diagnostics | **G3-A/B/C:** [separately approved bounded G3 closure](#g3-formal-human-decision--2026-10-17), with Human Browser reports, submitted JSON comparisons, Validator re-evaluation, Source Audit and automated tests distinguished in the matrix above. | G3-A Human Export refusal was not directly operated; saved-Workspace bytes and independent same-session logs were not captured. Untested unknown forms and environments are outside the evidence. |

These three areas exhaust the original ParameterPlotter acceptance review for
generated Extension declarations: app-owned Specification bootstrap, Metadata
and Dimension Assessment generation/editing lifecycle, persistence/Export
consistency, and conservative external-data/diagnostic handling. The adopted
[common application-quality Decision](../../ai-knowledge/decisions/generated-extension-declaration-integrity.md)
and the tests cover additional object occurrences and unsupported versions as
source/automated evidence; those cases are not newly labeled Human Browser PASS.
No unresolved *required* condition remains within this bounded review.

Under Human's conditional approval, **ParameterPlotter Generated Extension
Declaration Integrity: HUMAN ACCEPTED / CLOSED (BOUNDED)**. This is a
ParameterPlotter feature acceptance, not acceptance of every possible
Extension combination or another application's implementation. Specification
remains optional under E2R; no Core/Extension rule, saved-Workspace migration,
or automatic repair of external data follows. The 2026-10-12 Export-only
acceptance retains its original meaning. Single Active Editor remains HUMAN
ACCEPTED / CLOSED (BOUNDED); Home/common UI and Workspace Notification UI
overall remain pending, Tab C UNRESOLVED, LiaisonScape Diagnostics D2 OPEN,
Cross-Context Workspace Safety PENDING, ParameterPlotter Product Acceptance
PENDING, and ParameterPlotter Public Release NO-GO.
