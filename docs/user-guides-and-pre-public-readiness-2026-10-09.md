# User Guides and Pre-Publication Readiness

Date: 2026-10-09

## Local guide implementation

The ParameterPlotter repository now contains task-focused English and Japanese
Markdown guides at [`user-guide-en.md`](./user-guide-en.md) and
[`user-guide-ja.md`](./user-guide-ja.md). These replace the earlier local HTML
guide pages so Hub and sibling applications can use the same GitHub Markdown
presentation. Their planned Hub destinations are the corresponding
`github.com/.../blob/main/docs/user-guide-{en,ja}.md` pages. The local guide
commit is not pushed, so those public destinations have not yet been verified.
The guides cover opening a Dataset,
authoring Dimensions and Assessments, using Profile/Radar/Quadrant/Matrix,
distinguishing zero from unassessed values, and keeping a portable JSON export
separate from browser-local continuity. The Japanese copy follows the accepted
E2R user-guide vocabulary while quoting implemented UI labels.

The Home Ashen Crown action selects the canonical EN or JA bundled copy using
the already resolved UI locale. Its Japanese label is
「サンプルデータセットを開く · 灰冠の王国」, matching the JA Dataset title;
English remains “Open Sample Dataset · The Ashen Crown.” This is a UI label
alignment only. It does not alter Dataset content, ownership, saved locale
priority, or Startup Handoff v0.

The Hub documentation card now links directly to the EN/JA Markdown files in
the ParameterPlotter GitHub repository, matching its NarrativeLine and
LiaisonScape guide links. These documentation links do not depend on the
ParameterPlotter application URL. The app-launch link remains separately
conditional on the configured application URL.

## Readiness audit

| Area | Current evidence and state |
| --- | --- |
| ParameterPlotter application URL | The repository has a read-only GitHub Actions check workflow and no deployment workflow. The Hub's `VITE_PARAMETER_PLOTTER_URL` is absent from its Pages deployment workflow, so the production app link remains unconfigured. No deployment or public write was attempted. |
| ParameterPlotter EN/JA guides | Local Markdown sources exist at `docs/user-guide-en.md` and `docs/user-guide-ja.md`; Hub links now target the matching GitHub `blob/main` paths. The files are not pushed, so public availability and post-push link reachability remain pending. |
| Hub startup handoff | Startup Handoff v0 is implemented locally. The Hub selects the source matching its UI locale and passes `datasetUrl` and the requested `locale` in the startup fragment. The existing Recipient-Preference rule and Dataset Replacement Safety remain in force. |
| Ashen Crown EN/JA | The local canonical and bundled files are Candidate 0.2.0 with 7 Dimensions and 70 Assessments. Hub local integration uses an explicit loopback fixture because the public E2R-SPEC raw URLs have not been shown to contain this local revision. This checkpoint does not treat public sources as current. |
| Lighthouse and Cedar | The Hub retains owner-linked EN/JA source URLs and existing acquisition routes. Their bounded ParameterPlotter sample integration has Human acceptance for the recorded review scope. That does not verify every edit/export workflow or every browser. |
| HTTPS and CORS | Public Handoff requires HTTPS app and Dataset URLs and browser-permitted CORS on the Dataset host. Loopback HTTP and the local CORS fixture are development-only evidence; they do not establish production behavior. |
| Replacement safety | Existing automated tests cover invalid URLs, fetch/parse/open failures, fragment handling, and loss-sensitive replacement decisions. Human Browser Acceptance for failure, Cancel, and unsaved-work replacement remains pending; no destructive confirmation was tested against the user's data. |
| Locale | Recipient-Preference is unchanged: a saved explicit ParameterPlotter locale can take priority over the Hub request. UI language and Dataset-authored language remain independent. The Ashen Crown Home action uses the resolved UI locale to choose its bundled language copy. |
| Unsupported validator diagnostics | Read-only diagnostic handling for structurally readable but Validator-invalid Handoff data remains a pending Human decision. This work did not change its behavior or claim that it is accepted. |
| Candidate status | Dimension Assessment Candidate 0.2.0 remains non-Stable. No promotion, release, publication, or deployment is included. |

## Codex-operated local browser verification

On 2026-10-09, isolated headless Chrome profiles used the local ParameterPlotter
server at `http://127.0.0.1:4185/`, the configured Hub dev server at
`http://127.0.0.1:4191/e2r-hub/`, and the Ashen Crown fixture at
`http://127.0.0.1:4192/`. These profiles did not use or replace a Human browser
workspace.

- ParameterPlotter Home showed the approved EN and JA sample labels. Opening
  each sample loaded the matching Dataset language with 10 Entities, 7
  Dimensions, and 70 Assessments.
- Hub EN/JA rendered three application cards and the six approved sample cards
  in their configured order. The Lighthouse, Ashen Crown, and Cedar ParameterPlotter
  links selected the corresponding EN/JA source and locale. The Ashen Crown
  local fixture handoff loaded both language files. Lighthouse and Cedar link
  destinations were inspected in the page; their public source fetches were
  not repeated in this local run.
- At 390px, Hub and both earlier HTML guide pages had no horizontal document
  overflow. At desktop width, the three lower sample cards shared a top
  alignment. That browser evidence applies to the prior HTML pages, not the
  current GitHub Markdown rendering.
- A missing-URL handoff showed its failure message while a saved sample
  workspace remained byte-for-byte unchanged in browser storage.
- In a disposable profile, an unexported numeric edit was present in the
  browser-local workspace. A valid incoming handoff showed the replacement
  confirmation; Cancel retained the edited value and `datasetModified` state.
  No unapplied authoring-form draft was used in this browser exercise.
- With saved UI preference EN and a JA Handoff request, the locale conflict
  appeared before fetching. Choosing the saved language kept the UI in EN;
  the JA incoming Dataset title remained Japanese in the replacement dialog.
  Cancel retained the existing workspace.
- The captured Hub and EN sample interactions reported no JavaScript
  exceptions. This is limited instrumentation, not an all-path exception audit.

This is **CODEX BROWSER VERIFIED** evidence for the local, isolated conditions
listed above. It is not Human Browser Acceptance, screen-reader verification,
public HTTPS/CORS evidence, or proof that published URLs serve the current
Dataset revisions.

## Remaining pre-publication gates

1. Human Browser Review of the Ashen Crown Home sample label and EN/JA
   selection, plus the Hub's configured application/guides links.
2. Human Browser Review of Handoff failure, Cancel, and unsaved-work
   replacement protection using a disposable Dataset and a recovery copy.
3. Human decision on the existing Validator-invalid but structurally readable
   Handoff diagnostic case before changing that behavior.
4. A separately approved deployment and configuration decision for the
   ParameterPlotter public URL, Hub `VITE_PARAMETER_PLOTTER_URL`, and the
   Ashen Crown EN/JA owner-published source revisions.
5. After the relevant source commits are pushed, verify the EN/JA GitHub
   Markdown guide links and exact public Dataset revisions at the unchanged
   owner URLs. After deployment is authorized, verify production HTTPS/CORS
   and public Handoff behavior.

Human acceptance for earlier bounded UI and sample checkpoints remains scoped
to those original source revisions and observed behaviors. Automated checks,
Codex-operated browser evidence, and Human Browser Acceptance are separate
evidence classes. This document does not close the pending Hub-to-ParameterPlotter
Handoff Acceptance or approve public release.
