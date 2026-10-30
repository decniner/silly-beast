# Project progress

- Browser game version 1.4 turns the six workshop courses into three-lane obstacle runs with optional coin trails, bonus gems, and shield, magnet, and boost pickups.
- Run simulation remains deterministic in `courses.mjs`, `physics.mjs`, and `session.mjs`; wallet and course records stay local in `progress.mjs`. Daily rewards remain separate from the persistent wallet.
- Keyboard, touch buttons, swipe lane changes, reward HUD, completion results, and collectible audio cues are implemented.
- Validation: full Node test suite (172 passing), local runs verified through finish, daily coin isolation confirmed, and all 18 published assets match the release source.
- Released as commit `35b1f9a`; GitHub Pages deployment completed successfully. The current next step is browser playtesting and later Android planning if requested.
- Live playtesting found that steering and jump presses made during the visible 3-2-1 countdown were discarded. Those inputs are now buffered until the course starts; pause and non-run modes still reject them. Regression coverage verifies lane and jump inputs, with the full suite passing (173 tests).
