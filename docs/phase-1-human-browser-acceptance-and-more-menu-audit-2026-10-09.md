# Phase 1 Human Browser Acceptance and Cross-App More Menu Audit

Date: 2026-10-09

## Phase 1 bounded Human Browser Acceptance

**Status: HUMAN BROWSER ACCEPTED / PASS / CLOSED (BOUNDED PHASE 1 KEYBOARD AND VIEW UX)**

Accepted source: `0d21bf4d40909e77a4d4a5632bb978a69ddece9d` (`Stabilize header and quadrant menu focus`). The Human reported that the final two previously outstanding checks were confirmed in a real browser and that the other Phase 1 items were OK. This later disposition closes the matching Pending review items recorded in the implementation checkpoints; it does not rewrite those historical records.

Human Browser PASS covers the reported Phase 1 scope:

- Profile, Radar, Quadrant, and Matrix Header alignment and Entity-name text clipping correction.
- Repeated keyboard activation of Header navigation, retained focus, and no unwanted page scrolling; Matrix page cycling.
- Radar and Quadrant range-proportional keyboard Assessment editing, including independent Quadrant X/Y editing.
- Quadrant keyboard-edit scroll correction and conditional reveal when the edited point moves out of view.
- Quadrant pointer drag editing.
- Quadrant context-menu opening with Shift+F10, improved focus order, and visible focus outline.

The review is based on Human browser reports. It does not claim testing of every browser, every viewport, screen-reader output, every Dataset state, or every application interaction beyond the items above. It does not extend the earlier accepted Drawer UX checkpoint or constitute acceptance of the whole ParameterPlotter product.

### Separate evidence types

The implementation checkpoint for `a926a90726fdab07541626c601f218ddaffbb992` records `npm.cmd run check` passing with 32 application modules and 125/125 tests. The follow-up at `0d21bf4` includes focused regression coverage for Header scroll/focus handling and Quadrant context-menu focus placement; this is automated evidence, distinct from the Human Browser report. Computer Use could not initialize in the implementation checkpoint, so no Codex-operated real-browser PASS is claimed.

## Independent Quadrant keyboard-activation decision

**Status: OPEN / HUMAN DECISION PENDING / NOT IMPLEMENTED**

Quadrant points remain focusable native buttons. Plain arrow keys edit the selected X or Y Assessment; pointer drag edits coordinates; Shift+F10 and right-click open the existing context menu; hover and the accessible name expose the Entity and selected X/Y values. Enter and Space currently have no application-specific action. This operation contract was not part of the Phase 1 closure and remains for Human decision. Do not infer a new activation action, alter the button role or Tab order, or restore the withdrawn all-Dimension Assessment Details popover from this acceptance.

## Cross-App More menu presentation audit

The E2R-SPEC Human-selected direction remains the authority: NarrativeLine's simple text rows are the visual reference for ParameterPlotter, NarrativeLine, and LiaisonScape. The decision concerns typography, spacing, alignment, item treatment, and popup hierarchy; it does not require matching functions or items. Implementation remains OPEN, NOT IMPLEMENTED, and NOT HUMAN-ACCEPTED. This is a source review only; the NarrativeLine and LiaisonScape repositories were not modified. Revisions inspected: ParameterPlotter `0d21bf4d40909e77a4d4a5632bb978a69ddece9d`, NarrativeLine `46e7fd27c4af9270f60521ed212c19269fa3b877`, and LiaisonScape `b93e9762ca2baa7e29d0dac4b99bb27970f4b618`.

| Area | ParameterPlotter (`0d21bf4`) | NarrativeLine (`46e7fd2`) | LiaisonScape (`b93e976`) |
|---|---|---|---|
| Structure and placement | Native `details/summary` disclosure in the Workspace action bar. The panel is right-aligned; the trigger follows Entities and Dimensions. | Custom button and conditional popup at the end of Timeline header actions. Popup is aligned to the trigger's inline end. | Native `details/summary` disclosure in the Dataset action toolbar, after graph actions; right-aligned on wide layouts. |
| Item presentation | Button rows with a 15rem minimum panel, 4px row gap, 0.45rem panel padding, 2.5rem row minimum, and generous row padding. The action-bar override retains the 15rem minimum. | Simple button text rows, compact 2px gap and 4px panel padding; no framed row buttons. This is the adopted visual reference. | Individual rows are ordinary framed buttons in a grid with 6px gaps and 8px panel padding; visually heavier than the reference. |
| Interaction and focus | Native disclosure trigger; panel has `role=group`. Open/Export are buttons. Dataset replacement handling restores focus to the trigger on cancellation. The inspected global Escape handler does not provide a More-specific close path; no custom menu arrow-key handling was found. | Trigger exposes menu state and controls. Popup uses `role=menu`/`menuitem`; opening focuses the first item; ArrowUp/Down, Home/End, Enter/Space, Escape, outside pointer dismissal, and focus restoration are handled. Tab closes without trapping native sequential focus. | Native disclosure with application handling: opening focuses the first enabled button; ArrowUp/Down and Home/End move among items; Tab closes without trapping; Escape closes and returns focus to summary; outside pointer closes. No `menu`/`menuitem` roles were observed. |
| Locale and narrow layout | EN/JA labels are localized. At narrow widths, action controls reflow; the right-aligned panel has a viewport-based maximum width. | EN/JA labels are localized. Popup width is content-sized with a viewport maximum; existing responsive header layout remains. | EN/JA labels are localized. At narrow widths, secondary actions move into this disclosure and viewport controls are included; panel width is bounded by the viewport. |
| App-specific secondary actions | Open E2R Dataset and Export E2R JSON. | Open Dataset, Export, and optional NarrativeLine display controls such as Relative Time and display order. | Open/Export, mobile Save coordinates, coordinate/space migration, Auto Layout, and mobile viewport controls. |

### Shared direction and app-specific responsibilities

The smallest useful shared presentation target is the popup and its action rows: use the NarrativeLine text-row treatment, consistent text size and alignment, compact and consistent row spacing, and a clear popup hierarchy. Keep each app's current secondary actions, locale strings, enable/disable rules, and action order unless an app-specific review shows a separate problem. The More trigger remains an ordinary disclosure control beside each app's primary actions; the menus do not need the same contents.

Interaction mechanisms need not be mechanically identical where native disclosure semantics already serve an app, but each implementation should have predictable keyboard access, visible focus, Escape dismissal where the menu interaction requires it, no accidental focus trap, and appropriate focus behavior after dismissal or action. The current inspection found a stronger explicit menu-keyboard contract in NarrativeLine, while ParameterPlotter relies more heavily on native `details` behavior and LiaisonScape adds its own key handling. This audit does not select a cross-app ARIA role or authorize replacing native disclosures with custom menu widgets.

### Recommended next bounded implementation scope

Use NarrativeLine as the unchanged visual reference, and make a presentation-only pass over ParameterPlotter and LiaisonScape to bring their popup rows and hierarchy closer to that reference. Preserve the existing actions and responsive placement, then test each app's current keyboard, focus, Escape, locale, and narrow-layout behavior. Any change to menu roles, focus policy, action grouping, or cross-app interaction semantics should be brought back for a separate Human decision if the visual-only pass cannot preserve current behavior.

This audit does not implement the More-menu direction or change its OPEN status. It also does not alter any existing accepted checkpoint, Candidate status, or product-wide acceptance state.
