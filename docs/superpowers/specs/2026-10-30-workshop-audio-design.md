# Workshop Audio Design

## Goal
Give Silly Beast a distinctive, polished sound identity that makes building and racing feel tactile while staying comfortable for children and family play.

## Player experience
- Sound remains opt-in and respects the saved sound toggle.
- A soft, non-repeating workshop atmosphere accompanies build mode; it fades when a run starts or pauses.
- Movement sounds reflect wheels, springs, or legs during a run; these stay quiet under action cues.
- Jumps, bumps, countdowns, selections, and finishes each have distinct short cues with restrained reverb.
- Settings add a master volume slider and a separate workshop ambience toggle. Changes apply immediately and persist locally.
- The existing sound icon remains the global mute toggle. Audio begins only after a player gesture, following browser autoplay rules.

## Implementation
Use a small Web Audio module with synthesized oscillators, filtered noise, envelopes, a bounded reverb impulse, and a compressor. No remote calls, downloaded assets, analytics, or audio dependencies. Keep all gains capped, fade scene changes, and stop scheduled loops when muted, paused, or disposed. Fall back silently if Web Audio is unavailable.

## Validation
Test settings validation, safe gain bounds, sound-event recipes and loop parameters with Node tests. In browser, verify unlock/mute, master level, ambience toggle, movement loops, pause/resume and finish cues; check local storage and console; run the existing gameplay suite.
