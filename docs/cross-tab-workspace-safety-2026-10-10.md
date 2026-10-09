# Cross-Tab Workspace Safety — 2026-10-10

## Scope

This checkpoint addresses same-origin ParameterPlotter tabs that share the browser-local workspace. It keeps the existing Workspace key and Dataset Replacement Safety flow. It does not change Dataset payloads, Handoff v0, locale preference, or public deployment state.

## Behavior

- Each live tab registers a short app-specific status record and holds a Web Lock for its lifetime. The record marks loss-sensitive Dataset changes, unapplied authoring drafts, and degraded unsaved work.
- Dataset writes and incoming replacements run under an app-specific exclusive Web Lock. Before writing, the tab checks for other live tabs with loss-sensitive work and compares the exact saved Workspace string with the revision it originally loaded or most recently wrote.
- A replacement is refused while another tab has pending work. The current Dataset remains intact and the user receives an actionable reason. Once the other tab applies/cancels its draft or the user safely resolves the stale tab, retry is possible.
- A stale tab cannot overwrite a newer saved Workspace. Its in-memory work is retained; the app reports the conflict and recommends export/reload.
- If browser tab coordination or storage verification is unavailable, writes and replacements fail closed. They do not claim successful browser-local recovery.
- `pagehide` releases the tab lock and status, including when the page enters BFCache; a persisted page reacquires a fresh registration on `pageshow`. Browser-managed locks therefore do not survive a closed/crashed page as a permanent user lock.

## Verification

Automated checks cover live versus stale tab records, refusal while a peer is active, retry after peer work clears, stale-revision write refusal, and fail-closed behavior without Web Locks. `npm.cmd run check` passed on 2026-10-10 (36 application modules; 148 tests). `npm.cmd run build` also passed and produced the static Pages output.

Codex used an isolated Edge profile and a temporary same-origin server mapping ParameterPlotter, NarrativeLine, LiaisonScape, and the canonical fixture under one `127.0.0.1:4185` origin. With a pending Dimension form in tab A, a Lighthouse Handoff in tab B was refused and the serialized Workspace remained byte-for-byte unchanged. After cancelling the draft, a new Handoff tab accepted the 10-Entity Lighthouse Dataset; a subsequent interaction from stale tab A did not overwrite that accepted Workspace. NarrativeLine startup on the same origin did not change the ParameterPlotter Workspace key.

This is Codex browser verification, not Human Browser Acceptance. It used a disposable browser profile and test work; it does not establish GitHub Pages behavior, all failure modes, or Human review. Human Browser Acceptance remains pending.
