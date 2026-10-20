# Vendored E2R Validator browser modules

These ES modules are a browser-loadable snapshot of the canonical
`sukoyaka-dopeness/e2r-validator` source. The Validator repository remains the
source authority; this copy makes the static ParameterPlotter repository
self-contained and keeps validation available to the browser without a build
server, remote CDN, or runtime package installation.

At the 2026-10-21 local preparation checkpoint, these 14 browser-loadable
modules match Validator local `main` commit
`d81a6a7c6047f39369e425ca018d3b4b80bd18c6`, including exact-version
Dimension Assessment Candidate `0.1.0` and `0.2.0` validation. The published
Validator `main` is still `7c352ce9f5e3b47564059f40e3e9a905d6e7defb`
with package version `0.7.0`; the two local Candidate-support commits are not
part of that published revision. This vendored browser snapshot is not the
published `0.7.0` package and has no separate package version. ParameterPlotter
application version `0.1.0` does not change Validator or Specification versions.

Before publishing ParameterPlotter, review the canonical and vendored source
relationship again and rerun `node scripts/sync-validator-vendor.mjs --check`.
Do not update only one copy: the canonical Validator source and this browser
distribution must remain behaviorally aligned. Publishing ParameterPlotter
would make this vendored snapshot public even if Validator `main` remains at
the older revision; that publication scope requires its own Human approval.

`cli.js` is intentionally excluded; all browser library modules are retained.
The MIT license notice from the canonical Validator is included here.
