# Daily Workshop Challenge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reproducible, shareable daily challenge mode to Silly Beast.

**Architecture:** A new `daily.mjs` owns UTC date validation, deterministic daily setup and bounded local best records. The existing `game.js` adds a workshop challenge panel and applies/restores daily builds while keeping challenge scores independent from course progression and ghosts.

**Tech Stack:** Vanilla JavaScript ES modules, Three.js runtime, Node built-in test runner, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-30-daily-challenge-design.md`

## Global Constraints

- Keep the static GitHub Pages deployment and existing vanilla JavaScript/Three.js stack.
- A valid challenge date is a real ISO calendar date no later than the current UTC date. Invalid or future link dates fall back to the current daily challenge.
- Fixed date-to-setup tests preserve historical challenge mappings across future algorithm changes.
- Daily scores and records never leave localStorage. Share links contain only the date.
- Regular course progress and ghosts must not be overwritten by daily runs.
- Preserve keyboard, touch, focus and reduced-motion behavior.

## Review Focus

- UTC midnight and local-timezone differences: tests require UTC date keys and deterministic setup for identical keys.
- Seed stability over time: fixed historical date-to-setup assertions pin the share-link mapping.
- Invalid, impossible and future shared dates: tests require fallback-safe parsing without accepting them.
- Corrupt, oversized and denied localStorage: tests require empty results or a reported failed save without throwing.
- Repeated attempts with worse scores: tests require best stars/time to remain while attempts increase.
- Historical shared challenge links: tests require their date to reproduce the original setup and keep bounded recent records.

---

### Task 1: Daily challenge data and records

**Files:**
- Create: `daily.mjs`
- Create: `tests/daily.test.mjs`

**Interfaces:**
- `utcDate(now = new Date()) -> YYYY-MM-DD`
- `validChallengeDate(value, now = new Date()) -> boolean`
- `dailyChallenge(date) -> { date, course, body, move } | null`
- `readDailyRecords(storage) -> records`
- `saveDailyRecords(storage, records) -> boolean`
- `recordDailyResult(records, date, result) -> records`

- [ ] Write failing tests for UTC date keys, invalid/future dates, deterministic challenge selection, score ordering, attempt counts, 30-date retention and corrupt/denied storage.
- [ ] Include fixed course/body/movement expectations for at least two historical dates so the challenge algorithm cannot drift silently.
- [ ] Run `node --test tests/daily.test.mjs`; confirm failures report missing daily interfaces.
- [ ] Implement the date, seed and record functions with input validation and a separate `silly-beast-daily-v1` key.
- [ ] Run `node --test tests/daily.test.mjs`; expect all new tests to pass.

### Task 2: Workshop and run integration

**Files:**
- Modify: `index.html`
- Modify: `game.js`
- Modify: `style.css`

**Interfaces:**
- Consume Task 1 exports; `game.js` owns selected challenge date, prior workshop setup, panel state and result flow.
- A daily link uses only `?daily=YYYY-MM-DD`; invalid dates resolve to the current UTC challenge.

- [ ] Add a keyboard-accessible daily control and dialog showing date, course, build, local best and attempts, with Play, Share and Close actions. Add the dialog to the Escape and focus-trap handling.
- [ ] Add browser behavior that applies the daily build/course, runs and records challenge results without updating regular progress or ghosts, then restores the previous setup when returning to the workshop. Retries and replays must also skip regular progress and ghost writes.
- [ ] Add share-link handling for dated challenge links and keep the existing build-sharing behavior.
- [ ] Open a valid incoming `?daily=YYYY-MM-DD` link directly to the daily dialog and show the matching setup; invalid/future values must show today's challenge instead.
- [ ] Verify the data module tests and inspect the changed markup and styles at desktop and narrow portrait sizes.

### Task 3: Release and browser verification

**Files:**
- Modify: `README.md`
- Verify: `https://decniner.github.io/silly-beast/`

- [ ] Document the daily challenge and local-only records.
- [ ] Run `node --check game.js`, `node --check daily.mjs`, `git diff --check` and `node --test tests/*.mjs`; expect no syntax or whitespace errors and all tests to pass.
- [ ] Test normal play and a daily run in the browser, confirm result/restore/share behavior, then open a date link and verify its setup.
- [ ] Commit and push the verified change to `main`; confirm the Pages workflow succeeds and deployed asset hashes match the checkout.
