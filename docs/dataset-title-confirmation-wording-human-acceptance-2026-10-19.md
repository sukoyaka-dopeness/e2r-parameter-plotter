# Dataset Title Confirmation Wording — Formal Human Acceptance

Decision date: 2026-10-19

Status: **HUMAN ACCEPTED / CLOSED (BOUNDED)**

## Decision and reviewed source

Human formally accepted ParameterPlotter's `Apply title` / 「タイトルを適用」
confirmation control and the surrounding basic visual and interaction behavior
on 2026-10-19. The guest-browser review used a disposable test Dataset on the
Codex-prepared local server at `http://127.0.0.1:5502/`. Human reported
ParameterPlotter HEAD `e20de35f8b666b881bb52d363abfd7b5ea8fef0f` as the
reviewed revision. The repository was clean at that HEAD during the preceding
preparation and immediately before this documentation edit. No independent capture
of the exact browser-served bytes or test Dataset was retained.

The browser review occurred after the earlier Codex preparation. Its exact
calendar date was not separately reported; **2026-10-19 is the formal Human
approval date**, not an inferred browser-execution date. The earlier integrated
implementation checkpoint `9c4dcbd` remains historical provenance; the Human
reported the later `e20de35` HEAD for this review.

## Human Browser Evidence

| Reviewed condition | Human-reported result |
| --- | --- |
| English, normal width | `Apply title` was visible; Human entered, applied and saw a title reflected. |
| English, 390 CSS px | Human reviewed the wording and layout. |
| Japanese, normal width | 「タイトルを適用」 was visible. |
| Japanese, 390 CSS px | Human reviewed the wording and layout. |
| Japanese title operation | Human entered, applied and saw a Japanese title reflected. |
| Control relationship and keyboard | Human found the input/button relationship and readability acceptable, with no reported overlap or horizontal overflow; Tab moved focus and Enter applied the title. |
| Feedback and idle state | Human saw a success notice after applying and a disabled Apply button when no unapplied title change remained. |

Human submitted screenshots and reported the review **OK**. The visual
observations above are Human-reported; screenshot files, hashes and individual
image-to-case mappings were not supplied for independent inspection in this
documentation pass. Title application, Tab movement and Enter activation are
Human-reported browser operations, not facts established by static images.
The notice observation is supporting evidence for this title flow only.

## Supporting evidence and its limits

- **Computer Use:** The earlier Codex attempt stopped before page inspection or
  interaction because it could not identify the Windows browser URL with enough
  confidence to enforce its safety policy. It supplies no Codex Browser PASS.
- **Source Audit:** [`main.js`](../main.js) renders the Dataset title input and
  `Apply title` submit button in one form, disables the button when the draft
  equals the current title, and routes submission through the existing title
  mutation path. [`ui-localize.js`](../ui-localize.js) maps the button label to
  「タイトルを適用」. This audit does not establish visual quality or native keyboard
  behavior.
- **Automated Test Verified:** Existing
  [`interaction-wiring.test.mjs`](../interaction-wiring.test.mjs),
  [`ui-localize.test.mjs`](../ui-localize.test.mjs) and
  [`dataset-title.test.mjs`](../dataset-title.test.mjs) cover the label,
  localization, existing submit path and title mutation properties. Their
  results do not replace Human visual or interaction evidence.
- **Earlier Human Evidence:** Earlier bounded title-editing observations retain
  their original scope. The 2026-10-18
  [Home/common UI closure](home-common-ui-human-acceptance-closure-2026-10-18.md)
  explicitly left this wording gate independent; this later decision closes
  that gate without changing the Home decision.

## Acceptance boundary

This closure covers only ParameterPlotter's reviewed EN/JA title confirmation
wording, normal-width and 390 CSS px presentation, input/control relationship,
basic title application, Tab/Enter operation, and observed success/idle states.
It does not adopt a new Cross-App UI standard or reaccept NarrativeLine or
LiaisonScape. It does not accept Dataset title persistence safety, Dataset
Replacement Safety, Workspace Notification UI as a whole, every browser,
viewport, fault condition or assistive technology. No Runtime, Dataset,
Core/Extension, Validator or existing product contract changes follow from this
decision.

Single Active Editor, Generated Extension Declaration Integrity and Home/common
UI / Focus Restoration retain their separate **HUMAN ACCEPTED / CLOSED
(BOUNDED)** decisions. At this Phase 2A decision, Workspace Notification UI
remained overall **PENDING** despite its N2 bounded PASS and this title-flow
notice observation; its later independent [Phase 2B bounded Human closure](workspace-notification-ui-verification-2026-10-14.md#workspace-notification-ui-formal-human-acceptance--2026-10-19)
does not expand this Phase 2A acceptance. Tab C remains
**UNRESOLVED**; LiaisonScape Diagnostics D2 remains **OPEN**; Cross-Context
Workspace Safety and ParameterPlotter Product Acceptance remain **PENDING**.
ParameterPlotter Public Release remains **NO-GO**. The
[E2R-SPEC Roadmap](../../e2r-spec/docs/roadmap.md) is the current planning
authority for these independent states.
