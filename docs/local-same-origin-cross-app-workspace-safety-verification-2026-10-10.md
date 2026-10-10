# Local Same-Origin Cross-App Workspace Safety Verification

**Date:** 2026-10-10
**Status:** Codex verification recorded; Human Browser Acceptance and production verification remain pending. Publication remains NO-GO.

## Scope and authority

This checkpoint verifies the adopted Cross-Context Workspace Safety contract in a local same-origin environment for ParameterPlotter and NarrativeLine. The shared contract remains authoritative in E2R-SPEC's `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`. The related reusable guidance reviewed was `ai-knowledge/decisions/cross-context-workspace-safety.md` and `ai-knowledge/playbooks/workspace-safety-review-and-acceptance.md`. No specification or Knowledge policy was changed.

## Reproducible local environment

Both built applications were served by one loopback-only static server, using the same protocol, host, and port:

- ParameterPlotter: `http://127.0.0.1:5308/e2r-parameter-plotter/`
- NarrativeLine: `http://127.0.0.1:5308/e2r-narrative-line/`
- Root: `http://127.0.0.1:5308/`

The static server serves the built output for each application beneath its route prefix. The build output and isolated Edge profile are under `C:\Users\extra\E2R\.local-same-origin-safety\`, outside source repositories. A new isolated headless Edge profile was used. `location.origin` was the same in both applications, and `navigator.locks.query()` showed separately namespaced active tab locks for `e2r:parameter-plotter:workspace-tab:*` and `e2r:narrativeline:workspace-tab:*`.

To reproduce, build each repository, place/serve its static build under the route prefix above, launch a fresh isolated browser profile, and open both URLs. Do not clear shared browser storage after app tabs have initialized: doing so invalidates their saved revision snapshots and correctly exercises stale-state refusal. Any reset must happen before opening application contexts.

The local server is a development fixture. This is not evidence for public GitHub Pages routing, HTTPS, CORS, or production Handoff. NarrativeLine's existing Handoff accepts HTTPS sources; no HTTP exception or contract change was introduced. The cross-app scenarios used existing built-in samples instead.

## ParameterPlotter × ParameterPlotter

### Unapplied Dimension form

1. Tab A opened the bundled Ashen Crown sample and began a new Dimension.
2. Tab A entered `Unapplied dimension` without applying it.
3. Tab B displayed the same-app pending-work warning.
4. Tab B attempted New Dataset and confirmed replacement. The candidate remained unaccepted, and the serialized saved workspace was byte-for-byte unchanged.
5. After Tab B canceled the candidate and Tab A canceled the form, the peer warning cleared.
6. Retrying New Dataset then succeeded and saved the empty workspace.

### Unapplied numeric Assessment field

The browser test exposed a protection gap. Assessment number inputs use a capture-phase handler that marks `data-dirty=true` and stops propagation before the general draft tracker runs. Consequently, an unapplied numeric edit could be absent from both `pendingDraft` and the modified-Dataset status used by cross-tab coordination and replacement guards.

The fix adds `hasPendingAssessmentDraft(root)` in `workspace-recovery.js`, and combines that live DOM draft signal with the existing loss-sensitive-work check in `main.js`. A dirty Assessment input now marks the tab active, contributes to replacement refusal, and participates in unload protection. Successful numeric commit clears its dirty marker. The existing Dataset validation and persistence path is unchanged; no saved value is normalized or changed by detection.

In isolated Edge, changing a focused Assessment field to `6.2` without committing left saved storage unchanged while registering active pending work. A peer tab displayed the warning and, after replacement confirmation, its replacement was refused with the saved workspace unchanged. This direct-input check complements the automated tests; the attempted input was a draft only, not an accepted Assessment.

### Stale writer and recovery

An older tab was kept open after a second tab accepted a newer empty workspace. The older tab then changed an existing Assessment to a valid value and attempted the normal save path. The newer serialized workspace remained unchanged; the old tab showed the existing persistence-degraded/refused-write state and retained its in-memory work. Reload then recovered the accepted workspace, and closing the other tab removed its tab marker/lock. The remaining marker belonged only to the live tab and was inactive.

The retry check also confirmed that a replacement succeeds once there is no active draft and both tabs use the same current snapshot. Automated tests cover stale snapshots and fail-closed behavior when Web Locks is unavailable.

## ParameterPlotter × NarrativeLine

Both apps were open at the same origin. The storage and coordination names were distinct:

| Concern | ParameterPlotter | NarrativeLine |
|---|---|---|
| Saved workspace | `e2r-parameter-plotter-local-workspace-v2` | `narrativeline.lastDataset` |
| Locale | `parameterplotter.locale`, `parameterplotter.localeTemporaryResolution` | `narrativeline.language`, `narrativeline.localeTemporaryResolution` |
| Tab coordination | `e2r:parameter-plotter:workspace-tab:*` | `e2r:narrativeline:workspace-tab:*` |

With a real unapplied NarrativeLine title edit, ParameterPlotter Home showed no unrelated peer-work warning. A second NarrativeLine tab did show the warning; restoring the title cleared the NarrativeLine peer state. Conversely, a pending ParameterPlotter Dimension form did not create a warning in NarrativeLine. Opening the built-in Cedar sample in the second NarrativeLine tab changed NarrativeLine's saved Dataset while ParameterPlotter's saved workspace remained exactly unchanged.

These checks support app-owned storage and lock isolation for the tested paths. They do not establish that every key in every app is collision-free or test production deployment.

## Verification classification

### Automated

- ParameterPlotter `npm.cmd run check`: 36 application modules syntax-checked; 156/156 tests passed.
- ParameterPlotter `npm.cmd run build`: passed; 58 static Pages files built. The isolated fixture build was refreshed after the fix.
- NarrativeLine `npm.cmd test`: 365/365 passed, including same-app replacement safety, stale writer rejection, missing-Web-Locks fail-closed, and BFCache re-registration service tests.
- NarrativeLine `npm.cmd run build`: passed (`tsc -b` and Vite build).
- NarrativeLine `npm.cmd run lint`: passed.
- ParameterPlotter has no separate lint script in its package scripts.
- `git diff --check` passed for the ParameterPlotter changes and NarrativeLine was clean at inspection.

### Codex browser verified

Isolated headless Microsoft Edge was controlled through its local Chrome DevTools Protocol because the CUA computer-use initialization failed with a Windows sandbox helper error. The checks above used actual rendered app pages and user-like DOM/input actions, not only synthetic lock records. Browser evidence is Codex verification, not Human Browser Acceptance.

### Not verified

- Human Browser Acceptance of this same-origin checkpoint.
- Public GitHub Pages deployment, public HTTPS/CORS, or production Handoff.
- Screen reader output, broad browser/viewport matrix, exhaustive BFCache navigation, crash recovery, and all edit-form variants.
- NarrativeLine Handoff over the local HTTP fixture (its existing source policy requires HTTPS).

## Repository state and stop point

ParameterPlotter already had staged work from the preceding same-app safety checkpoint. This checkpoint adds unstaged edits to `main.js`, `workspace-recovery.js`, and related tests; `main.js` consequently has both staged and unstaged changes. `.github/FUNDING.yml` remains untracked and untouched. Because the current runtime file contains both pre-existing staged work and this fix, no commit was created: preserving the existing index state is safer than staging overlapping work as a new checkpoint. No unrelated repository or specification files were changed.

No push, tag, release, deployment, publication, Pages configuration, Actions variable, or Candidate status change was performed. Publication remains NO-GO. Human Browser Acceptance remains pending.
