# Single Active Editor — implementation and verification

Date: 2026-10-14

Status: **IMPLEMENTED / AUTOMATED PASS / SAE-01–SAE-07 AND BU-01/02 HUMAN BROWSER PASS (BOUNDED) / HUMAN ACCEPTED / CLOSED (BOUNDED)**. Human decision: 2026-10-17.

The [Human-approved application policy](../../e2r-spec/docs/parameterplotter/parameterplotter-single-active-editor-design-2026-10-14.md)
is product authority. Base HEAD:
`1523f4ddb1f71edce88fe8e842638e12ff9df56f`. This implementation builds on the
pre-existing dirty worktree, including M1-C6, C21–C24 and pending UI changes.
No staging, commit or publication is performed.

## Runtime

- `single-active-editor.js` requests `e2r:parameter-plotter:active-editor`
  exclusively with `ifAvailable` once at startup. Only the holder loads the
  saved Dataset. A blocked page does not register Workspace presence, load the
  saved Dataset, queue for ownership or start Handoff/file/sample acquisition.
- `editor-session-screen.js` provides dedicated EN/JA checking, other-tab,
  coordination-unavailable and session-ended screens. Locale switching,
  keyboard traversal and ordinary browser reload/navigation remain usable.
  Handoff intent survives locale changes. No editing/acquisition controls appear.
- Startup reads the latest Workspace under the existing shared write lock.
  A live older runtime's presence stops startup even when that peer is clean.
- Home/focus/clean/dirty state changes retain ownership. `pagehide` immediately
  revokes it; BFCache restoration requires explicit reload and never reacquires
  in the old document. Dataset/draft objects are not reset on session end; live
  authoring controls are retained in a detached fragment, so DOM-only numeric
  input is not erased and remains protected by beforeunload. Window/document
  capture guards also prevent an old pointer drag from applying changes.
  Departure warns for pending input, degraded state and an unfinished save.
- The Coordinator fences a persistence callback after registration/write-lock/
  query waits. Save/replacement results and acquisition completions recheck
  the document generation. No expired completion can save or install a Dataset.
  Ending the document also aborts queued write-lock requests and cancels a
  query inside a held write lock, allowing the next owner to proceed without
  waiting for the old query to resume.
- Existing write gate, peer checks, revision comparison, validation, replacement,
  Export baseline, specification declaration and filename contracts remain.
  An owner with refused saving can Return from Home and Export in-memory JSON;
  Export does not reopen the refusal gate. Read-only Dataset Export is unchanged.
- The owner has no focus-driven peer refresh, so focus cannot produce transient
  checking/disabled-button churn. Storage notifications and final checks remain;
  legacy Coordinator callers still have their old focus behavior. Home notices
  are above actions, with no reserved warning gap. Existing disabled styling
  and `Apply title` / 「タイトルを適用」 remain.

## Automated evidence

The unit suite passes **223/223**, including 11 new ownership tests; syntax
checks cover **40 application modules**. The focused ownership/Coordinator/
write-gate/recovery/Home set passes **62/62**. The lock-service test double models
exclusive queueing, non-queued `ifAvailable`, and browser-client termination.
Cases cover simultaneous starts, release/new load, blocked non-takeover,
BFCache token revocation, unavailable/rejected coordination, stale marker
cleanup, queued/query-delayed save fencing, refusal latch, exact revision
checks and non-owner write prohibition. Modeled termination is not a real crash.

Actual `main.js` and its module graph are evaluated in separate jsdom contexts:

```powershell
node --experimental-vm-modules --disable-warning=ExperimentalWarning scripts/verify-single-editor-dom.mjs C:\Users\extra\E2R\e2r-dom-test-environment\node_modules\jsdom\lib\api.js
```

The command uses already installed jsdom 30.0.1 without changing the dependency
repository or adding a ParameterPlotter package dependency. Another installed
`jsdom/lib/api.js` path may be supplied. **Eleven scenarios PASS**:

1. Non-owner entry/locale leaves Workspace and Handoff intent unchanged,
   without a Dataset fetch or saved-Workspace read.
2. Focus retains Home DOM and clear availability; first Continue click works.
3. Owning title Apply uses the existing guarded save.
4. A modeled legacy-peer refusal retains in-memory title, Home Return,
   existing JSON Export, the exact saved string and the refusal latch.
5. A fresh load restores the saved baseline; blocked and BFCache documents
   cannot take over or submit stale state.
6. Missing coordination fails closed, including Handoff.
7. A fresh owner performs normal startup Handoff/replacement safely.
8. Even a clean live older runtime blocks new startup, without later takeover.
9. A delayed startup Handoff result after session end cannot install a Dataset.
10. A delayed sample result after session end cannot install a Dataset.
11. A delayed local-file read after session end cannot install a Dataset.

`npm.cmd run build` produces 62 static Pages files. Both repositories'
`git diff --check` pass. Roadmap synchronization adds one ASCII row and preserves
every original byte, including its pre-existing invalid UTF-8 sequences.

