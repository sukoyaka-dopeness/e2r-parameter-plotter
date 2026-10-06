# Product / UI Completion Audit - 2026-10-07

## Status and source boundary

This is a bounded local readiness audit before any successor source publication.
It does not authorize a push, release, deployment, Pages publication, Hub
listing, or Candidate maturity change.

Functional Human Acceptance remains closed for the tested source revision
`b9a8e1fee6499c191c66033296e98965d777684e`. The workspace-action and
accessibility corrections in source commit `111be04898f354efe92856dfdd355ca89845fa59`
are post-Acceptance work. Automated and Codex browser checks below do not attach
Human Acceptance to that later source.

Dimension Assessment remains Human-adopted Candidate `0.1.0`, not Stable.
Candidate semantics, Validator behavior, Dataset lifecycle policy, and the
separate responsibilities of E2R Dataset Export, browser-local persistence,
and Workspace Backup were not changed.

## Cross-App authority used

The audit compared current local source and documentation for NarrativeLine
(`29b15c09bd91181cbba27dcb5203fec331dae142`) and LiaisonScape
(`b93e9762ca2baa7e29d0dac4b99bb27970f4b618`) with the accepted E2R-SPEC
directions:

- [Dataset acquisition entry-point alignment](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/docs/cross-app/dataset-acquisition-entry-point-alignment.md)
  makes Home the primary Dataset lifecycle entry point and treats workspace
  actions as secondary access.
- [Cross-App editor shell geometry](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/docs/cross-app/cross-app-editor-shell-geometry-v0-design.md)
  preserves brand, application controls, explicit Home on the workspace,
  Header locale, Footer descriptor and Credits, keyboard access, and 40px
  minimum shell controls. It does not mandate shared DOM/CSS or exact breakpoints.
- [Locale startup and recipient preference](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/docs/cross-app/cross-app-locale-startup-v0-recipient-preference-design.md)
  records EN/JA as the E2R application context while leaving application
  startup details distinct.
