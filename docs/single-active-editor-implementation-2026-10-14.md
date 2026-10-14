# Single Active Editor — implementation and verification

Date: 2026-10-14

Status: **IMPLEMENTED / AUTOMATED PASS / HUMAN BROWSER ACCEPTANCE PENDING**.

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
new acceptance is pending. Tab C root cause **UNRESOLVED**, Diagnostics D2
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
Single Active Editor Human Browser Acceptance remains PENDING.
