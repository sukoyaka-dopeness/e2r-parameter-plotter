# GitHub Pages Deployment Preparation

Date: 2026-10-09

Status: **LOCAL DEPLOYMENT CONFIGURATION PREPARED / NOT DEPLOYED**

## Target and routing

The repository is `sukoyaka-dopeness/e2r-parameter-plotter`, so the expected
GitHub project Pages address is
`https://sukoyaka-dopeness.github.io/e2r-parameter-plotter/`. The repository's
Pages setting and live address were not inspected or changed. Before the first
deployment, GitHub Pages must be configured to use **GitHub Actions** as its
source.

The app is a static ES-module site without a client-side pathname router. Its
HTML, CSS, module imports, icon, and bundled samples use paths relative to the
site root. The Pages builder copies the transitive local module imports, the
four stylesheets, favicon, and both bundled Ashen Crown language files into
`dist/`. It does not copy repository documentation, tests, or source-control
metadata. `.nojekyll` disables Jekyll processing. No generated `dist/` content
is tracked.

The `Deploy ParameterPlotter to GitHub Pages` workflow runs the syntax and
test suite, builds the static artifact, and deploys it. It is configured for
`main` pushes and manual `workflow_dispatch`; therefore a future push to
`main` will deploy automatically once the workflow is present on GitHub. This
checkpoint did not push, dispatch the workflow, change Pages settings, or
publish the site.

## Verification boundary

`npm run check` and `npm run build` verify the local source and artifact.
Serving the generated artifact below `/e2r-parameter-plotter/` can verify
project-subpath paths locally, but does not prove GitHub Pages configuration,
public availability, the deployed revision, or production Handoff CORS.
Those checks require a separately authorized push/deployment and subsequent
public verification.

Before production Hub links are enabled, deploy the ParameterPlotter site
first and verify its HTTPS URL. The Hub workflow is locally configured with
that expected app URL; the Hub deployment remains a separate future event.
