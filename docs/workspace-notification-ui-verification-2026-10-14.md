# Workspace notification UI revision

Status: IMPLEMENTED / AUTOMATED PASS / HUMAN BROWSER ACCEPTANCE PENDING

## Roles and scope

The existing Dataset/browser Workspace status line carries persistent saved,
saving, degraded and Export-baseline state. Normal saves no longer duplicate
that state in a large success panel. Known successful Dataset operations use
a short EN/JA result (for example, `Title applied.` / `タイトルを適用しました。`).
This result does not assert that saving succeeded or a file was exported.
It follows the existing operation-feedback lifetime, without a new timer.

A small, single result line is always present in the Workspace status area;
normal success/empty-result updates do not insert or remove a block. Full
recovery warnings and diagnostics retain wrapping and their own space. This
does not promise fixed geometry when a real warning or diagnostic changes.

Degraded persistence retains full refusal/recovery details and uses an alert.
Unrecognized operation failures are alerts, rather than presumed successes.
Export download-request/confirmation instructions remain full informative
notices. Pending drafts and Validator diagnostics remain visible as before.
Browser saving, title application, download requests, Export baseline changes,
write gate, ownership and replacement behavior are unchanged.

## Evidence and limits

- `npm run check`: 228 tests PASS; 41 application modules checked.
- Real-module DOM integration: 11 scenarios PASS, extended to verify normal
  title save with compact feedback, unchanged Validator findings, full degraded
  alert, saved Workspace protection, Return/Export and blocked non-owner paths.
- Presentation tests distinguish saving success, Dataset-operation success,
  refusal, unknown errors and download instructions in EN/JA.
- These are automated tests, not real-browser layout or screen-reader evidence.

Human should review normal title application, saved/saving status, JA/EN and
narrow layouts, keyboard focus, screen-reader announcements, and safe refusal
recovery. Check that normal success updates do not move controls. No existing
Human browser/profile/server was operated during this work.

The Human-reported `extension_version_unspecified` at `/extensions/metadata`
remains a separate unresolved issue. This change neither hides diagnostics nor
changes Metadata declaration/Validator semantics.

Single Active Editor acceptance remains PENDING. Existing bounded acceptances,
Tab C UNRESOLVED, Diagnostics D2 OPEN and PUBLIC RELEASE NO-GO remain unchanged.
