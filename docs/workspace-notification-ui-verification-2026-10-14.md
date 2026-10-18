# Workspace notification UI revision

Current status: HUMAN ACCEPTED / CLOSED (BOUNDED) — Human decision 2026-10-19.

The implementation and N2 sections below retain their pre-closure evidence and
status language. The [formal Human decision](#workspace-notification-ui-formal-human-acceptance--2026-10-19)
records the current bounded acceptance.

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

## Workspace Notification UI formal Human acceptance — 2026-10-19

**Decision: HUMAN ACCEPTED / CLOSED (BOUNDED).** Human formally accepted the
reviewed ParameterPlotter Workspace Notification UI on 2026-10-19. The Human
Browser Review used a guest browser, a disposable test Dataset, and
`http://127.0.0.1:5503/`. The reported source was ParameterPlotter `main` at
`66bad162ea7b632a791b787654a081524ee1fb7b`, with a clean working tree.
The Browser operation date was not separately reported; the formal decision
date must not be treated as a measured operation timestamp.

### Human Browser evidence and decision

- Human reported applying the title `Phase2B Applied` and observing `Title
  applied.`, `Changes not exported`, and `Saved locally` as distinct results.
  On entering `Phase2B Draft`, the earlier success result cleared and an
  unapplied-draft warning appeared. Human observed that the draft was separate
  from the saved Dataset, survived Home → Continue Editing, and remained
  distinguishable from the applied title. Human then restored the draft to the
  applied title and reviewed the resulting status. Human judged these notices
  and status labels clear enough without a correction. The previously raised
  possibility of a stale success result coexisting with a new draft was not
  reproduced in this Browser sequence.
- Human reported an Export information notice in EN/JA at ordinary width and
  390 CSS px, including locale changes while it remained visible. The notice
  described a browser download request, did not claim completion, and
  separated E2R JSON Export from browser-local Workspace saving. Human reported
  readable wrapping without overlap or horizontal overflow.
- Human reported submitting screenshots and an exported E2R JSON, and reported
  that `extensions.metadata.title` in that file was `Phase2B Applied`. Those
  submitted artifacts are not available as files in this repository or the
  present Codex filesystem evidence. Their contents and screenshot-visible
  details are recorded as Human-reported evidence, not as an independent Codex
  image or JSON inspection. Home navigation observations likewise derive from
  Human's operation report, not from a screenshot alone.
- The earlier N1 bounded Human report after the locale regression correction
  remains distinct from this review. The recorded [N2 bounded Human Browser
  PASS](#n2-human-browser-evidence--recorded-2026-10-17) supplies the targeted
  `QuotaExceededError` refusal, saved-copy protection, Home warning and
  recovery evidence. N2 injection was not repeated for this decision. The
  separately accepted [Phase 2A title wording](dataset-title-confirmation-wording-human-acceptance-2026-10-19.md)
  remains an independent bounded closure; its title-success observation does
  not by itself accept all notification behavior.

### Supplementary evidence and limits

- Codex used an isolated, disposable Edge profile and a dedicated localhost
  server to inspect title success, saved/Export baseline status, a new draft,
  Home/Continue, Export guidance, locale changes and 390 CSS px rendering.
  Codex directly read only its test profile's saved Workspace title: a new
  unapplied draft did not replace the saved title. Normal-width and 390px
  screenshots showed wrapping without observed overlap or horizontal
  overflow. In that isolated run, the dedicated download directory did not
  contain a completed file; the app's notice correctly claimed only a
  request. These are Codex Browser/CDP observations, not Human Browser PASS.
- Codex Computer Use did not operate a browser: no safely identifiable
  isolated Computer Use tab was available. Its result must not be counted as
  Browser verification. At the reviewed source, the reported automated gate
  was 42 modules and 238/238 tests PASS; real-module DOM integration reported
  12 scenarios PASS. These establish only their test assertions. Source Audit
  distinguishes short Dataset-operation feedback, persistent save/Export
  status, full Export guidance and degraded-save warnings; it is not a Human
  visual or assistive-technology check.
- This closure covers the reviewed N1 Export meaning and EN/JA follow-through,
  observed notice update/clearing, title success and unapplied-draft feedback,
  browser-save versus Export state, Home roundtrip, ordinary and 390px views,
  and the existing N2 targeted refusal/recovery evidence. It does not accept
  every save-refusal cause or real disk exhaustion, every browser or width,
  exhaustive screen-reader behavior, guaranteed completion of every download,
  Dataset Replacement Safety or Cross-Context Workspace Safety as a whole,
  Tab C, Product Acceptance, or Public Release.

Single Active Editor, Generated Extension Declaration Integrity, Home/common
UI/Focus Restoration and Phase 2A title wording retain their separate bounded
closures. Tab C remains UNRESOLVED; LiaisonScape Diagnostics D2 remains OPEN;
Cross-Context Workspace Safety and ParameterPlotter Product Acceptance remain
PENDING. ParameterPlotter Public Release remains NO-GO.
