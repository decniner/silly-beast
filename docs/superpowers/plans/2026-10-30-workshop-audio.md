# Workshop Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, opt-in generated soundscape and expressive sound effects to Silly Beast.

**Architecture:** `audio.mjs` owns local audio preferences, bounded synthesis recipes and a lazy Web Audio engine. `game.js` dispatches semantic gameplay events and scene transitions; the settings dialog exposes master volume and workshop ambience.

**Tech Stack:** Vanilla JavaScript ES modules, Web Audio API, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-30-workshop-audio-design.md`

## Global Constraints
- Sound starts only after player interaction and remains opt-in.
- The game runs without Web Audio support and without network-loaded audio assets.
- Master gains and sound effect durations remain bounded; loops stop on mute, pause, or scene changes.
- Audio preferences remain local to this browser.

## Review Focus
- Muted state: no context or audible nodes are created until a user gesture enables sound.
- Invalid/denied storage: preferences fall back safely and the game remains playable.
- Repeated events: effects cannot create unbounded voices or loudness; active loop state is singular.
- Pause/scene transitions: locomotion stops and ambience crossfades without stuck sound.
- Unsupported Web Audio: no unhandled exception or blocked gameplay.

---

### Task 1: Generated sound engine
**Files:** create `audio.mjs`, create `tests/audio.test.mjs`.
**Interfaces:** `readAudioSettings(storage)`, `saveAudioSettings(storage, settings)`, `createAudioEngine({contextFactory, settings})` exposing `unlock`, `setEnabled`, `setVolume`, `setAmbience`, `setScene`, `play`, `dispose`.
- [ ] Add failing tests for preference defaults/validation/storage failure and bounded event recipes.
- [ ] Run focused tests and confirm they fail for missing exports.
- [ ] Implement lazy, bounded Web Audio synthesis and single scene loop management.
- [ ] Run focused tests and all engine checks.

### Task 2: Game controls and event integration
**Files:** modify `game.js`, `index.html`, `style.css`.
**Interfaces:** consume engine exports; retain existing saved global sound preference and add persisted volume/ambience settings.
- [ ] Add master volume and ambience controls to Settings.
- [ ] Map UI selection, countdown, jump, bump, completion, pause and workshop/course transitions to semantic sounds.
- [ ] Test mute/unmute, settings, workshop ambience and locomotion behavior in the browser.

### Task 3: Release and verification
**Files:** modify `README.md`.
- [ ] Document the sound controls and local, opt-in audio.
- [ ] Run syntax checks, all Node tests, browser gameplay/audio checks and `git diff --check`.
- [ ] Commit and push to `main`, confirm GitHub Pages deploy, verify live asset hashes and open the published game.
