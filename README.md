# ParameterPlotter

Canonical application source: [`e2r-parameter-plotter`](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter). This repository owns the application runtime and its application-level tests. E2R Core, Extensions, schemas, Validator, and the specification remain owned by [e2r-spec](https://github.com/sukoyaka-dopeness/e2r-spec).

The accepted Candidate B first slice remains a historical checkpoint. The latest committed successor source checkpoint is `111be04898f354efe92856dfdd355ca89845fa59`; it has not been pushed, and the published repository still contains the Candidate B first slice. Functional Human Acceptance applies specifically to source commit `b9a8e1fee6499c191c66033296e98965d777684e`. Later source corrections, including the current local source, are not covered by that acceptance. The successor supports direct Dataset Entity authoring and Dimension Assessment Candidate 0.1.0 as portable Dataset data, with Validator-gated editing and E2R JSON Export. Human's current Product direction retains browser-local persistence/recovery and E2R Dataset JSON as the portable save/exchange path, and removes user-managed Workspace Backup/Restore from the initial Product. The current local working tree implements this removal; it has not yet been committed or newly Human-accepted. The Candidate is Human-adopted but not Stable. See the [successor implementation status](docs/successor-first-implementation.md), the [2026-10-07 Product/UI completion audit snapshot](docs/product-ui-completion-audit-2026-10-07.md), and the [historical first-slice boundary](docs/first-slice-boundary.md).

## Run locally

Use Node.js with no package installation required:

```sh
npm start
```

The server prints its local URL (default <http://localhost:4180>). If that
port is occupied, set `PORT` to another available port before `npm start`;
the current successor review server is at <http://localhost:4181>. The local
source supports importing, authoring, validating, and exporting an E2R Dataset.
Browser-local persistence supports same-profile continuity; E2R JSON Export is
the portable Dataset operation. Use a local E2R Dataset for review; the
application does not write changes back to the source file you opened.

## Verify

```sh
npm run check
```

The focused tests cover the four views, Candidate payload semantics, Entity and Dimension authoring, Assessment rescale, Validator eligibility, unknown Extension preservation, Dataset Export baseline, local persistence, local persistence failure, replacement and unload protection, and no-migration behavior. They are supporting machine evidence, not Human acceptance of post-Acceptance corrections to the successor. The earlier Candidate B result is recorded in the [historical acceptance result](docs/first-slice-human-acceptance-2026-10-04.md).
The GitHub Actions check runs the same command with read-only repository access; it does not deploy or publish the application.

## Source relationship

Prototype 2 remains accepted and closed as a behavioral reference and evidence baseline in e2r-spec. The successor source here now consumes the adopted Dimension Assessment Candidate and the local browser distribution of the E2R Validator. The canonical Validator repository remains the Validator source authority; the vendored snapshot is synchronized from the adjacent checkout by `node scripts/sync-validator-vendor.mjs`. The Prototype directory is not production source authority. See the [Prototype 2 closure evidence](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/research/prototypes/parameterplotter-1/prototype-2-bounded-implementation-result-2026-10-02.md) for its unchanged historical status.

The implementation uses browser-native ES modules and a local static HTTP server. Current responsibilities are separated across application state/value rules, projection rendering, interaction/presentation helpers, and application orchestration. This is a proportionate starting point rather than a framework or portable-model decision.

The source currently stays flat at the repository root by design for this first slice. Reorganize only when concrete navigation, responsibility, or source/test-separation friction appears, and then extract incrementally along the affected responsibilities; no permanent flat layout or fixed directory tree is prescribed. See [the first-slice boundary](docs/first-slice-boundary.md#source-and-implementation-boundary).
