# ParameterPlotter

Canonical application source: [`e2r-parameter-plotter`](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter). This repository owns the application runtime and its application-level tests. E2R Core, Extensions, schemas, Validator, and the specification remain owned by [e2r-spec](https://github.com/sukoyaka-dopeness/e2r-spec).

The published application version is **0.1.1**. It is independent of the Human-adopted, non-Stable Dimension Assessment Specification Candidate `0.2.0`. ParameterPlotter supports Dataset Entity, Dimension, and Assessment authoring, Validator-gated editing, four comparison views, browser-local continuity, and portable E2R JSON Export. The [0.1.1 publication and bounded release closure](docs/parameterplotter-0.1.1-publication-and-release-closure-2026-10-24.md), [local Product acceptance](docs/product-formal-acceptance-decision-packet-2026-10-20.md), and [earlier Credits M2-W closure](docs/credits-release-date-follow-up-2026-10-21.md) have separate scopes. The earlier [Candidate B first slice](docs/first-slice-boundary.md) and [successor functional checkpoint](docs/successor-human-acceptance-2026-10-06.md) remain historical, bounded evidence.

## Run locally

Use Node.js with no package installation required:

```sh
npm start
```

The server prints its local URL (default <http://localhost:4180>). If that
port is occupied, set `PORT` to another available port before `npm start`.
The local source supports importing, authoring, validating, and exporting an E2R Dataset.
Browser-local persistence supports same-profile continuity; E2R JSON Export is
the portable Dataset operation. Use a local E2R Dataset for review; the
application does not write changes back to the source file you opened.

## Verify

```sh
npm run check
```

The focused tests cover the four views, Candidate payload semantics, Entity and Dimension authoring, Assessment rescale, Validator eligibility, unknown Extension preservation, Dataset Export baseline, local persistence, local persistence failure, replacement and unload protection, and no-migration behavior. They are supporting machine evidence, not Human acceptance of post-Acceptance corrections to the successor. The earlier Candidate B result is recorded in the [historical acceptance result](docs/first-slice-human-acceptance-2026-10-04.md).
The GitHub Actions check runs the same command with read-only repository access. A separate main-push workflow builds and deploys the Pages artifact; publishing requires separate Human authorization and deployment verification.

## Published maintenance release

The public application is at <https://sukoyaka-dopeness.github.io/e2r-parameter-plotter/>. ParameterPlotter **0.1.1** was published on **2026-10-24 JST**. Its Credits show **First release: 2026-10-21** and **Updated: 2026-10-24**. Human formally accepted the publication within the [recorded browser and technical evidence bounds](docs/parameterplotter-0.1.1-publication-and-release-closure-2026-10-24.md); the Maintenance Release is **PUBLICATION ACCEPTED — BOUNDED / CLOSED (BOUNDED)**. The earlier [M2-W record](docs/credits-release-date-follow-up-2026-10-21.md) retains its separate Credits closure.

This release includes Home Sample information, locale-matched links to the English and Japanese [user guides](docs/user-guide-en.md) ([日本語](docs/user-guide-ja.md)), restrained GitHub Sponsors and Ko-fi links, and replacement-dialog copy corrections. Human had separately accepted the [local Maintenance Candidate within recorded bounds](docs/home-guide-funding-maintenance-human-review-checkpoint-2026-10-23.md). The guides are repository Markdown files, outside the Pages artifact; Home links target their GitHub `main` pages. A later main push starts the Pages workflow and requires separate Human authorization.

## Dimension Assessment Candidate 0.2.0 implementation checkpoint

The application supports exact Dimension Assessment Candidate `0.1.0` and
`0.2.0`. New Datasets use `0.2.0` when the first Dimension is saved; existing
`0.1.0` Datasets require a confirmed explicit upgrade before adding optional
Dimension Descriptions. See the [implementation checkpoint](docs/candidate-0.2.0-parameterplotter-implementation-2026-10-08.md)
for scope, verification evidence, and Human Browser Acceptance boundaries.

ParameterPlotter also supports the startup-only Dataset Handoff v0
`datasetUrl` fragment alongside local **More → Open E2R Dataset**. See the
[Handoff implementation checkpoint](docs/dataset-handoff-v0-implementation-2026-10-09.md)
for URL safety, locale conflict behavior, replacement protection, and local
review boundaries.

## Source relationship

Prototype 2 remains accepted and closed as a behavioral reference and evidence baseline in e2r-spec. The application source here consumes the adopted Dimension Assessment Candidate and the local browser distribution of the E2R Validator. The canonical Validator repository remains the Validator source authority; the vendored snapshot is synchronized from the adjacent checkout by `node scripts/sync-validator-vendor.mjs`. The Prototype directory is not production source authority. See the [Prototype 2 closure evidence](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/research/prototypes/parameterplotter-1/prototype-2-bounded-implementation-result-2026-10-02.md) for its unchanged historical status.

The implementation uses browser-native ES modules and a local static HTTP server. Current responsibilities are separated across application state/value rules, projection rendering, interaction/presentation helpers, and application orchestration. This is a proportionate starting point rather than a framework or portable-model decision.

The application source currently stays flat at the repository root. Reorganize only when concrete navigation, responsibility, or source/test-separation friction appears, and then extract incrementally along the affected responsibilities; no permanent flat layout or fixed directory tree is prescribed. See [the historical first-slice boundary](docs/first-slice-boundary.md#source-and-implementation-boundary).
