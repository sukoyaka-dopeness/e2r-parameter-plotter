# Generated Dataset Specification declarations

Status: IMPLEMENTED / AUTOMATED PASS / HUMAN BROWSER ACCEPTANCE PENDING

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
