# Obstacle Collectathon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Silly Beast a three-lane 3D obstacle runner with coins, bonus tokens and temporary power-ups.

**Architecture:** Extend the deterministic run simulation with lane-aware barriers, one-shot pickup collection and timed power-ups. Define lanes and collectibles in course data, render them in the existing Three.js scene, and add touch/keyboard controls, run HUD, and a locally saved coin wallet while keeping daily rewards isolated.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Three.js, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-30-obstacle-collectathon-design.md`

## Global Constraints
- No new runtime dependencies.
- Daily challenges and replay never change the persistent coin wallet.
- Collisions continue the run; coins are optional for course completion and stars.
- Keep workshop, existing saves, ghosts, audio and accessibility controls functional.

## Review Focus
- Invalid lane requests and track edges stay clamped — test left/right lane boundaries.
- A pickup cannot be awarded twice across simulation ticks or replayed frames — test one-shot pickup accounting.
- A shield absorbs only one collision; magnet and boost expire — test timed power-up state.
- Corrupt and denied local storage cannot break the game — test wallet normalization and safe persistence.
- Daily run results do not add to the persistent wallet — verify result flow and normal-run persistence boundary.

---

### Task 1: Deterministic collectathon simulation and course layouts

**Files:**
- Modify: `courses.mjs`
- Modify: `physics.mjs`
- Modify: `session.mjs`
- Test: `tests/physics.test.mjs`
- Test: `tests/courses.test.mjs`

**Interfaces:**
- `advance(state, dt, body, move, jump, layout, pickups)` returns copied run state with `lane`, `coins`, `bonuses`, `collected`, `powerup`, and `powerupTime`.
- `tickRun(state, dt, jump, laneDelta)` uses selected course data.
- Course obstacles include `lane` (0..2); pickups include stable `id`, `z`, `lane`, `type` (`coin`, `bonus`, `shield`, `magnet`, `boost`).

- [x] Write failing tests for lane clamping, lane-specific collision, coin/bonus collection, shield, magnet and boost expiry.
- [x] Run focused tests and confirm failures identify missing simulation behavior.
- [x] Implement deterministic course lane/pickup layouts and simulation behavior.
- [x] Run focused tests, then the existing physics/course tests.

### Task 2: Persistent rewards and 3D gameplay controls

**Files:**
- Modify: `progress.mjs`
- Modify: `game.js`
- Modify: `index.html`
- Modify: `style.css`
- Test: `tests/progress.test.mjs`
- Test: `tests/release.test.mjs`

**Interfaces:**
- Progress adds validated non-negative `coins`; existing version-2 saves remain readable.
- `game.js` exposes lane changes as run input and renders course pickups from the selected course data.
- Result rewards update `progress.coins` only for normal, non-replay runs.

- [x] Write failing tests for coin wallet persistence, corrupt data and denied storage.
- [x] Run focused tests to confirm missing wallet behavior.
- [x] Render lane obstacles and animated workshop-themed pickups, add lane controls, pickup/power-up HUD and result rewards.
- [x] Wire keyboard, touch buttons and swipe controls; bump browser asset version.
- [x] Run focused storage/release tests and full test suite; manually test browser interaction and daily isolation.

### Task 3: Release and deployed browser verification

**Files:**
- Verify: all changed game and test files
- Update: `README.md` only if player controls or features described there need correction.

- [x] Inspect the full diff and check for accidental unrelated changes.
- [x] Run all tests and the local browser QA flow (keyboard lanes, pickups, power-up, finish, wallet and daily run).
- [ ] Push the feature branch to `main` following the established GitHub Pages release flow.
- [ ] Verify the deployed URL serves the matching asset version and playable game.
