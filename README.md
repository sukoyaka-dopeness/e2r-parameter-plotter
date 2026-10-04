# ParameterPlotter (working name)

Canonical application source: [`e2r-parameter-plotter`](https://github.com/sukoyaka-dopeness/e2r-parameter-plotter). This repository owns the application runtime and its application-level tests. E2R Core, Extensions, schemas, Validator, and the specification remain owned by [e2r-spec](https://github.com/sukoyaka-dopeness/e2r-spec).

This is the first single-user application slice selected by Human. It imports an E2R Dataset for read-only comparison and keeps Dimensions, temporary Entities, and comparison values in browser-tab session storage. Ending the session may erase that temporary work; cross-session durability and recovery are not provided. The notice is shown in the application shell. Dataset write-back and export, shared workspaces, accounts, authentication, cloud persistence, and a portable Observation or Dimension/value contract are outside this slice.

## Run locally

Use Node.js with no package installation required:

```sh
npm start
```

Open <http://localhost:4180>. Import an E2R Dataset JSON file from your computer. The app reads the file in memory; it does not edit or export that Dataset.

## Verify

```sh
npm run check
```

The focused tests cover numeric range mapping and candidate generation, integer-only authoring, decimal presentation, Matrix row order, Profile random generation, Radar drag geometry, and the boundary between imported Dataset content and application-local values. They are supporting machine evidence, not Human acceptance.
The GitHub Actions check runs the same command with read-only repository access; it does not deploy or publish the application.

## Source relationship

Prototype 2 remains the accepted behavioral reference and evidence baseline in e2r-spec. This application source selectively carries forward its browser runtime responsibilities and focused tests to preserve the Human-accepted bounded behavior; the Prototype directory is not the production source of truth. Production-specific ownership, the visible session-lifetime notice, this local-only server entry, and this repository's verification boundary live here. Feature changes should be made here and checked against the [Prototype 2 closure evidence](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/research/prototypes/parameterplotter-1/prototype-2-bounded-implementation-result-2026-10-02.md) as a behavioral reference.

The implementation uses browser-native ES modules and a local static HTTP server. Current responsibilities are separated across application state/value rules, projection rendering, interaction/presentation helpers, and application orchestration. This is a proportionate starting point rather than a framework or portable-model decision.

The source currently stays flat at the repository root by design for this first slice. Reorganize only when concrete navigation, responsibility, or source/test-separation friction appears, and then extract incrementally along the affected responsibilities; no permanent flat layout or fixed directory tree is prescribed. See [the first-slice boundary](docs/first-slice-boundary.md#source-and-implementation-boundary).
