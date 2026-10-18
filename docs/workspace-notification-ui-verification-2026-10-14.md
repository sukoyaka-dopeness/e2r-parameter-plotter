# Workspace notification UI revision

Status: IMPLEMENTED / AUTOMATED PASS / N2 HUMAN BROWSER PASS (BOUNDED) / OVERALL HUMAN BROWSER ACCEPTANCE PENDING

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

## N2 Human Browser evidence — recorded 2026-10-17

Human reported **N2: PASS (BOUNDED)** for Workspace save refusal and recovery.
The individual review source hash and run date were not reported. This is Human
Browser evidence, not a Codex Browser or automated test result.

- Reload restored the saved title `N2 saved baseline` before the refusal test.
- A limited test injection rejected only Workspace localStorage writes with
  `QuotaExceededError`. Applying `N2 refused edit` produced a save-failure
  warning and safety stop. The write refusal occurred and the saved Workspace
  remained unchanged.
- After navigation to Home, the safety-stop warning remained visible.
- Human removed the injection and reloaded. The saved title `N2 saved baseline`
  returned. Normal saving then recovered: applying `N2 recovery saved`
  succeeded, and a further reload restored `N2 recovery saved`.

This PASS covers the reported targeted refusal, unchanged saved copy, Home
warning, reload to the prior saved baseline, and subsequent save/reload recovery.
It is not evidence of actual disk exhaustion, other refusal causes, JSON Export
completion, every browser/profile, or all notification states. N2 does not
close Workspace Notification UI acceptance as a whole. The earlier Single
Active Editor PENDING statement above records this document's pre-closure
snapshot; its separate formal decision is [HUMAN ACCEPTED / CLOSED (BOUNDED)](../../e2r-spec/docs/parameterplotter/parameterplotter-single-active-editor-final-acceptance-decision-packet-2026-10-17.md).
Other Human review items retain their independently reported states, and
ParameterPlotter Public Release remains NO-GO.