No real browser, Human profile, personal Workspace, CDP endpoint or server was
used. DOM tests do not measure CSS geometry, actual downloads, Web Locks,
BFCache caching or process crashes. Inspecting a download-request Blob is not
evidence of a browser-downloaded file or Human Browser PASS.

Current verification rerun on 2026-10-17: `npm.cmd run check` PASS; syntax
checked 42 application modules and all 237 tests passed. This is current
automated evidence, not Human Browser Acceptance.

## Human Browser Review

Use disposable test data and the same exact origin/browser profile:

1. A owns the session on initial Home. B has dedicated EN/JA guidance and no
   Continue/New/Open/Sample/file input; A can acquire/edit/save. B must not
   change the saved Workspace.
2. Switch away/back to A and immediately Continue: natural normal/narrow Home,
   stable buttons/focus, no dim flash, first mouse/keyboard activation works.
3. After A's confirmed save and normal close, B stays blocked. Explicitly reload
   B and verify the latest title/data. Review reload and simultaneous starts:
   exactly one new document may edit.
4. Navigate away/back: a BFCache-restored document requires reload and cannot
   overwrite a new owner's work. Real abnormal termination and unavailable
   coordination need suitable isolated tests; automated cases are not browser proof.
5. While A owns, a Hub link in B must make no Dataset request or apply and must
   retain intent. After A ends, reopen the Hub link and review recipient locale
   and replacement safety.
6. With a safely induced owning-tab save failure, review memory protection,
   Home warning above actions, Return, JSON Export/download confirmation,
   unchanged saved baseline and sticky refusal.

M1-C6/M1-C21 remain historical **HUMAN BROWSER ACCEPTED / PASS / CLOSED (BOUNDED)**;
new acceptance was pending when this review plan was written. The 2026-10-17
Human decision closed Single Active Editor (bounded). Tab C root cause **UNRESOLVED**, Diagnostics D2
**OPEN**, PUBLIC RELEASE **NO-GO**.


## Non-owner common UI correction

Human review found a missing Credits action and a hardcoded product-name Footer
on the dedicated non-owner screen. The screen now reuses the common Footer,
Credits dialog, localization and modal keyboard handler. Presentation-only
controls remain usable without granting editor ownership or fetching Handoff
Datasets. The editor guard handles shell keyboard events before authoring handlers.

Real-module DOM integration verifies EN/JA Footer text, Credits close button,
backdrop, Escape, Tab/Shift+Tab wrapping, focus restoration and background inertness.
The same checks after owner departure and for an ended document preserve blocking,
saved Workspace bytes and Handoff intent. This is automated DOM evidence;
overall Single Active Editor Human Acceptance was PENDING at this evidence checkpoint;
Human formally accepted it on 2026-10-17 as recorded in the
[Final Acceptance record](../../e2r-spec/docs/parameterplotter/parameterplotter-single-active-editor-final-acceptance-decision-packet-2026-10-17.md).

## Human Browser Evidence Consolidation — SAE-01–SAE-07

The Human reported the bounded results below for the integrated source
revision `9c4dcbd899b7fdf4611adb5eded866ae0964e904`. This section records the
Human's observations; Codex did not independently operate or observe these
browser tests. This consolidation was recorded on 2026-10-17; the supplied
report did not give individual run dates. These
results are distinct from the automated and DOM evidence above, and from the
earlier Test 36 evidence in the [abnormal-termination verification record](./abnormal-termination-workspace-recovery-verification-2026-10-11.md).

### SAE-01 — Single Active Editor ownership

**Human Browser PASS (bounded).** In two tabs using the same Origin and
browser profile, only the owner had the normal editing screen. The other tab
showed the dedicated guidance screen and could not edit or acquire the Dataset.
No adverse effect on the owner was observed.

### SAE-02 — Normal closure and explicit reload

**Human Browser PASS (bounded).** After the owner tab closed, the blocked tab
did not take ownership automatically. An explicit reload acquired ownership
and restored the last successfully saved Workspace.

### SAE-03 — Blocked Handoff safety

**Human Browser PASS (bounded).** DevTools Network showed no Dataset GET while
the receiving tab was blocked. After the owner ended, an explicit reload made
an HTTP 200 request to a local fixture and showed the replacement confirmation.
Cancel preserved the original Workspace. This was a local HTTP fixture test;
it does not establish real Hub, hosted HTTPS, or CORS behavior.

### SAE-04 — Home, focus, and responsive behavior

**Human Browser PASS (bounded).** Home/Workspace navigation, Continue Editing,
focus behavior, and normal/narrow layouts were reviewed. The first report said
the Workspace brand link did not activate with Enter; Human recheck activated
it successfully. No reproducible defect was confirmed and no fix was made.
The initial report remains part of the history and is not erased by the recheck.

