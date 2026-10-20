# ParameterPlotter Dataset Handoff v0

Date: 2026-10-09

Current bounded status: **Hub Handoff / Local Interoperability — HUMAN ACCEPTED (BOUNDED)** (Human decision 2026-10-20). See the exact scope below.

Status at the 2026-10-09 implementation checkpoint: **IMPLEMENTED / AUTOMATED CHECKS PASS / HUMAN BROWSER ACCEPTANCE PENDING**.

Source status at this checkpoint: local implementation committed; Human Browser
Acceptance was pending and the public application revision was not deployed.

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
Dataset-authored title text shown in the replacement confirmation is escaped
and excluded from UI locale translation.

## Local review

`npm.cmd run check` covers syntax and the unit suite. Local browser review can
use the standard ParameterPlotter server (`npm.cmd start`, default
`http://localhost:4180/`) and a local Dataset fixture server with CORS enabled.
Local HTTP handoffs are deliberately restricted to loopback hosts.

At this implementation checkpoint, the feature was not a public deployment.
The proposed broader Human review covered four Hub EN/JA → ParameterPlotter
sample paths, replacement confirmation/cancel, failure safety, and the existing
local Open flow. The later Human decision below accepts a specified local
subset; it does not claim that every item in this earlier review plan ran.
Codex's Computer Use helper failed during initialization in this checkpoint;
no Codex-operated browser PASS is claimed.

## Local Hub Handoff — bounded Human acceptance checkpoint, 2026-10-20

**Human decision: Hub Handoff / Local Interoperability — HUMAN ACCEPTED
(BOUNDED).** The decision accepts the Human-reported local Hub-origin review
below. It does not close all Startup Handoff v0 cases, ParameterPlotter Product
Formal Acceptance, Cross-Context Workspace Safety, or Public Release.

**Human Browser Evidence:** In Windows Edge Guest, Human used local Hub
`http://127.0.0.1:5518/e2r-hub/` and ParameterPlotter
`http://127.0.0.1:5517/` and reported PASS for these operations:

1. Hub EN handed off *The Ashen Crown*. ParameterPlotter displayed the English
   UI and the expected Dataset name and content: 10 Entities, 7 Dimensions,
   70 Assessments.
2. Hub JA handed off *灰冠の王国*. ParameterPlotter displayed the Japanese UI and
   the expected Dataset name and content: 10 Entities, 7 Dimensions,
   70 Assessments. UI locale and Dataset-authored language remain distinct;
   these observations do not establish automatic translation.
3. Human changed and locally saved the title of an existing Workspace without
   exporting it, closed its Owner tab, started a different Dataset handoff from
   Hub, and chose Cancel in the replacement confirmation. Continue Editing
   resumed the prior Workspace with its Dataset name and content retained.
4. Human supplied a nonexistent local Dataset URL, observed a retrieval error,
   and used Continue Editing to resume the original Dataset. The existing
   Workspace had not been replaced.

This is Human's browser operation report, not an independent capture of every
network request, localStorage byte, or same-session action. The counts and
Dataset identity are the reported UI observations; no newly inspected Export
JSON or storage-byte comparison is claimed for this checkpoint. The prior
direct ParameterPlotter Lighthouse/Cedar route observations in the
[E2R-SPEC review preparation](../../e2r-spec/docs/cross-app/hub-to-parameterplotter-startup-handoff-human-browser-review-preparation-2026-10-09.md)
remain separate from these Hub-origin Ashen Crown operations.

**Supporting evidence, kept separate:** This document's earlier source audit
describes startup-only acquisition, locale preference, the normal replacement
path, and failure behavior. Existing automated checks and Codex browser/DOM
records cover their stated cases in their own checkpoints; they are not the
Human actions above. The earlier Computer Use initialization failure remains
a historical limitation of the 2026-10-09 implementation checkpoint. No new
Codex Browser or automated test result is asserted by this decision.

**Excluded conditions:** The Human review used local loopback HTTP, not public
HTTPS, deployed Hub/ParameterPlotter, public Dataset revisions, or public CORS.
It did not test Cancel with an unapplied draft in a second editable tab while
an Owner remained open. Under Single Active Editor, that is not the normal
two-editor route; the reviewed replacement began after the prior Owner closed.
Existing unapplied-draft protection evidence belongs to its own acceptance
records and is not converted into Hub Handoff Human evidence here. Lighthouse
and Cedar Hub-origin actions, a saved-recipient locale conflict, local Open,
Reload/Back/Forward behavior, malformed or Validator-invalid input, other
failure modes, and other browsers are not added to this bounded acceptance.
The adopted Handoff and Single Active Editor contracts are unchanged.

**Later Product decision:** At this local Handoff checkpoint, Product Formal
Acceptance was **PENDING**. Human subsequently accepted the [integrated local
Product within its recorded bounds](./product-formal-acceptance-decision-packet-2026-10-20.md#formal-human-decision--approved-2026-10-20) on 2026-10-20. Human decided that
unreviewed local Handoff paths are outside the bounded Product acceptance and
are not automatically required gates. That decision does not convert them to
Human Browser PASS or expand the Handoff acceptance above. The comprehensive
Every-Overlay audit remains **DEFERRED**; overall Cross-Context Workspace Safety
remains **PENDING**. Historical Tab C remains root-cause **UNRESOLVED** and is
not an independent Product Acceptance blocker under the existing Human
decision. Public HTTPS/CORS Handoff, deployment, and post-deployment
verification remain separate release gates; ParameterPlotter Public Release
remains **NO-GO**. Dimension Assessment `0.2.0` remains a Human-adopted
Candidate, not Stable. The E2R-SPEC Roadmap's earlier Hub sample-acquisition
PENDING row and Product status still need a separate authorized sync that
preserves the broader unreviewed and public gates.
