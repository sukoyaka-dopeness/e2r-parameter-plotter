# Credits release dates — local acceptance and public deployment closure

Date: 2026-10-21

Status: **M2-U LOCAL HUMAN ACCEPTED / CLOSED (BOUNDED); M2-W PUBLISHED / DEPLOYMENT SUCCEEDED / POST-DEPLOYMENT VERIFICATION PASS (BOUNDED) / HUMAN ACCEPTED / CLOSED (BOUNDED)**. The sections before the M2-W checkpoint preserve the earlier local and pre-publication states.

## Source and date meaning

ParameterPlotter Credits now presents `Application: ParameterPlotter 0.1.0`, Creator, `First release`, `Updated`, the existing acknowledgement, repository links and Close action in that order. The labels are translated for EN/JA; the ISO date values are shared. The date fields are static release metadata, not browser access dates.

| Field | Local display | Basis and publication rule |
| --- | --- | --- |
| First release | `2026-10-21` | The initial Pages deployment succeeded on 2026-10-21 JST. This historical date stays fixed for later releases. |
| Updated | `2026-10-21` | The last confirmed public deployment date at this local checkpoint. **This does not assert that this undeployed change has shipped.** Before publishing the follow-up, compare the planned JST deployment date with this value. If it differs, update the source value, repeat focused checks, and review the resulting commit before push. Confirm the actual date after deployment. |

The first Public Release closure (E2R-SPEC local record: `docs/parameterplotter/parameterplotter-0.1.0-first-public-release-closure-proposal-2026-10-21.md`) remains attached to published SHA `1511a2f9e4ef60b2c4c059e8076689e713202d18`, which did not display either date. This local change is a later, unpublished follow-up. It does not revise the M2-O Credits Human acceptance or assert a new Human Browser result.

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

## M2-W public deployment and formal Human closure — 2026-10-21

Human authorized the exact Credits follow-up SHA `e058a5b0e32febe916c825868405c4bd87567913`, its three commits/five files after first-release SHA `1511a2f9e4ef60b2c4c059e8076689e713202d18`, `Updated: 2026-10-21` for a same-JST-day deployment, and the normal fast-forward push with automatic Check and Pages deployment. The push completed and GitHub `main` matched `e058a5b0e32febe916c825868405c4bd87567913`. This is a **post-release Credits update**; the first Public Release at `1511a2f9e4ef60b2c4c059e8076689e713202d18` retains its own formal closure.

| Evidence class | M2-W result and boundary |
| --- | --- |
| GitHub Actions / Pages | [Check run 39549359749](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter/actions/runs/39549359749) and [Pages run 39549359750](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter/actions/runs/39549359750) both succeeded for the exact public SHA. The Pages Deploy step succeeded at **2026-10-21 14:24:41 JST**. No manual workflow dispatch, settings change, Tag or GitHub Release was part of M2-W. |
| Public source / automated | The [public HTTPS app](https://sukoyaka-dopeness.github.io/e2r-parameter-plotter/) responded. Published `application-shell.js`, `ui-localize.js` and `main.js` were byte-identical to the approved production build. The Check workflow passed its source checks; local pre-publication evidence had 42 syntax-checked modules, 239/239 tests and 64 production build files. |
| Codex Browser, public HTTPS | In an isolated Edge profile, EN/JA Credits displayed Application Version `0.1.0`, `First release / 初回リリース: 2026-10-21`, and `Updated / 更新日: 2026-10-21`. At 360px, the dialog had no horizontal overflow. Both Repository links opened their intended GitHub URLs. Tab/Shift+Tab, Close/Escape/backdrop and focus restoration passed; no unexpected runtime exception or error log was observed in this bounded session. |
| Existing Human Browser evidence | The separate M2-U local Human review above accepted the dates, 500px/360px appearance and related Credits interactions. M2-W added **Codex** public-browser evidence; it did **not** create a new Human Browser PASS. |

The actual Pages deployment and both displayed dates are **2026-10-21 JST**, so `Updated` matches this publication. Human explicitly accepted the GitHub push, successful Pages deployment and bounded Codex Browser post-deployment verification as evidence, and formally decided **M2-W HUMAN ACCEPTED / CLOSED (BOUNDED)**. This decision does not expand Product, M2-O or M2-U acceptance; it does not certify other browsers, all viewport sizes or unrelated Dataset/Workspace paths. Application Version stays `0.1.0`; Dimension Assessment Specification `0.2.0` remains **HUMAN-ADOPTED CANDIDATE / NOT STABLE**. Hub publication and wider Cross-Context Workspace Safety remain separate.
