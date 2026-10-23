# Home / User Guides / Funding Links — Human Review and Bounded Maintenance Acceptance

Date: 2026-10-23 JST

Checkpoint: `PP-HOME-MAINTENANCE1-HUMAN-REVIEW-CHECKPOINT1`

Current status: **ACCEPTED — BOUNDED MAINTENANCE CANDIDATE** (Human decision, 2026-10-23 JST). Application Version `0.1.1` and Credits `Updated: 2026-10-24` are approved local release-candidate metadata; Push, Deployment, and Publication remain separate.

The partial-review observations and PENDING statements below are historical checkpoints. The final Human decision and its boundaries are recorded at the end of this document; earlier evidence has not been retroactively changed.

Historical partial-review status: **HUMAN REVIEW IN PROGRESS / LIMITED ITEMS REPORTED / HOME VISUAL ACCEPTANCE PENDING / DESIGN SCOPE DECISION PENDING / NO MAINTENANCE RELEASE ACCEPTANCE**.

## Candidate and authority boundary

This checkpoint concerns the unpublished ParameterPlotter maintenance candidate at local HEAD `8baa6f0ae1301278055ed9607f9d2f3f1256495d`, based on published `origin/main` `e058a5b0e32febe916c825868405c4bd87567913`. Its five unpushed commits contain the already accepted M2-W Closure Documentation (`0a8b5aa70e255b9978cbc49227fcc3da24a0ac22`) and four later Home, EN/JA User Guide, funding-link, and README commits. The [M2-W Human Closure](credits-release-date-follow-up-2026-10-21.md) is unchanged and is not being re-accepted here.

