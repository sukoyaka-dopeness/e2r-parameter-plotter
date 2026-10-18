# Home / Common UI and Focus Restoration — Formal Human Acceptance

Date: 2026-10-18

Status: **HUMAN ACCEPTED / CLOSED (BOUNDED)**

## Human decision and reviewed source

Human formally accepted the bounded ParameterPlotter Home/common UI and Focus
Restoration review on 2026-10-18. The Human review used the then-current,
**uncommitted working tree** served at `http://127.0.0.1:5492`. Its reported Git
HEAD was `d02c9a057c7976cb82dae298befb9c6f5344cbb3`; that commit alone does
not identify the reviewed source because the working tree included local
changes, including the [Workspace brand-focus correction](workspace-brand-initial-focus-correction-2026-10-18.md).
No immutable hash of the complete reviewed working tree was recorded.

This decision closes the Home/common UI Human visual gate within the observations
below. It does not reopen or expand [Single Active Editor acceptance](../../e2r-spec/docs/parameterplotter/parameterplotter-single-active-editor-final-acceptance-decision-packet-2026-10-17.md)
or the [Cross-App Header / Brand / Focus Navigation decision](../../e2r-spec/docs/cross-app/cross-app-header-brand-focus-navigation-decision-2026-10-18.md).

## Accepted Human Browser Evidence

| Area | Human-reported observation and operation | Boundary |
| --- | --- | --- |
| Owner Home | In EN and JA, at normal width and 390px, Human reviewed the Header, Footer and Home action hierarchy; the Footer read `E2R Dimension Editor` / `E2R 評価軸エディター`. Human saw no empty warning gap, overlap or horizontal overflow, and operated the Home–Workspace round trip. | These are the reported widths, locales and states, not an exhaustive responsive or browser matrix. |
| Workspace brand focus | After Workspace arrival, the brand **link** had initial focus. Enter without a preceding Tab returned Home; one Tab after a new arrival reached the Header Home button. Human did not see a second brand focus stop. Human repeated the relevant behavior in EN/JA and at 390px. | This confirms the corrected interaction observed in the Human browser; it does not change other applications' initial-focus choices. |
| Non-owner common UI | In a second tab of the same isolated browser profile, Human reviewed the non-owner guidance screen, Header, Footer and Credits in EN/JA at normal width and 390px. Credits opened by keyboard; Tab traversal within the dialog, Escape dismissal and focus return worked. No editing, Dataset acquisition or ownership-takeover control was shown. Human saw no overlap or horizontal overflow. | This is the reviewed non-owner presentation and interaction, not every ownership race or failure sequence. |
| Earlier bounded observations | The prior SAE-04 Human Browser PASS and Human observation of Home recovery warning behavior remain evidence in their recorded scope. The later brand-focus mismatch and its correction are separate, subsequent evidence. | Earlier PASS is neither revoked nor enlarged. The recovery-warning observation does not mean every warning, save-refusal or fault state was newly exercised on 2026-10-18. |

The visual statements above are Human-reported observations. Human also reported
screenshots of the focus states, but no screenshot artifact was available for
independent inspection in this documentation pass. Static screenshots alone
would not establish the Enter, Tab, Escape, navigation, or restored-focus
operations; those are Human-reported browser actions.

## Supporting evidence and limits

- **Codex Browser Verified:** The isolated Chrome check in the
  [focus correction record](workspace-brand-initial-focus-correction-2026-10-18.md)
  confirmed actionable link focus, Enter navigation, first-Tab order, pointer
  navigation and bounded EN/JA and 390px behavior in a disposable Workspace.
  This is supplementary to the Human review.
- **Automated Test / DOM Verified:** The same record reports `npm.cmd run check`
  passing 42 module syntax checks and 238/238 tests, plus 12 real-module DOM
  scenarios for focus entry and Home restoration. DOM tests do not prove native
  keyboard behavior or visual acceptance.
- **Source / DOM Audit:** The [Single Active Editor implementation record](single-active-editor-implementation-2026-10-14.md)
  and focused Home tests cover warning placement and disabled controls, common
  non-owner shell and Credits, and related ownership guards. These do not turn
  untested warning/failure states into Human Browser PASS.
- **Historical Human Browser Evidence:** SAE-04 and the Home recovery-warning
  observations retain their original bounded meaning in the Single Active
  Editor evidence and acceptance record. Earlier Human visual FAIL or
  pre-correction observations remain historical, rather than current failure
  claims about the corrected working tree.

The closure does not claim exhaustive coverage of browsers, viewport widths,
failure states, screen readers or assistive technology. It does not establish
that every warning or save-refusal path was newly reviewed by Human. The
uncommitted reviewed source can only be identified by HEAD plus its local
working-tree state, not by HEAD alone.

## Independent states

- Single Active Editor and Generated Extension Declaration Integrity remain
  **HUMAN ACCEPTED / CLOSED (BOUNDED)** in their own scopes.
- Cross-App Dataset title confirmation wording retains its independent Human
  Visual Acceptance state. Its wording is not closed by the Home/common UI
  decision.
- Workspace Notification UI retains N2 Human Browser PASS (bounded), with
  overall Human Acceptance **PENDING**.
- Tab C remains **UNRESOLVED**; LiaisonScape Diagnostics D2 remains **OPEN**;
  Cross-Context Workspace Safety remains **PENDING**.
- ParameterPlotter Product Acceptance remains **PENDING** and Public Release
  remains **NO-GO**.

The [E2R-SPEC Roadmap](../../e2r-spec/docs/roadmap.md) is the current planning
authority for these independent gates.
