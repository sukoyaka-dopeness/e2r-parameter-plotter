# Dimension Assessment Candidate 0.2.0 in ParameterPlotter — 2026-10-08

## Status

Implementation and automated verification are complete in the local source.
The change has not received Human Browser Acceptance. Candidate 0.1.0 and 0.2.0
remain Candidates; neither is Stable. Canonical and bundled samples were not
changed.

## Version behavior

- A new Dataset remains without a Dimension Assessment payload until its first
  Dimension is saved. That first payload uses exact version `0.2.0`.
- Existing `0.1.0` payloads remain `0.1.0` during ordinary Dimension edits and
  Export. Their authoring UI does not expose Description until the user chooses
  the explicit upgrade action in Dimension Pool and confirms the explanation.
- Upgrade changes the payload and an existing matching Specification Extension
  `uses` declaration to `0.2.0` in one Validator-checked Dataset transaction.
  It does not generate descriptions or alter Dimension IDs, bounds, endpoint
  labels, units, integer policies, Assessment values, or sibling Dataset data.
- `0.2.0` payloads remain `0.2.0`; unknown versions remain opaque and
  authoring-disabled.

## Description behavior

Description is optional plain text. The form uses a multiline textarea without a
fixed length limit. An empty field omits the property; whitespace-only input is
rejected; nonblank input is kept byte-for-byte as a JavaScript string, including
leading/trailing whitespace, line breaks, and markup-like characters. Rendering
escapes it in the Dimension Pool and does not translate Dataset content when
the UI locale changes. The four visualization surfaces keep their existing
layout and continue to display names, scales, and Assessment values.

## Verification

- `npm.cmd run check`: syntax check and 94 application tests pass.
- The vendored Validator was already synchronized from Production Validator
  `d81a6a7c6047f39369e425ca018d3b4b80bd18c6`; its snapshot check passes.
- A local server was started at `http://localhost:4182` on an isolated port.
  Codex browser interaction could not start: both Computer Use and the
  node_repl browser runner exited during Windows sandbox setup with
  `helper_unknown_error: setup refresh had errors`. No real-browser result is
  claimed. HTTP delivery alone is not browser verification.

Human Browser Acceptance should exercise new-Dataset first Dimension authoring,
0.1.0 ordinary edit and explicit upgrade/cancel, 0.2.0 multiline Description
create/edit/reload/Export, both UI locales, and the four views. Machine tests do
not change the previously scoped locale Acceptance status or imply broader
Product Acceptance.
