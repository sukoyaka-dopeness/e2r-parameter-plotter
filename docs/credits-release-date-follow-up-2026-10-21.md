# Credits release dates — local implementation and limited review preparation

Date: 2026-10-21

Status: **HUMAN ACCEPTED / CLOSED (BOUNDED) for the local Credits change / NOT DEPLOYED**. The earlier implementation checkpoint had **HUMAN BROWSER REVIEW PENDING**; the subsequent 2026-10-21 Human decision is recorded below.

## Source and date meaning

ParameterPlotter Credits now presents `Application: ParameterPlotter 0.1.0`, Creator, `First release`, `Updated`, the existing acknowledgement, repository links and Close action in that order. The labels are translated for EN/JA; the ISO date values are shared. The date fields are static release metadata, not browser access dates.

| Field | Local display | Basis and publication rule |
| --- | --- | --- |
| First release | `2026-10-21` | The initial Pages deployment succeeded on 2026-10-21 JST. This historical date stays fixed for later releases. |
| Updated | `2026-10-21` | The last confirmed public deployment date at this local checkpoint. **This does not assert that this undeployed change has shipped.** Before publishing the follow-up, compare the planned JST deployment date with this value. If it differs, update the source value, repeat focused checks, and review the resulting commit before push. Confirm the actual date after deployment. |

The [first Public Release closure](../../e2r-spec/docs/parameterplotter/parameterplotter-0.1.0-first-public-release-closure-proposal-2026-10-21.md) remains attached to published SHA `1511a2f9e4ef60b2c4c059e8076689e713202d18`, which did not display either date. This local change is a later, unpublished follow-up. It does not revise the M2-O Credits Human acceptance or assert a new Human Browser result.

## Change and verification boundary

- `application-shell.js` adds the two metadata rows. `ui-localize.js` translates only their labels, so a future `Updated` date change has a single source value. No Credits event handling, CSS, link destination, hit area, or Dataset behavior changes.
- Focused Home/locale tests: **41/41 PASS**. Full syntax and tests: **42 modules and 239/239 PASS**. Production build: **64 static Pages files PASS**. `git diff --check`: **PASS**.
- Codex isolated headless Edge, dedicated temporary profile, local `http://127.0.0.1:4197/`: Credits showed both dates in English and Japanese. At 360px viewport width, the dialog fit without horizontal overflow and both date lines were visible. The repository anchors occupied only their text width. Opening Credits focused Close; Tab reached the first repository link; Escape closed Credits and returned focus to its trigger. No runtime exception was observed in this bounded run. The Edge run did not test every viewport, all keyboard sequences, pointer dismissal, deployment, or Human perception.

## Limited Human Browser Review and publication gate

Using this local candidate in an isolated or disposable browser Workspace, open Credits in EN and JA. Confirm the two dates and label translations, Creator, acknowledgement and both repository links at normal and narrow widths. Check that the links remain clickable over their text only, then use Tab/Shift+Tab and Close/Escape to check focus and dismissal. These are the newly affected presentation and adjacent accepted interactions; the earlier M2-O review is not reopened wholesale.

At the local implementation checkpoint, Human review was pending. Its later bounded result is recorded below. The exact commit to publish, the `Updated` date for its deployment, and the push remain separate decisions. Before any main push, compare the expected JST deployment date with `Updated: 2026-10-21`; if publication is planned for another date, correct the value and obtain review of the new source. Verify the actual date after deployment; a changed date requires a separately reviewed correction. A push would trigger Pages deployment. This document does not authorize push, deployment, or an amendment to the earlier Public Release closure.

## Formal Human decision — 2026-10-21

Human accepted the Credits release-date change at local implementation commit `9dc49c53615703cf7b6d527fde07c36ffaa3a4bf`: **HUMAN ACCEPTED / CLOSED (BOUNDED)**. This is a Human Browser result, separate from the Codex isolated Edge and automated evidence above.

Human confirmed EN/JA Credits, `First release / 初回リリース: 2026-10-21`, `Updated / 更新日: 2026-10-21`, and Application Version `0.1.0`. At 500px and 360px widths, the displayed layout passed visual review. Both repository links were clickable over their text only. Tab/Shift+Tab focus movement, Close/Escape/backdrop dismissal, and focus restoration after dismissal all passed.

This acceptance covers the added dates and their adjacent Credits display and interactions only. It does not extend the earlier M2-O acceptance, alter the first Public Release closure at `1511a2f9e4ef60b2c4c059e8076689e713202d18`, or accept untested environments. The date change is still local: GitHub `main` and Pages have not received this follow-up. Human approval of the exact publication candidate, `Updated` date, and normal `main` push with automatic Pages deployment remains pending.
