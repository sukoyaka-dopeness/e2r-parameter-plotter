# Vendored E2R Validator browser modules

These ES modules are a browser-loadable snapshot of the canonical
`sukoyaka-dopeness/e2r-validator` source. The Validator repository remains the
source authority; this copy makes the static ParameterPlotter repository
self-contained and keeps validation available to the browser without a build
server, remote CDN, or runtime package installation.

At the 2026-10-21 local synchronization checkpoint, these 14 browser-loadable
modules match the published Validator `main` commit
`655954d3186d7a1bca24b3f0b81edec76800c925`. This source includes
exact-version Dimension Assessment Candidate `0.1.0` and `0.2.0` validation
and the fix that leaves unsupported Specification Extension versions opaque.
The published npm `0.7.0` package predates those source changes; no new
Validator tag or npm package was released with them. This browser snapshot
has no separate package version. ParameterPlotter application version `0.1.0`
does not change Validator or Specification versions.

Before publishing ParameterPlotter, review the canonical and vendored source
relationship again and rerun `node scripts/sync-validator-vendor.mjs --check`.
Do not update only one copy: the canonical Validator source and this browser
distribution must remain behaviorally aligned. The Validator source publication
does not authorize ParameterPlotter publication or an npm package release.

`cli.js` is intentionally excluded; all browser library modules are retained.
The MIT license notice from the canonical Validator is included here.
