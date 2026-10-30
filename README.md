# Silly Beast

A browser-based invention game: choose a creature body, movement style and finish, then explore six obstacle courses.

## Play

https://decniner.github.io/silly-beast/

Choose your parts and a course, then select **Let’s play**. Tap **JUMP** or press **Space** / **Arrow Up** to jump. Press **P** to pause. The optional jump coach highlights the clearance window. Turn on the sound icon for soft workshop ambience, movement-specific creature sounds and playful run cues; adjust master volume and ambience in **Settings**. After finishing a run, race the translucent ghost of your personal best with the same creature and movement style. Turn it off in **Settings**. Progress, sound choices and ghost runs stay in the current browser. Audio starts only after you enable it. Open **Daily challenge** for a shared UTC-dated course and creature, then share its link so a friend gets the same setup. Daily results are saved separately in this browser and do not change course progress or ghosts. A shared date link keeps that exact challenge playable later.

## Run locally

Serve this folder with any static HTTP server, for example `python3 -m http.server 8000`, and open http://localhost:8000/.

## Tests

With Node.js installed: `node --test tests/*.mjs`.

## Hosting

GitHub Pages publishes the root of `main`. `.nojekyll` serves the existing static files directly. No server, API credentials or ChatGPT sign-in is required by this game.

## Credits

See [ASSETS.md](ASSETS.md) and [THREE-LICENSE.txt](THREE-LICENSE.txt) for bundled asset provenance and third-party licensing.
