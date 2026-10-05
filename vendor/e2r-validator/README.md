# Vendored E2R Validator browser modules

These ES modules are a browser-loadable snapshot of the canonical
`sukoyaka-dopeness/e2r-validator` source. The Validator repository remains the
source authority; this copy makes the static ParameterPlotter repository
self-contained and keeps validation available to the browser without a build
server, remote CDN, or runtime package installation.

The snapshot was synchronized from the local Validator checkout while
Dimension Assessment Candidate 0.1.0 support was being implemented. The
Validator working tree was not committed, so this snapshot is not yet tied to
a published Validator revision. Before either repository is committed, review
both diffs together and rerun `node scripts/sync-validator-vendor.mjs --check`.
Do not update only one copy: the canonical Validator source and this browser
distribution must remain behaviorally aligned.

`cli.js` is intentionally excluded; all browser library modules are retained.
The MIT license notice from the canonical Validator is included here.
