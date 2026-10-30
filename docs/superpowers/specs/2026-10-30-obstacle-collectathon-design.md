# Silly Beast Collectathon Design

## Intent
Turn Silly Beast into a polished 3D obstacle-runner for kids. The creature moves forward automatically while the player changes lanes, jumps barriers, follows coin trails, gathers bonus tokens, and uses short-lived power-ups. The collectible loop should reward curiosity as well as a clean finish.

## Goals
- Give all six courses three readable lanes, lane-specific barriers, collectible coin trails and a bonus token.
- Provide three temporary power-ups: a one-hit shield, a nearby-lane coin magnet, and a short speed boost.
- Support keyboard, touch buttons, and swipe lane changes while retaining the existing jump and pause controls.
- Show coins, bonus tokens and active power-ups during a run; award normal-course coins to a persistent local wallet.
- Keep daily runs, replay records, course times, stars, creature workshop, audio and reduced-motion support working.
- Present original workshop-themed art and language; do not reproduce Mario characters, assets, course names, or sounds.

## Non-goals and anti-goals
- No multiplayer, ads, in-app purchases, accounts, or network services.
- No permanent power-up inventory or monetized economy.
- Do not make collisions end a run; keep the forgiving bump-and-continue behavior.
- Do not make coin collection required to finish or earn course stars.

## Constraints
- Keep the app static and browser-hosted on GitHub Pages; add no runtime dependencies.
- Preserve existing local saves and daily challenge isolation.
- Daily runs may display pickups, but do not add coins to the persistent wallet.
- Use deterministic pickup/course data so replays can reproduce collection results.

## Approaches
1. **Three-lane collectathon runner (selected):** retain auto-run and jumping, add lane steering, collectible paths, bonus tokens and timed power-ups. It reuses the deterministic simulation and 3D course renderer while making obstacles a genuine route choice.
2. **Free-roam 3D platform course:** add directional movement, camera steering and platform jumps. It changes the core controls, camera and collision model, making it a larger rebuild with more risk to the existing workshop and daily mode.
3. **Jump-only runner with decorative pickups:** place coins in the current straight lane and score them on contact. This is smaller but leaves the full-width barriers and one-action gameplay that prompted the overhaul.

The user has asked for a complete obstacle-game overhaul and delegated product decisions in the preceding project conversation. The three-lane runner is the smallest architecture that delivers meaningful obstacle avoidance and collectible routes.

## Behavior and visual direction
- Lanes are indexed left, center, right and spaced 2.6 world units apart. Each barrier occupies one lane and may be dodged or jumped.
- Coins score one; bonus tokens score five and increment a bonus count. Trails and branching lanes are distributed before, between and after barriers.
- Shield absorbs one collision while active. Magnet attracts coins in adjacent lanes. Boost increases forward speed for a few seconds. New power-ups replace the active one.
- Pickups are bright metallic/brass workshop artifacts with distinct silhouettes. Coins spin, bonus tokens glow, and lane dividers guide the eye. Existing high-quality materials, lighting and course palettes remain the visual foundation.
- Keyboard: Left/Right or A/D changes lanes; Space/Up jumps; P pauses. Mobile receives left, right and jump buttons plus horizontal swipe support.
- The HUD presents lane control hint, run coins, bonus count, power-up timer and progress. Result card presents run coins and bonuses. Regular-course pickups add to a local wallet; daily challenge and replay do not.

## Decisions left to implementation
- Distribute course pickup patterns and barrier lanes to keep a safe lane or jumpable route available.
- Tune pickup collision windows and power-up durations through the simulation tests and browser play test.
- Validate keyboard, touch-sized controls, result rewards, saved wallet and daily isolation.