- [Application recommendations](https://github.com/sukoyaka-dopeness/e2r-spec/blob/main/docs/application-recommendations.md)
  assigns the human-readable Dataset title to `extensions.metadata.title`;
  a display fallback is not Dataset data.
- E2R public-sample provenance and licensing guidance requires an identified
  source, redistribution basis, and sample metadata. It does not authorize
  invented factual Assessments.

The apps share responsibilities, not an interchangeable product layout.
NarrativeLine's Home-first behavior, locale surfaces, Footer/Credits, guides,
and its factual/demo samples informed the comparison. LiaisonScape's Home,
locale and Credits surfaces supplied a second current reference. Neither app's
specific navigation, terminology, authoring model, sample content, nor
release-specific fields were copied into ParameterPlotter.

## Surface inventory

| Surface | Current ParameterPlotter state | Audit outcome |
|---|---|---|
| Header / application identity | Working name, E2R single-user descriptor, Entities and Dimensions workspace utilities | File/lifecycle actions moved into a text-triggered More disclosure. Open is no longer styled as a primary action. Formal name remains undecided. |
| Home / navigation | No Home route; the app opens directly into the current local workspace or empty workspace. Views are Profile, Radar, Quadrant, Matrix. | Home-first Dataset acquisition is the accepted Cross-App direction, but the exact ParameterPlotter Home hierarchy and startup/resume flow need a bounded Human choice. No New Dataset action was added. |
| More / file actions | Open E2R Dataset, Restore Workspace Backup, Export E2R JSON, Download Workspace Backup are secondary actions | All four are grouped in More. File inputs remain outside collapsed disclosure DOM content; existing validation and replacement/restore safety paths are retained. |
| Dataset identity | Displays `extensions.metadata.title`; absent/blank title uses an unsaved “Untitled Dataset” presentation fallback | Read-only display is consistent with authority. No Dataset title editor or new top-level name field was added. Whether title editing belongs in this product remains a Human gate. |
| Dataset / storage status | Dataset Export baseline, browser-local persistence, Workspace Backup are named separately | Status is present, but currently shares a compact topline. A clearer information hierarchy may require a visual choice; no lifecycle semantics were changed. |
| Entity / Dimension / Assessment authoring | Direct Dataset Entity create/edit/delete policy; portable Candidate Dimensions and Assessments; reviewed Rescale | Existing successor behavior and safety were left intact. Candidate 0.1.0 and Relation-blocked Entity deletion remain unchanged. |
| Diagnostics / recovery | Validator errors are diagnostic read-only; warnings are visible; persistence, replacement, pending-draft and Workspace Restore protections exist | No unsupported or opaque data handling was relaxed. Regression suite still covers read-only eligibility, preservation and recovery safety. |
| Locale / language | English-only interface (`lang="en"`); no locale selector or Japanese user guide | No machine-specific ParameterPlotter term set was inferred. EN/JA scope and the labels listed below need Human selection. |
| Footer / Credits | No application Footer or Credits surface; README carries source, repository and MIT license information | Cross-App shell responsibility is documented, but adding the runtime surface and deciding its fields/placement needs a bounded Human choice. No release date was invented. |
| Samples | No built-in Dataset sample in this repository. Repository-wide search found no existing E2R Dataset carrying Dimension Assessment Candidate data suitable for reuse. | A useful four-view sample needs authored values and provenance. No factual values were fabricated and no sample was added. |
| Help / user documentation | README is developer/repository-oriented; no in-app help or EN/JA user guide | User-facing guide scope and language need a decision after the Home flow is selected. |
| Repository / license / attribution | Public repository metadata and MIT license; README describes source ownership and local verification. GitHub Actions checks source but does not deploy. | No repository settings, metadata, workflow, Topics, Website URL, or funding file were changed. |
| Document title / favicon | Document title uses the working name; no favicon | A branded icon should follow a product identity/brand decision. |
| Dialogs / focus | Existing replacement, restore, entity blocker, and Rescale dialogs retain explicit safety behavior and focus handling | Replacement Cancel / Escape now returns to the always-visible More trigger. No confirmation or loss-protection behavior was removed. |
| Keyboard / control semantics | Entities and Dimensions remain buttons; More is a disclosure; View controls are buttons | The browser AX tree previously exposed `aria-pressed` View buttons as checkboxes. They now use `aria-current` for the active view and remain buttons. Escape closes More and restores focus; outside click closes it. |
| Responsive | 390px Codex browser review previously passed for all four visualization views; More has a max-width panel and full-width narrow trigger rule | More was checked in a desktop-sized Edge window only. No 390px review of this new disclosure was available. No new mobile layout claim is made. |
| Cross-view presentation | Existing endpoint-label behavior is covered across Profile, Radar, Quadrant, Matrix and re-render paths | The Human-selected no-label presentation remains numerical only. This audit did not change Candidate semantics or chart values. |

## Workspace action change and verification

The persistent workspace controls are now `Entities`, `Dimensions`, and a
non-primary `More` text disclosure. More contains Open E2R Dataset, Restore
Workspace Backup, Export E2R JSON, and Download Workspace Backup. Read-only
diagnostic mode still disables authoring and Dataset Export while retaining
acquisition and backup actions. Unsupported Candidate authoring still disables
Dimension authoring without blocking otherwise safe Dataset Export.

Dataset and Workspace Restore file inputs stay outside the closed disclosure,
so the user-activated file-picker click does not target a descendant hidden by
collapsed details. Existing candidate parsing, Validator eligibility,
replacement confirmation, Cancel, explicit Discard, download behavior,
artifact separation, and error handling remain on their existing code paths.
Opening a selected file and completing an actual native file picker was not
tested in this UI audit.

At desktop-sized Edge, the isolated audit page rendered the expected button
order and a collapsed More disclosure. Earlier in this same audit, keyboard
Tab reached the first More action, Escape closed the disclosure and returned
focus to More, and outside click closed it. The Edge adapter's accessibility
snapshot did not expose the menu-item names although their visible labels were
present; this is an evidence limitation, not a screen-reader PASS. A real
screen-reader check was not performed.

Automated verification: `npm run check` passes syntax checks and 54/54 tests;
`git diff --check` passes. The new regression coverage checks action order,
non-primary markup, stable file-input placement, diagnostic/unsupported
eligibility, file-picker routing, outside dismissal, and Escape handling.
Browser-local storage write-failure injection remains NOT RUN in a real
browser, as recorded in the existing acceptance evidence.

## Human decisions still required

1. **ParameterPlotter Home and startup lifecycle.** Select the Home contents
   and entry behavior: how Continue/Resume relates to Open E2R Dataset and
   Restore Workspace Backup, whether Home is shown on every launch or is a
   reachable top-level surface, and where guide/Credits/locale live. The
   existing Cross-App principle says Home owns primary acquisition; it does
   not decide this app's exact ordering or resume behavior. New Dataset was
   not added and remains unselected. No suitable Candidate sample exists yet.
2. **EN/JA product-language scope and terms.** Decide whether this successor
   surface must ship both locales before external use and select ParameterPlotter
   wording for Entity / エンティティ, Dataset, Dimension, Assessment,
   Profile, Radar, Quadrant, Matrix, Workspace Backup / Restore, and More /
   その他. The app has no JA UI or guide today.
3. **Sample content and provenance.** Decide whether a built-in sample is
   required, whether it is explicitly fictional/demo or factual, and who
   supplies its Entities, Dimensions, Assessment values, attribution and
   redistribution basis. Existing samples cannot be repurposed as assessed
   comparison examples without evidence.
4. **Footer / Credits and product identity.** Decide runtime Footer/Credits
   scope and its placement/content. Repository, source and MIT license are
   available facts; first-release/updated dates, formal product name, version,
   release identity and branded favicon are not. Do not fill those with guesses.
5. **Dataset-title authoring.** The title display correctly reads existing
   `extensions.metadata.title` and uses a presentation-only fallback. Decide
   separately whether title editing is part of Dataset authoring and, if so,
   its blank/preservation rules; no title edit was implemented.
6. **Publication gates.** A new exact source push, deployment host/public URL,
   release identity, Candidate Stable review, Hub listing, and cross-consumer
   interoperability require later explicit decisions/authorization. This
   audit does not approve any of them.

These decisions are separate from the accepted source baseline and from the
already Human-decided Candidate, persistence/recovery, replacement, Entity
deletion, and authoring policies.
