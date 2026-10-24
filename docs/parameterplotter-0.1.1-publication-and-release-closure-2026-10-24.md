# ParameterPlotter 0.1.1 — publication acceptance and release closure

Date: 2026-10-24 JST

Status: **PUBLICATION ACCEPTED — BOUNDED / MAINTENANCE RELEASE CLOSED (BOUNDED)**. Human made this final publication decision on 2026-10-24 JST. It is separate from the [2026-10-23 local Maintenance Candidate acceptance](home-guide-funding-maintenance-human-review-checkpoint-2026-10-23.md) and the earlier [M2-W Credits closure](credits-release-date-follow-up-2026-10-21.md).

## Published release and technical evidence

- Application: ParameterPlotter `0.1.1`; [public application](https://sukoyaka-dopeness.github.io/e2r-parameter-plotter/).
- Published source and GitHub `main`: [`cf73db3bf5d66860ee37bb4cfaa3e88f81342d94`](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter/commit/cf73db3bf5d66860ee37bb4cfaa3e88f81342d94). The authorized normal push contained the seven existing commits after `e058a5b0e32febe916c825868405c4bd87567913` through this SHA; the separately accepted M2-W Documentation was included without revising its closure.
- The [Check run](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter/actions/runs/40039483345) and [Pages run](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter/actions/runs/40039483329) completed successfully for that SHA. Pages Build, artifact upload, and Deployment succeeded. The Deploy step completed at **2026-10-24 08:24:50 JST**.
- Codex's technical post-deployment check received HTTP 200 from the public URL. The delivered main JavaScript, Home JavaScript/CSS, Localization and replacement-safety modules, and EN/JA Ashen Crown Sample files matched the release build byte for byte. The published EN/JA Guide Markdown on GitHub `main` matched the updated local files. The `index.html` comparison differed only in its final newline; no content difference was found.
- Release metadata: Application Version `0.1.1`; Credits `First release: 2026-10-21` and `Updated: 2026-10-24`. The `Updated` value matches the actual JST deployment date. These source, workflow, and HTTP results are **Codex technical evidence**, not a Codex-operated public browser test.

## Human-reported public browser evidence

After publication, Human reported opening the public URL in a real browser and observing the following. This is **Human-reported, bounded browser evidence**; Codex did not perform a new Browser Use run for these observations.

| Surface | Reported result |
| --- | --- |
| Home and Credits | EN/JA initial Home and Credits displays passed. The browser showed Version `0.1.1`, First release `2026-10-21`, Updated `2026-10-24`, and the Home Sample information, User Guide, and funding links. Human reported the link destinations as OK, without individual new-tab behavior evidence. |
| Sample and Profile | Japanese Ashen Crown Sample launch passed. The Dataset title was `灰冠の王国`; the displayed counts were 10 Entities, 7 Dimensions, and 70 Assessments. Initial Profile display passed. |
| Radar | A graph rendered after selecting three Dimensions. |
| Quadrant | Ten Entities were plotted after setting X and Y Dimensions. |
| Matrix | Entity rows, Dimension columns, and recorded values displayed. Human also checked explicit zero and display of Dimensions 1–6 of seven. Cell editing and rearrangement were not tested by this report. |
| Console | In the Console view Human presented, no red major runtime error was observed. A blue counter showed `88`; its messages were not inspected. This does not establish a clean full Console log. |

The earlier [local Maintenance Candidate acceptance](home-guide-funding-maintenance-human-review-checkpoint-2026-10-23.md) includes its own EN/JA Home visual, keyboard, Sample, Workspace-protection, replacement-dialog, and Guide review evidence. Automated tests and build, published-asset comparison, local Human review, and this public Human review remain distinct evidence classes.

## Formal Human decision and limits

On 2026-10-24 JST, Human reviewed the publication result and the reported public browser evidence above and formally decided **PUBLICATION ACCEPTED — BOUNDED**. ParameterPlotter `0.1.1` Maintenance Release is **CLOSED within this recorded scope**. This decision does not retroactively enlarge the 2026-10-23 local Candidate acceptance or the M2-W Credits closure.

The decision does not establish PASS for all Handoff screens, all browsers or viewports, all storage-failure or Cross-Context Workspace Safety paths, every published Dataset replacement operation, Radar/Quadrant drag editing, Matrix cell editing or rearrangement, individual external-link new-tab behavior, or the uninspected Console messages. Browser-local Workspace saving and portable E2R JSON Export remain different operations. Dimension Assessment `0.2.0` remains a **non-Stable Specification Candidate**.

Human deferred visual and structural cross-app unification of Dataset replacement and unsaved-work confirmation dialogs across NarrativeLine, LiaisonScape, and ParameterPlotter to an independent post-release UX task. This closure does not change that decision. Other untested paths remain follow-up candidates only; they have not been converted into failures or passes by this release decision.

This record documents the Human decision and its evidence. Its Documentation revision is distinct from the published application source SHA above; synchronization to GitHub requires a separately authorized Push.
