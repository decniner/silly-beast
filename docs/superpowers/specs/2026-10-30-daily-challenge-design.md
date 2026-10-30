# Silly Beast Daily Workshop Challenge

## Intent

Give players a fresh, repeatable reason to revisit the browser game and an easy way to invite a friend into the same run. Every UTC date has one shared course, body and movement style. A challenge link reproduces that exact setup.

## Goals

- Show today's course and build in a short challenge panel accessible from the workshop on desktop and mobile.
- Generate the same challenge for every player from its `YYYY-MM-DD` UTC date, with no network request or account.
- Let a player run, retry, watch a replay and share a link containing the challenge date.
- Save the player's best daily result and attempt count locally, retaining at most 30 dates.
- Keep daily attempts separate from ordinary course records and personal-best ghosts.

## Non-goals

- Online leaderboards, multiplayer, accounts, moderation or server storage.
- New physics, hazards or art assets.
- Replacing the existing course progression or regular build flow.

## Constraints

- Keep the static GitHub Pages deployment and existing vanilla JavaScript/Three.js stack.
- A valid challenge date is a real ISO calendar date no later than the current UTC date. Invalid or future link dates fall back to the current daily challenge.
- Fixed date-to-setup tests preserve historical challenge mappings across future algorithm changes.
- Daily scores and records never leave localStorage. Share links contain only the date.
- Regular course progress and ghosts must not be overwritten by daily runs.
- Preserve keyboard, touch, focus and reduced-motion behavior.

## Approaches

1. **Deterministic local daily challenge (selected):** derive course/body/movement from a stable UTC date hash. Keep best results locally and share a date link. It works on static hosting and gives friends an identical challenge, at the cost of no cross-device scores or global ranking.
2. **Pre-authored calendar:** curate a schedule of daily builds. It allows hand-picked variety but requires maintaining a growing schedule and falls out of sync if a date is missed.
3. **Online leaderboard:** central scores and ranking create a stronger competition loop, but require a backend, identities, moderation and child-safety review; those are outside this browser-only release.

## Behavior

- Add a daily-challenge control to the workshop header. It opens a focused panel with the UTC date, course, build, local best and attempt count, plus Play, Share and Close actions.
- Play applies the day's body, movement and course for that attempt. Returning to the workshop restores the prior build/course before regular settings are saved. Daily runs, retries and replays never alter regular stars, best times or ghosts.
- A completed daily run records stars using the existing bump thresholds (3 for zero bumps, 2 for one or two, otherwise 1), plus finish time, bumps, jumps and attempt count. A result is better if it has more stars, then a faster time at equal stars.
- A shared `?daily=YYYY-MM-DD` link opens the daily panel with that validated setup visible. Sharing from the daily panel copies that date's link. Invalid/future dates use today's challenge.
- Daily records are kept in a separate versioned storage key. Keep the 30 most recently attempted dates; corrupt, unavailable or oversized data must safely yield an empty record set.
- The daily panel joins the existing keyboard focus trap; Escape closes it and restores focus to its trigger.

## Verification

Unit tests cover date validation and UTC behavior, deterministic challenge generation, score ordering and retention, corrupt/denied storage, and invalid score rejection. Browser verification covers desktop and narrow portrait layout, opening a challenge, completing it, local result display, returning to the original setup, and loading a shared date URL.
