# Home and Dataset acquisition implementation — 2026-10-07

Status: **POST-ACCEPTANCE IMPLEMENTATION / HUMAN BROWSER ACCEPTANCE PENDING**

## Product boundary

Home is the startup surface and primary Dataset acquisition entry point. It
offers Continue Editing only for a saved browser-local workspace that can be
recovered, New Dataset, Open E2R Dataset, and Open Sample Dataset. The
browser-local workspace supports continuity in this browser profile; E2R JSON
is the portable Dataset artifact. Workspace Backup/Restore is not offered.

The workspace keeps a Home navigation action. Its More menu retains Open E2R
Dataset as secondary access and Export E2R JSON as the separate portable
operation. Acquiring a new, file, or sample Dataset uses the existing
loss-confirmation boundary when Dataset changes, pending authoring, or degraded
memory-only state could be lost. Cancel preserves the active workspace;
explicit discard switches to the incoming Dataset. Existing beforeunload and
degraded/unsaved behavior remains authoritative.

## Sample source

The bundled `samples/ashen-crown.en.e2r.json` is byte-for-byte copied from
`e2r-spec/examples/ashen-crown.en.e2r.json` (SHA-256
`6dc26f6f8c848be464e3d040fbb10284c6e5b309148ac57cc97a60b0afd31437`). The
canonical E2R-SPEC sample and its [provenance record](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/docs/public-samples/public-sample-provenance.md)
remain authoritative. This implementation adds no sample facts or metadata.

## Verification boundary

This implementation is post-Acceptance source work. Functional Human
Acceptance remains attached to source `b9a8e1fee6499c191c66033296e98965d777684e`;
Workspace Backup/Restore removal has its separate Human-accepted source
`34f72fad67b9d59b011dbad3880ff0f5a09a0f45`. Home behavior is not Human
accepted until a separate browser review. Automated and Codex-operated browser
checks should be reported as such and must not change either historical
acceptance boundary. Real-browser storage-failure injection remains **NOT RUN**
unless independently performed.

## Current implementation evidence

The implementation is an uncommitted working tree based on local `main`
`3c02b2e1acabc8e4ca7216879c22d660b5a5fd34`.

- `npm run check`: **PASS**; 21 application modules syntax-checked and 64/64
  tests passed. `git diff --check`: **PASS**.
- The bundled Ashen Crown Dataset passes the vendored production Validator
  without diagnostics and retains its canonical SHA-256 above.
- Codex-operated Microsoft Edge review used the isolated origin
  `http://127.0.0.1:4181/`; the existing `http://localhost:4181/` browser-local
  workspace was left untouched. At startup, Continue Editing was absent when
  no workspace existed. New Dataset created a clean empty Dataset and made it
  recoverable; reload returned to Home and Continue Editing reopened it. The
  Ashen Crown action opened the titled 10-Entity Dataset, and reload followed
  by Continue Editing restored it.
- Open E2R Dataset selected the bundled E2R file through the native file
  chooser. Existing changed-work confirmation appeared; Cancel returned to
  Home, and Continue Editing restored the unchanged 11-Entity, not-exported
  workspace. The explicit discard action was not activated.
- At 390px, Home controls remained full-width and reachable without visible
  horizontal overflow or clipping. Keyboard Tab reached the Sample action;
  Enter opened the same replacement confirmation, Escape cancelled it, and
  focus returned to the Sample action.

These are automated and Codex-operated browser observations, not Human Browser
Acceptance. Human review should still confirm the intended Home wording and
visual hierarchy, actual file-open success after explicit replacement, and
New / Sample replacement behavior. Browser-storage write-failure injection,
screen-reader review, and broader physical-device coverage remain **NOT RUN**.

## Cross-App shell, Footer, and Credits follow-up - 2026-10-07

The Home presentation was aligned to the shared shell geometry present in the
current NarrativeLine and LiaisonScape source: a full-width header and footer,
a centered single-column start surface, and peer acquisition actions without a
special filled Continue action or enclosing Home card. Workspace keeps the
same header/footer geometry while retaining its existing controls and
acquisition behavior. The footer descriptor uses the established responsibility
of comparing E2R Entities; it does not claim a release or additional capability.

At this checkpoint, the Credits dialog followed the sibling applications'
visible metadata pattern only where current facts were available: the working
application name, the repository owner as creator, and links to the application
and specification repositories. It omitted release version/date fields
because no version or release event had been established. Explicit Close,
Escape, backdrop dismissal, focus containment, background inertness, and return
to the Credits opener are implemented. No locale system or localized Credits
set was added.