The earlier [Home/common UI Human Acceptance](home-common-ui-human-acceptance-closure-2026-10-18.md) applies to its recorded 2026-10-18 source and review conditions. It does not by itself accept this later Home composition. The E2R-SPEC [Cross-App visual-consistency audit](https://github.com/sukoyaka-dopeness/e2r-spec/blob/860b51141970d2f64087893d787d1dd862f8de0a/docs/cross-app/e2r-cross-app-visual-consistency-audit1-result.md) compared bounded NarrativeLine/LiaisonScape surfaces and did not adopt identical Home layouts for all apps. The [Header / Brand / Focus decision](https://github.com/sukoyaka-dopeness/e2r-spec/blob/860b51141970d2f64087893d787d1dd862f8de0a/docs/cross-app/cross-app-header-brand-focus-navigation-decision-2026-10-18.md) preserves clear focus and native activation without prescribing a common DOM or CSS. These records inform the review; they do not settle the new Human observation.

## New Human report

Human reported opening the local review environment and checking the following in both English and Japanese:

- User Guide;
- GitHub Sponsors link;
- Ko-fi link.

This is **Human-reported browser review evidence for those named items only**. The report does not identify the browser/profile, effective viewport, exact pages used to read the guides, link activation method, final destinations, new-tab behavior, keyboard path, or the specific guide passages reviewed. In particular, Home's guide links still target published GitHub `main`, while the improved local guide text is in [English](user-guide-en.md) and [Japanese](user-guide-ja.md). The report alone therefore does not establish that the newly edited local guide bodies were reviewed in full. No payment or donation is part of this checkpoint.

Human also reported that the current Home design is inconsistent with NarrativeLine and LiaisonScape. Correct ordering of Dataset actions, sample explanation, guides, and funding links is insufficient evidence for visual hierarchy or Cross-App design acceptance. Treat functional/link review and visual acceptance as separate. **Home Cross-App design consistency remains unresolved; overall Home Human Visual Acceptance remains PENDING.** Human has not yet decided whether design unification belongs in this maintenance release or in an independent later workstream. Until that decision, this design concern is not classified as release non-blocking or as a confirmed release blocker.

## Supporting automated and source evidence

The preceding implementation checkpoint reported syntax checks for 42 modules, 240/240 tests, a 64-file Pages build, and `git diff --check` passing. Source and tests cover the Home link markup, EN/JA localized copy, ordering beneath Dataset actions, bundled sample counts, and existing acquisition safeguards. The local-review preparation confirmed HTTP 200 and byte identity for the served application entry/assets and the separately served local Markdown sources. These are automated, source, and HTTP results; they do **not** prove Human-observed visual quality, actual link navigation, guide comprehension, Sample operation, or Workspace safety in this review.

## Remaining Human Review and decision

- Confirm whether the EN/JA guide review used the edited local files or only the older published GitHub guide pages; review the updated local content and its basic use, browser-local Workspace, and portable E2R JSON Export explanations as needed.
- Review EN/JA Home at ordinary and narrow effective viewport widths for visual hierarchy, comparison with NarrativeLine/LiaisonScape, clipping/overflow, and the intended low prominence of support links.
- In an isolated browser profile and disposable Dataset, verify Ashen Crown EN/JA launch, displayed Dataset, and existing Workspace replacement protection. Do not infer these from static copy or previous unrelated acceptance.
- Check keyboard focus and activation, support-link destinations and new-tab behavior, and Home guide-link behavior. The current report does not give those detailed outcomes.
- Human decides whether Cross-App Home design alignment is required in this maintenance transaction or is a separate later task, and what bounded design direction to review. No common layout rule or CSS change is adopted here.

Maintenance Candidate implementation and automated verification remain separate from Human Browser Acceptance. **Maintenance Release Acceptance, Publication Approval, and Formal Closure have not occurred.** No runtime, CSS, guide body, Dataset, Workspace, or prior Human decision is changed by this documentation checkpoint.

## Later Human report and acceptance evidence audit — 2026-10-23 JST

The partial-review status above describes the earlier checkpoint. After bounded Home alignment and copy corrections, Human reported the following additional local review results for the current, still unpublished candidate. These are **Human-reported observations**, not new browser operations by Codex or formal Maintenance Candidate acceptance:

- Home visual review in EN and JA at 1200×900, 800×900, and 390×900: PASS within those reported sizes. Tab, Shift+Tab, and Focus Visible: PASS.
- Ashen Crown sample launch in EN and JA: PASS.
- After editing an Assessment, returning Home, requesting Dataset replacement, cancelling, and choosing Continue Editing, the edited value remained: PASS for that sequence.
- Japanese replacement dialogs: New Dataset, the sample value `読み込み先: 灰冠の王国のサンプルDataset`, and local E2R Dataset acquisition: PASS for the reported displays.
- Human reviewed the EN/JA guide content and approved the added beginner-facing examples of browser-local saving failure. The earlier EN/JA User Guide, GitHub Sponsors, and Ko-fi checks remain reported evidence; exact external navigation, link attributes, and all guide passages were not individually reported as browser tests.

Against the current working tree at HEAD `8baa6f0ae1301278055ed9607f9d2f3f1256495d` plus its uncommitted maintenance changes, Codex reran `npm.cmd run check` (42 modules; 241/241 tests PASS), `npm.cmd run build` (64 Pages files), and `git diff --check` (PASS). Source and tests distinguish app-generated replacement descriptions from Dataset-authored titles, including Handoff titles; this is **automated evidence**, not Human review of every Handoff screen. Home's guide links still target GitHub `main`; the edited local guide bodies and the currently published guide pages are distinct until publication.

Human has chosen to defer cross-app visual/structural unification of Dataset replacement and unsaved-work confirmation dialogs until after this maintenance release. That separate UX work is not a blocker for accepting the bounded candidate reviewed here. No evidence in this audit establishes exhaustive browser, viewport, Handoff, storage-failure, or cross-context safety acceptance. The candidate remains **READY FOR A BOUNDED HUMAN ACCEPTANCE DECISION**, with formal Maintenance Candidate acceptance and publication authorization still pending. Version, Credits `Updated`, exact commit range, and deployment require separate release decisions.

## Formal Human acceptance — 2026-10-23 JST

Human formally decided **ACCEPTED — BOUNDED MAINTENANCE CANDIDATE** for the unpublished candidate assessed in the preceding evidence audit. This decision accepts the reported evidence and its stated limits; it is not a new Human browser operation. The candidate is identified by local HEAD `8baa6f0ae1301278055ed9607f9d2f3f1256495d` and the audited, uncommitted Home, EN/JA Guide, replacement-dialog Localization, and related test changes. Later source changes are not automatically covered. The five existing unpushed commits include the separately accepted M2-W Closure Documentation; this decision does not redo M2-W acceptance.

The accepted maintenance scope comprises the EN/JA Home visual and action hierarchy, Sample information, locale-matched Guide access, GitHub Sponsors and Ko-fi links, EN/JA Guide and README updates, app-generated replacement-dialog copy, protection of Dataset-authored titles, and related regression tests. Human-reported browser review covers Home at 1200×900, 800×900, and 390×900 in EN/JA; Tab, Shift+Tab, and Focus Visible; Ashen Crown EN/JA sample launch; the reported Assessment edit → Home → replacement Cancel → Continue Editing retention sequence; and the reported Japanese New Dataset, sample, and local-file replacement displays. Human also accepted the EN/JA Guide content, including the concrete examples of browser-local saving failure. The preceding audit records the separate 241/241 automated test and 64-file build results; it does not convert them into Human browser tests.

This bounded acceptance does not assert Human browser review of every Handoff display, every viewport or browser, all storage and cross-context failure paths, or actual navigation to each external-link destination and new-tab behavior. Source and tests support link URLs/attributes and the distinction between generated fixed copy and authored Dataset titles, including Handoff titles; these are not additional Human operations. Browser-local Workspace saving remains distinct from portable E2R JSON Export. Dimension Assessment `0.2.0` remains a non-Stable Candidate. The cross-app visual and structural unification of replacement/unsaved-work dialogs remains a separate post-maintenance UX task.

**Maintenance Candidate Human Acceptance is complete within the scope above. Publication Approval is not.** The next release preparation must separately settle the application Version, Credits `Updated` date, exact source and Documentation Commit contents, Push range, and automatic Pages Deployment authorization. No Commit, Push, Deployment, or public-release verification is implied by this decision.

## Release-candidate metadata authorization — 2026-10-24 JST

Human subsequently approved Application Version `0.1.1`, retained Credits `First release: 2026-10-21`, and approved Credits `Updated: 2026-10-24` as the **planned** JST deployment date. The local metadata update and Commit are authorized. This does not revise the 2026-10-23 bounded acceptance evidence or the separately closed M2-W record. Published ParameterPlotter remains `0.1.0` until the later authorized Push and successful Pages Deployment. If the actual JST deployment date differs, recheck and correct `Updated` before Push. Exact Push scope and public verification remain separate gates.
