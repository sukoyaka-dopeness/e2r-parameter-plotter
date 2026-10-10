# ParameterPlotter Stale-Writer Export and Reload Recovery Verification

Date: 2026-10-11
Status: Codex Browser Verified for the isolated stale-writer, Export, Reload, and subsequent-save sequence below. Human Browser Test 30-A-N is ACCEPTED / PASS for the bounded operations recorded below. Cross-Context Workspace Safety remains open. PUBLIC RELEASE NO-GO remains in force.

## Scope and authority

This checkpoint verifies ParameterPlotter's existing stale-revision recovery path. It does not change the persistence model or safety contract. The applicable contract is E2R-SPEC `docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md`; applicable Knowledge is `decisions/cross-context-workspace-safety.md` and `playbooks/workspace-safety-review-and-acceptance.md`.

The Human's 2026-10-11 crash-recovery decision is recorded in `docs/abnormal-termination-workspace-recovery-verification-2026-10-11.md`: recover the last Apply-saved browser-local Workspace; do not promise crash recovery for unapplied form input; keep normal departure protection; leave draft autosave/recovery as a separate future design question. That decision is specific to ParameterPlotter and is not generalized to other E2R applications.

## Isolated browser setup

Codex used Microsoft Edge 154.0.4258.62 with a new isolated headless profile at `C:\Users\extra\AppData\Local\Temp\e2r-pp-reload-probe-b2210a8056ac43358fc590266f5e8848` and a dedicated download folder under that profile. Edge root PID was 21676, launched with `--user-data-dir` set to that profile and CDP port 9340. The app was served from the local ParameterPlotter source at `http://127.0.0.1:5312/`; the server was separately owned and was not terminated. No Human browser profile or personal file was used.

The built-in disposable Ashen Crown Dataset was used throughout: 10 Entities, 7 Dimensions, 70 Assessments. No canonical or bundled Dataset was changed.

## Human Browser Test 30-A-N — bounded acceptance

The Human used Microsoft Edge InPrivate at `http://127.0.0.1:5312/` with The Ashen Crown (10 Entities / 7 Dimensions / 70 Assessments).

1. Tab A applied the title `Stale Recovery Baseline A`, confirmed `Saved locally`, and used More → Export E2R JSON. The Human's submitted JSON contained that title.
2. Tab B used Continue Editing and showed the saved baseline. Tab A then applied `Newer Saved Workspace A2`; Tab B remained on its older view.
3. Tab B applied `Stale Writer Unsaved Candidate B`. The first refusal was explicitly a peer-work refusal, with the message: “Another ParameterPlotter tab has unapplied work. This tab kept its changes in memory; the saved workspace was not replaced.” It was not identified as a stale-revision refusal. Tab A separately exported `Newer Saved Workspace A2`.
4. Tab B successfully exported E2R JSON. The Human's submitted file contained `Stale Writer Unsaved Candidate B` and retained 10 Entities / 7 Dimensions / 70 Assessments. This is Human evidence that the refused tab's in-memory Dataset was downloaded. The Human's inspection is distinct from the earlier Codex Validator result for a different isolated browser download; no validator result is attributed to this Human file.
5. Before the Human chose Reload, a warning appeared: “Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep, then reload before continuing.” The Human did not perform another Apply immediately before observing this warning. The reason the displayed refusal state changed from the earlier peer-work message is not established; these are recorded as separate observations without inferring an unobserved transition.
6. After confirming the rescue Export, the Human reloaded Tab B, chose Continue Editing, and confirmed `Newer Saved Workspace A2`, 10 / 7 / 70 counts, `Saved locally`, and removal of the degraded / unsaved warning.
7. Tab B applied `Post Reload Recovery Save B`. The title-applied message and `Saved locally` state appeared, with 10 / 7 / 70 counts and no save-conflict warning.

**Human Browser Acceptance: Test 30-A-N ACCEPTED / PASS, limited to the observed sequence above.** This does not establish byte-level storage equality, Web Lock internals, all refusal causes, every Export failure path, or other browsers/environments. The first refusal and the later pre-reload warning remain distinct observations; the reason for their displayed-message change is unresolved, not a confirmed safety defect by itself.

## Stale-writer and recovery sequence

1. Tab A opened the Ashen Crown sample, applied the title `Stale Recovery Baseline A`, and exported it to establish a clean saved/export baseline.
2. Tab B opened the same saved Workspace and continued editing from that revision.
3. Tab A applied `Newer Saved Workspace A2` and exported it. The saved browser-local Workspace therefore had a new revision while Tab B retained the earlier snapshot.
4. Tab B applied the title `Stale Writer Unsaved Candidate B`. Its save was refused with the existing saved-revision conflict message. Tab B retained that title in memory, while browser storage still contained `Newer Saved Workspace A2`. No stale overwrite occurred.
5. From Tab B, Codex used More → Export E2R JSON. Edge reported the download completed at the isolated download path as `parameterplotter-dataset.e2r.json` (24,727 bytes). The downloaded JSON parsed successfully and contained the stale tab's rescue title `Stale Writer Unsaved Candidate B`, 10 Entities, 7 Dimensions, and 70 Assessments. The bundled E2R Validator returned `valid: true` with zero diagnostics. Thus Export captured the stale tab's in-memory Dataset while leaving the newer browser-local Workspace intact.
6. Codex reloaded Tab B. The app's normal `beforeunload` confirmation appeared; Codex accepted it only for this disposable test after the Export had completed. Reload returned to Home, where Continue Editing was available. Browser storage still held `Newer Saved Workspace A2`.
7. Continue Editing restored the saved winner with 10 / 7 / 70 counts and a saved-local-workspace status. No stale-revision warning remained. `navigator.locks.query()` showed two held ParameterPlotter tab locks after reload; the stale revision did not block recovery.
8. Tab B then applied `Post Reload Recovery Save B`. The save succeeded, browser storage held that title, the workspace status was saved locally, and the 10 / 7 / 70 counts remained intact.

## Evidence classification and limits

- **Codex Browser Verified:** actual browser UI action reached stale-revision refusal, kept the newer saved revision, downloaded and inspected the stale tab's E2R JSON, reloaded to the newer saved Workspace, and successfully saved a subsequent edit.
- **Automated Test PASS:** before this documentation-only update, `npm.cmd run check` passed syntax checks for 37 application modules and all 167/167 tests; `npm.cmd run build` built 59 static Pages files. These checks supplement but do not replace the browser sequence.
- **Human Browser Acceptance:** Test 30-A-N is accepted for the bounded Human sequence above. The separate Codex sequence remains Codex evidence and is not relabeled as Human-tested.
- This was one isolated Edge/profile and one disposable Dataset. It does not establish browser-wide behavior, every recovery/failure path, production Pages behavior, or full Cross-Context Workspace Safety acceptance.

No runtime, test, Dataset, schema, Candidate status, or Application Version changes were made. The existing fail-closed and stale-revision guards remain in place. The Export/Reload path succeeded, so no implementation fix was needed for this tested case.

## Remaining safety work

Still pending are Human Browser Acceptance of the abnormal-termination findings; exhaustive form-specific cross-tab coverage; BFCache recovery operations not exercised; ParameterPlotter × NarrativeLine BFCache interaction; production GitHub Pages same-origin and HTTPS/CORS Handoff checks; and full Cross-Context Workspace Safety acceptance. Test 30 does not establish byte-level storage equality, Web Lock internals, all conflict causes, or every Export failure path. PUBLIC RELEASE NO-GO remains in force.
