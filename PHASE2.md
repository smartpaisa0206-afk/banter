# Banter — Phase 2 status

Phase 1 = the web app (composer, live suggestions, history/saved, billing,
admin, multilingual, freemium tiers, hardened security). Done & building green.

Phase 2 = *be everywhere the user texts* — a native Android keyboard + live
earbud-call suggestions. Status below.

## Done in this pass
- **Streaming web engine** (`src/lib/engine/generate.ts`): SSE streaming, hard
  timeouts, one transparent retry, and an honest `usedFallback` flag so the UI
  can tell the user when it's showing smart templates vs live AI.
- **Streaming API** (`/api/generate` with `stream:true`): first byte goes out
  immediately (meta), then deltas keep the connection alive, then the structured
  result. Non-stream path kept for the keyboard.
- **Framer-motion UI**: page transitions, landing stagger, the "composing"
  indicator, staggered variant reveal, fallback/error banners, retry, LLM status
  dot in the header. `prefers-reduced-motion` respected.
- **Robustness**: abortable + cached live suggestions (no more stacked calls
  while typing), shared `api.ts` with retry, clear 401/403/429/timeout messages.
- **PWA**: `manifest.webmanifest` + `sw.js` + installable icon + **Android share
  target** (`/share`) — share text from any app into Banter, it lands in the
  composer.
- **Mobile backend**: `mobile_tokens` table, `POST /api/mobile/login`,
  `POST /api/mobile/generate` (bearer token, same tier/limit rules as web).
- **Native Android keyboard**: full Kotlin IME project in `android/` wired to
  the mobile backend (see `android/README.md`).

## Not yet built (honest list)
- The live **earbud call** feature — architecture only, in `LIVE_CALL.md`. Needs
  on-device STT + a foreground service; out of scope for the keyboard MVP.
- The keyboard is **uncompiled here** (no Android SDK in this environment). Open
  `android/` in Android Studio to build/run. Web + backend are verified working.
- UI provider switcher (provider is env-only for now).

## To run everything
```
cd banter
npm install
cp .env.example .env.local      # add LLM_PROVIDER=groq + GROQ_API_KEY
npm run db:migrate
npm run setup                    # creates admin@banter.app / admin1234
npm run dev                      # http://localhost:3000
```
Keyboard: open `android/` in Android Studio (see its README).