Source references inspected: NarrativeLine `src/components/AppFrame.tsx`,
`src/components/ModalDialog.tsx`, and `src/index.css`; LiaisonScape
`src/App.tsx`, `src/components/CreditsDialog.tsx`, and `src/styles.css`.

Human-confirmed shell differences were corrected in a bounded follow-up: Home's
application surface is white while the workspace editor retains its gray
surface; the Footer descriptor and Credits control use the shared 18px/145%
Footer typography and 40px, 8px 12px control sizing; Credits identifies the
formal product name as `ParameterPlotter`. The sibling CSS has a later,
NarrativeLine-specific 36px/15px ordinary-control density override for its
Credits button, while LiaisonScape retains the shared 40px baseline; this
correction follows the common baseline rather than that app-specific override.

Local verification: `npm run check` **PASS** (22 syntax-checked application
modules, 65/65 tests); `git diff --check` **PASS**. Codex-operated Edge review
at ordinary width confirmed Home and workspace shell/Footer rendering, Credits
content, background inertness, focus containment, Escape return, and backdrop
dismissal. The available browser tab surface did not expose a viewport resize
control, so this follow-up's narrow-width visual review is **NOT RUN**. Human
Browser Acceptance remains pending; these checks do not change either prior
acceptance revision. No Dataset content was changed in the isolated
`127.0.0.1:4181` origin.

## Bounded shell correction - 2026-10-07

The Human-confirmed Home/footer differences are corrected without changing Home
acquisition or Credits interaction: Home now has a white application surface,
the workspace retains its gray surface, the footer descriptor and Credits
button use the shared 18px/145% typography and 40px minimum-height, 8px 12px
padding baseline, and Credits shows `ParameterPlotter` as the current identity.
The current NarrativeLine stylesheet has a later app-specific 36px/15px
ordinary-control override for its Credits button; LiaisonScape retains the
shared 40px baseline, which is the common base treatment used here.

Automated verification: syntax checks and 66/66 tests **PASS**;
`git diff --check` **PASS**. Codex-operated Edge review at 1200px viewport width
confirmed the white Home, Footer descriptor/button typography and size, formal
Credits identity, and Escape dismissal with focus returned to its opener.
Credits remains a 448px dialog at this width. Narrow viewport review was **NOT
RUN** because the available browser control surface exposes no viewport resize
operation. Human Browser Review remains pending; this correction does not
change the Functional Human Acceptance revision.

## Cross-App type scale and Credits refinement - 2026-10-07

Current source references: NarrativeLine `src/index.css` and
`src/components/AppFrame.tsx`; LiaisonScape `src/styles.css` and
`src/components/CreditsDialog.tsx`. Both set a desktop 18px/145% base and
reduce the root to 16px at widths up to 1024px. Both also apply the desktop
ordinary-control scale of 36px minimum height, 5px 9px padding, 4px radius,
15px font, and 120% line height to header actions, Home actions, Footer Credits,
and dialog action controls. Their responsive Footer Credits treatment differs:
LiaisonScape restores a 40px target while NarrativeLine retains the compact
rule. ParameterPlotter uses the 40px responsive Footer target, while its
dialog Close remains compact.

ParameterPlotter's legacy 15px root was changed to 18px/145%, with a 16px root
at widths up to 1024px. This changes `rem`-based text and spacing throughout
the Workspace, so the existing saved Profile workspace was spot-checked in
Edge at 1200px: the major surface stayed usable, there was no page-wide
horizontal overflow, and its measured Workspace height remained about 812px
(previously about 814px). Header actions now follow the shared compact scale.
Home actions also use that ordinary scale. Home remains white and Footer
descriptor remains 18px/145%.

The Credits dialog now uses the shared 28rem maximum width, 16px padding, 6px
corners, 24px heading, one-line metadata rows, and 16px separation before the
Close action. Current evidence supports `Application: ParameterPlotter`,
`Creator: sukoyaka-dopeness`, and the existing repository links. No first
release or update date is published, there is no package version or tag, and
the current repository does not establish an application-specific
acknowledgement sentence. Those fields remain omitted rather than inferred;
their eventual content is a Human decision.

Verification: `npm run check` **PASS** (22 syntax-checked modules, 66/66 tests);
`git diff --check` **PASS**. Codex-operated Edge review at ordinary width
confirmed Home, Footer, Workspace, and Credits. Credits Escape dismissal and
opener focus restoration passed. The available browser interface has no
viewport-resize operation, so narrow-width browser review is **NOT RUN**.
Human Browser Review remains pending, and Functional Human Acceptance remains
anchored to its prior accepted revision.

