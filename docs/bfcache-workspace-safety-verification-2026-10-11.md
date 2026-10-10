# BFCache Workspace Safety Verification

Date: 2026-10-11
Status: Codex Browser Verified for a BFCache-restored saved-but-modified Workspace and stale-writer refusal in isolated Edge. Pending-draft BFCache restoration and Human Browser Acceptance remain pending. Cross-Context Workspace Safety is not closed. PUBLIC RELEASE NO-GO remains in force.

## Authority and implementation reviewed

The adopted contract is E2R-SPEC docs/cross-app/cross-context-workspace-safety-design-2026-10-10.md. The applicable Knowledge records are decisions/cross-context-workspace-safety.md and playbooks/workspace-safety-review-and-acceptance.md. They require stale writers to stop, unresolved work to remain protected, coordination state not to become a permanent lock after BFCache or closure, and recovery paths to remain available. This checkpoint verifies ParameterPlotter behavior only and does not revise that contract.

ParameterPlotter's cross-tab-workspace.js removes its status marker and releases the tab Web Lock on pagehide. On pageshow with event.persisted, it clears transient coordination failure and registers a fresh tab lock/status. Workspace writes and replacements still use the exclusive write lock and compare the stored Workspace string with the tab's expected revision through saveIfCurrent. A mismatch refuses the write and keeps the newer persisted copy. The persisted workspace key is e2r-parameter-plotter-local-workspace-v2; tab locks use the e2r:parameter-plotter:workspace-tab: namespace.

## Browser environment and BFCache evidence

Codex used Microsoft Edge 154.0.4258.62 headless with a new isolated profile, disposable built-in Ashen Crown sample data, and a temporary same-origin static server at http://127.0.0.1:5312/. The temporary server served the app with Cache-Control: public, max-age=120 and an /away.html history destination. It did not change repository or production server settings.

An initial check against the ordinary ParameterPlotter development server did not enter BFCache: after Back, pageshow.persisted was false and Edge's PerformanceNavigationTiming.notRestoredReasons reported response-cache-control-no-store and response-cache-control-no-store-with-js-network-request. That run is classified as a non-BFCache navigation, not a BFCache result. The cacheable temporary server was then used for the actual BFCache checks.

In the cacheable environment, the page emitted pagehide.persisted=true on leaving and pageshow.persisted=true on history return. This is direct evidence that the old Document was restored from BFCache rather than reloaded.

## Codex Browser Verification: saved Workspace and stale writer

1. Tab A opened the disposable Ashen Crown sample and applied a temporary Dataset title. Its saved workspace had datasetModified=true and contained ten Entities.
2. Tab A navigated to the same-origin away page. The observed pagehide.persisted=true confirmed the page entered BFCache; the coordinator released its active marker/lock.
3. Tab B opened ParameterPlotter and used New Dataset. The replacement confirmation completed successfully while A was suspended; the saved raw Workspace changed to the new empty Dataset (zero Entities). This verifies that the BFCache-suspended tab does not leave an active peer marker that permanently blocks a safe replacement.
4. Back restored Tab A with pageshow.persisted=true. Its old title and ten-Entity in-memory page state remained visible while localStorage contained Tab B's newer zero-Entity Workspace. The restored tab reacquired its tab lock and active status; the two live tab locks were visible in navigator.locks.query().
5. Tab A then applied another title edit. The stale revision was refused with the specific message: ?Another ParameterPlotter tab changed the saved workspace. This tab did not overwrite it. Export any work you need to keep, then reload before continuing.? The saved raw Workspace remained byte-for-byte equal to Tab B's new Dataset. No replacement or stale write was accepted.

This verifies BFCache restoration, stale-revision refusal, preserved old in-memory work, a non-permanent suspended lock, and visible Export/Reload recovery guidance for the tested saved-but-modified Dataset path. Export and Reload were not themselves executed as recovery actions.

## Pending-draft and recovery limits

A separate BFCache restoration of a live, unapplied form draft was not completed in this browser run. ParameterPlotter's beforeunload guard prompts when pending drafts or degraded work are present; continuing navigation requires explicitly accepting the browser's leave-page confirmation, which was not performed. Existing automated checks verify beforeunload protection for pending drafts, and the new coordinator lifecycle regression test verifies pagehide release and persisted-pageshow reacquisition, but these do not prove form DOM/state restoration in a real BFCache cycle. Human Browser Acceptance for this operation remains pending.

This checkpoint did not test abnormal process termination, all form types, production GitHub Pages headers, production HTTPS/CORS Handoff, other browsers, screen readers, or ParameterPlotter ? NarrativeLine during BFCache traversal. Current NarrativeLine source uses narrativeline.lastDataset and e2r:narrativeline:workspace-tab:; the existing 2026-10-10 same-origin checkpoint records PP/NarrativeLine storage and lock separation. No BFCache-specific cross-app scenario is claimed here.

## Automated verification

- node --test cross-tab-workspace.test.mjs: PASS, 8/8 tests.
- npm.cmd run check: PASS, syntax check for 37 application modules and 167/167 tests.
- npm.cmd run build: PASS, 59 static Pages files.

The added test models pagehide releasing the tab record/lock and a persisted pageshow reacquiring them with the same pending-work status. It is automation coverage for the coordinator lifecycle, not browser BFCache proof or Human Acceptance.

## Acceptance and release boundary

Codex Browser Verified: a real Edge BFCache cycle for a saved-but-modified workspace, successful safe replacement in another tab while the first was suspended, preserved newer storage, restored old page, and stale-write refusal. The non-BFCache no-store run is recorded separately as an environment limitation.

Human Browser Acceptance remains pending for BFCache traversal and workspace actions. Cross-Context Workspace Safety as a whole remains pending, including BFCache form-draft restoration, abnormal termination recovery, exhaustive cross-tab form coverage, and production same-origin/HTTPS/CORS behavior. The prior Quadrant Tests 23-27 Human closure remains unchanged. PUBLIC RELEASE NO-GO remains in force.
