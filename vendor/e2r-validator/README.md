# Vendored E2R Validator browser modules

These ES modules are a browser-loadable snapshot of the canonical
`sukoyaka-dopeness/e2r-validator` source. The Validator repository remains the
source authority; this copy makes the static ParameterPlotter repository
self-contained and keeps validation available to the browser without a build
server, remote CDN, or runtime package installation.

This snapshot matches the browser-loadable modules in Validator commit
`6533e970ddc5d5131a1f39fe88e22d8f6402c416`, which adds Dimension Assessment
Candidate `0.1.0` support. That Validator commit is on its local `main` but is
not yet on the published Validator `main`. Before publishing either repository,
review the source and vendored changes together and rerun
`node scripts/sync-validator-vendor.mjs --check`. Do not update only one copy:
the canonical Validator source and this browser distribution must remain
behaviorally aligned.

`cli.js` is intentionally excluded; all browser library modules are retained.
The MIT license notice from the canonical Validator is included here.