### SAE-05 — Concurrent startup and BFCache

**Human Browser PASS (bounded).** Near-simultaneous startup produced one owner
and one blocked document; normal Back-return safety was also checked. In a
separate isolated environment, the Human observed `pagehide.persisted ===
true` and `pageshow.persisted === true` in the same Document's lifecycle
observation array. The restored old document showed the session-ended state,
and the new owner's saved revision remained available. The BFCache admission
observations are separate evidence from the application's stale-owner safety
result; neither is a claim that every browser will place a page in BFCache.

### SAE-06 — Simulated Workspace write refusal

**Human Browser PASS (bounded).** In an isolated Edge profile, writes to the
current Workspace localStorage key were selectively rejected with an injected
`QuotaExceededError`. The Human reported that in-memory edits remained
available, the saved baseline was unchanged, and the refusal latch suppressed
later save attempts. Home displayed the recovery warning and Return restored
the in-memory work. The Human reported exporting an actual
`SAE-06 unsaved revision 2.e2r.json` file and inspecting
`extensions.metadata.title` plus the 10 Entities / 7 Dimensions / 70
Assessments. Export did not clear the refusal latch. Reload restored the last
saved title, `SAE-06 saved baseline`, and the Dataset. This was injected write
refusal, not actual storage exhaustion. A leave-page confirmation dialog was
not observed in this SAE-06 run and is excluded from that PASS. It was later
observed in the separate BU-01 and BU-02 reviews below.

### SAE-07 — Abnormal termination recovery

**Human Browser PASS (bounded).** After the Human approved the specific test
and confirmed isolation immediately before execution, a dedicated Edge
profile's 12-process tree was force-terminated. The Human reported exit code
0 and no remaining process for that target profile. Edge was restarted with
the same isolated profile and the app was opened explicitly. The saved
Workspace recovered as `SAE-07 saved baseline` with 10 Entities, 7 Dimensions,
and 70 Assessments. Unapplied input did not recover; that is outside the
contract's recovery promise for the last successfully saved Workspace. A
ParameterPlotter non-owner tab was visible after restart and was blocked at
the time observed. Whether that tab came from browser session restoration or
a new launch was not established, so this is not evidence that the old
Document survived termination. This test covered the isolated Edge process
tree, not a renderer-only or operating-system-wide failure.

### BU-01 / BU-02 — beforeunload protection

These are separate Human Browser reviews in the dedicated extension-disabled
Edge profile. Their results are Human-reported; Codex did not operate or
observe the browser.

**BU-01 — unapplied input: Human Browser PASS (bounded).** With saved title
`BU-01 saved baseline` and unapplied title draft `BU-01 unapplied draft`, the
Human distinguished saved Workspace from the draft and saw the pending-input
warning. Ctrl+R displayed Edge's leave-page confirmation. The Human cancelled;
reload stopped, the draft remained, and the Dataset retained 10 Entities, 7
Dimensions, and 70 Assessments.

**BU-02 — degraded persistence: Human Browser PASS (bounded).** With saved
title `BU-02 saved baseline`, a test injection rejected only the current
Workspace localStorage write with `QuotaExceededError`. The save attempt was
refused, the persistence warning appeared, and the unsaved Dataset stayed in
memory (`attempts: 1`, `savedCopyUnchanged: true`). The Human exported and
inspected the actual `BU-02 unsaved revision.e2r.json` file; its
`extensions.metadata.title` was `BU-02 unsaved revision`, with 10 Entities, 7
Dimensions, and 70 Assessments. Ctrl+R displayed the leave-page confirmation;
the Human cancelled and verified that reload stopped while the unsaved title,
refusal warning, and Dataset remained. This used injected refusal, not actual
disk-capacity exhaustion.

## Final Acceptance boundary and readiness

SAE-01–SAE-07 each have a Human-reported **PASS (bounded)** result. They do not
by themselves declare overall Single Active Editor acceptance. The current
E2R-SPEC Roadmap remains authoritative for current status, and the overall
Human Acceptance was **PENDING** when this evidence was consolidated; the
2026-10-17 Human decision closes Single Active Editor **(BOUNDED)**. Cross-Context Workspace Safety remains
**PENDING** independently; Tab C remains **UNRESOLVED**, Diagnostics D2
**OPEN**, and ParameterPlotter PUBLIC RELEASE **NO-GO**.

BU-01 and BU-02 close the previously unobserved browser-confirmation gap for
pending input and degraded persistence within their stated cases. A
save-in-progress departure was not tested in a Human browser; source and
automated tests cover the `saving` warning predicate, but that is not reported
as Human Browser PASS. No concrete failure is known for that branch. SAE-03's
real Hub/hosted HTTPS/CORS behavior and crash modes beyond the SAE-07 isolated
Edge process-tree case remain outside these bounded results and the separate
release/cross-app gates. These limitations do not change the Roadmap's
independent Cross-Context Workspace Safety or Public Release status.
