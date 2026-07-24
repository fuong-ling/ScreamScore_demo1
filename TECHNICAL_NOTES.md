# Scream App Needles Prototype Notes

## Needles fit check

- Unit: Needles reports K-weighted loudness in LUFS, also referred to as LKFS. This prototype never labels readings as dB SPL.
- Microphone: Needles accepts a Web Audio source node. A microphone stream can be connected by calling `navigator.mediaDevices.getUserMedia()` and then `audioContext.createMediaStreamSource(stream)`.
- Modes:
  - `momentary`: 400 ms loudness window, updated every 100 ms.
  - `short-term`: 3000 ms loudness window, updated every 100 ms.
  - `integrated`: cumulative programme loudness from 400 ms gated blocks. Needles applies an absolute gate at -70 LUFS and a relative gate 10 LU below the current ungated average.
- Browser support: Needles README says recent Chrome and Firefox. It uses `ScriptProcessorNode`, which is deprecated but still available in common browsers. Safari support is explicitly listed as a future feature by Needles.
- Dependencies: Runtime loads Needles from `vendor/needles/needles.umd.js` and uses `vendor/needles/needles-worker.js`, plus Web Audio API, Web Workers, and microphone access through MediaDevices. Needles itself has no runtime npm dependencies in `package.json`.

## Prototype scoring

`calculateScreamScore()` is kept separate in `src/app.js`. Current prototype score:

- 45% peak momentary LUFS
- 35% average/integrated LUFS
- 15% duration, capped at 4 seconds
- 5% consistency, based on momentary LUFS standard deviation

For short screams, Needles integrated may not emit a useful value before release. In that case the result labels the summary as `avg` and uses the average momentary LUFS as a fallback.

## Known limitations

- LUFS is digital loudness relative to the captured signal path, not calibrated acoustic sound pressure.
- Browser and OS microphone processing can change readings. This prototype asks for echo cancellation, noise suppression, and automatic gain control to be off, but browsers/devices may ignore or approximate constraints.
- Needles currently relies on `ScriptProcessorNode`, so an AudioWorklet implementation would be a better long-term foundation for production.
- Integrated LUFS has a slower cadence than momentary loudness and is not ideal for very short game interactions unless the app keeps its own rolling/integrated stats.

## OpenRouter + GIPHY reaction integration

- Server route: `POST /api/funny-caption`.
- API key: read only on the server from `OPENROUTER_API_KEY`.
- Model: `google/gemini-2.5-flash-lite`.
- GIPHY key: read only on the server from `GIPHY_API_KEY`.
- Prompt, fallback captions, OpenRouter call, GIPHY search, response validation, and GIF cache live in `server/caption.js`.
- Frontend sends only `score`, `duration`, and `type` after a scream result is created.
- OpenRouter is asked to return JSON: `{ "caption": "...", "gifQuery": "..." }`.
- GIPHY Search uses the AI-generated `gifQuery` at `https://api.giphy.com/v1/gifs/search` with `api_key`, `q`, `limit=10`, `offset=0`, `rating=g`, and `lang=en`.
- The GIF selector chooses the first candidate with rating `g` and a usable fixed-height image.
- If OpenRouter or GIPHY fails, times out, a key is missing, or the response is invalid, the server returns a local fallback caption and local reaction asset.

## Online leaderboard

- Backend/database: Supabase Postgres through server-side REST calls in `server/supabase.js`.
- API routes: `POST /api/screams` submits a score, `GET /api/leaderboard?mode=today|all-time` reads leaderboard rows.
- Required env vars: `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- Schema and row level security policies live in `supabase/schema.sql`.
- The app stores no raw microphone audio. It submits only nickname, score, duration, scream type, caption, GIF URL, and timestamp.
- Leaderboard fetches a bounded sorted set from Supabase, then keeps only the best score per normalized nickname before rendering top 20.
- Today mode filters records where `created_at` is greater than the local server start-of-day timestamp.
