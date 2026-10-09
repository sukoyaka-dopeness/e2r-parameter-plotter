# ParameterPlotter Dataset Handoff v0

Date: 2026-10-09

Status: **IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**

Source checkpoint: `7283f2a8c2d17fe20b4975dd6dedb75fb33c12b7` plus this
uncommitted implementation slice.

## Behavior

ParameterPlotter inspects `datasetUrl` once at startup. It accepts one
non-empty absolute HTTPS URL without embedded credentials. For local
development only, an HTTP URL whose host is `localhost`, `127.0.0.1`, or
`[::1]` is allowed when ParameterPlotter itself is served from loopback HTTP.
The browser fetch omits credentials. Network, HTTP, redirect downgrade, JSON,
or Dataset-opening failures leave the existing Dataset untouched and show an
error on Home; the fragment remains available for retry or inspection.

After JSON parsing, the handoff uses the same `receiveDataset` and
`fresh(readDataset(...))` path as local import. Candidate diagnostics and
read-only handling therefore remain the normal ParameterPlotter behavior. If
existing loss-sensitive work is present, the existing replacement confirmation
is shown. Cancel keeps the prior workspace. Accepting a Handoff retains its
`datasetUrl` fragment. Accepting a local file, New Dataset, or bundled sample,
or explicitly choosing Continue after a failed handoff, removes only
`datasetUrl` and preserves `locale` and unknown fragment entries.

The existing locale preference remains authoritative when it conflicts with
the Hub's requested `locale`: the existing locale conflict choice is shown
before any Dataset request begins. Once resolved, startup acquisition proceeds
once. Dataset-authored language is never translated by this UI preference.
The existing More → Open E2R Dataset file flow remains available.

## Local review

`npm.cmd run check` covers syntax and the unit suite. Local browser review can
use the standard ParameterPlotter server (`npm.cmd start`, default
`http://localhost:4180/`) and a local Dataset fixture server with CORS enabled.
Local HTTP handoffs are deliberately restricted to loopback hosts.

The feature is not a public deployment. Human Browser Acceptance remains
pending until the four Hub EN/JA → ParameterPlotter sample paths, replacement
confirmation/cancel, failure safety, and existing local Open flow are reviewed.
