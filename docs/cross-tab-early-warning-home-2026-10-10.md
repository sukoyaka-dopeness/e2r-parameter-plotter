# Cross-Tab Early Warning on Home

Status: Implemented / automated checks pass / Human Browser Acceptance pending

## Contract

ParameterPlotter Home now reports loss-sensitive work in another live
ParameterPlotter tab before a user starts an acquisition. The notice is
informational and does not bypass the existing write-lock, replacement, or
stale-revision checks. It advises the user to save or discard work in its
originating tab and export any Dataset they need before retrying.

A clean peer tab produces no strong warning. If peer state cannot be checked,
Home reports that uncertainty without asserting that work exists. Status is
derived from ParameterPlotter's own tab markers and Web Locks namespace;
other E2R application namespaces do not count as ParameterPlotter peers.
Same-app storage changes and window focus refresh the Home notice.

## Verification boundary

Automated tests cover active, clean, unrelated-app, and unverifiable peer
states, both locales, and the Home notice content. `npm.cmd run check` passed:
36 application modules and 155/155 tests.

Codex also checked the Home screens in an isolated Edge profile against the
existing local dev servers. In two same-origin tabs, synthetic coordination
locks and markers caused the matching app's warning to appear and clear;
sibling-app namespace markers did not trigger it. At 1280px and 390px, the
NarrativeLine Home content remained centered (zero measured center offset),
and neither app produced horizontal overflow. The profile used no Dataset
editing and was removed afterward. This verifies bounded UI/status behavior,
not the replacement flow or Human acceptance.

Human Browser Acceptance remains pending for review of the warning wording,
actual unsaved-work coordination, narrow-width wrapping, and same-origin
sibling-app coexistence. Existing replacement safety and public NO-GO remain
unchanged.