## Human-selected Home copy - 2026-10-07

The current Home copy is now `Get Started` with the description
`Compare E2R Entities across Dimensions.` The earlier browser-recovery and
portable-export explanation has been removed from Home; those responsibilities
remain available in their existing application flows. The four acquisition
actions remain Continue Editing (only when recoverable work exists), New
Dataset, Open E2R Dataset, and Open Sample Dataset · The Ashen Crown. This
current correction supersedes earlier Home-copy snapshots in this document;
those entries remain as historical records of the prior state.

The sibling-app shell and type-scale references remain NarrativeLine
`src/index.css` / `src/components/AppFrame.tsx` and LiaisonScape
`src/styles.css` / `src/components/CreditsDialog.tsx`. Their shared 18px/145%
base typography, 36px/15px compact controls, and one-line Credits metadata
remain the visual baseline used here. ParameterPlotter Credits retains only
metadata supported by its current authority: `Application: ParameterPlotter`,
`Creator: sukoyaka-dopeness`, and the existing repository links. No Product
version, First release date, Updated date, or acknowledgement sentence is
published. The available records establish source publication and source
changes, but do not define these Credits values as Product metadata; adding
them requires Human direction rather than inference.

Edge review at the current ordinary viewport confirmed the updated Home
heading and description, absence of the removed recovery/export paragraph, and
all four acquisition controls. Narrow viewport review remains **NOT RUN**
because the available browser control does not expose viewport resizing.
Automated checks for this copy correction are recorded with the current source
verification; Functional Human Acceptance remains anchored to its previously
accepted revision.

## Footer descriptor and Credits review correction - 2026-10-07

The Footer descriptor is a `<small>` element. Same-viewport Edge measurements
showed that NarrativeLine and LiaisonScape render their Footer parents at
18px/26.1px while the `<small>` descriptor computes to 15px/26.1px. Both
therefore retain the browser's `small` sizing (approximately 0.833em). The
ParameterPlotter rule had forced the child to 18px through `font-size: inherit`,
so it did not match the sibling apps' actual descriptor scale. The rule now
sets the descriptor to 15px and inherits line-height; it no longer relies on
the browser's default size behavior.

The exact Human-selected gratitude sentence was absent from the current
`application-shell.js`; the local server was not serving a stale checkout. The
listener on port 4181 is `node serve.mjs`, which reads files from the server
script's directory on each request and sends `Cache-Control: no-store`.
Responses for `index.html`, `main.js`, `home-screen.css`, `home-screen.js`, and
`application-shell.js` matched the current worktree contents. The gratitude
sentence has been added to the Credits metadata sequence. Version, First
release, and Updated remain omitted.

Automated verification: `npm run check` **PASS** (22 syntax-checked modules,
66/66 tests); `git diff --check` **PASS**. Fresh Edge rendering confirmed the
15px descriptor against both sibling apps and confirmed the gratitude text in
Credits. The Human Browser Review should reload `http://localhost:4181/` to
replace any already-open page state; these checks do not constitute Human
acceptance.

## Current selected contract and checkpoint verification - 2026-10-07

The current Home uses `Get Started` and `Compare E2R Entities across
Dimensions.` Ordinary acquisition actions use a 12px gap; the Sample action
has an additional 12px top margin, matching the current NarrativeLine and
LiaisonScape grouping. The existing Sample wording is unchanged.

Credits identifies `ParameterPlotter`, `sukoyaka-dopeness`, the selected
gratitude sentence, and both repository links. Version, First release, and
Updated remain absent.

The selected backdrop contract is implemented in the local NarrativeLine and
ParameterPlotter source: normal `rgba(8, 6, 13, 0.28)`, dismissible hover
`rgba(8, 6, 13, 0.34)`, no hover for nondismissible backdrops, and no hover
feedback while the pointer is over the dialog. LiaisonScape's current source
already provides the reference treatment and required no change. Existing
dismissal behavior and each application's stacking responsibility are
unchanged.

Current automated verification: ParameterPlotter syntax checks and 67/67
tests **PASS**; NarrativeLine 349/349 tests, lint, and build **PASS**;
LiaisonScape 656/656 tests, lint, and build **PASS**. Codex browser inspection
covered the Home and Credits surfaces at the checked viewport. The full
real-browser audit of every dialog, modal, and drawer remains **DEFERRED**;
normal and hover computed styles have not been individually verified at every
served overlay. These implementation and machine/browser checks are not Human
Browser Acceptance.
