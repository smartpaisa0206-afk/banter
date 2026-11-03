# Banter Keyboard (Phase 2 — native Android IME)

A real Android system keyboard that calls your Banter server and turns whatever
you've typed into ready-to-send rewrites — without leaving the app you're in
(WhatsApp, Instagram, Messages, etc.).

## What it does
- Standard QWERTY keyboard (letters, space, delete, done).
- A **Banter** key: taps it, the keyboard reads the last ~200 chars before the
  cursor, sends them to `POST /api/mobile/generate`, and shows the returned
  variants as tappable candidate chips. Tap a chip to replace your text.
- Reuses the user's Banter account, plan, and daily limit (enforced server-side).
- Authenticates with a device token (login once in the app, token is cached).

## Requirements
- Android Studio (Hedgehog / Iguana or newer) with the Android SDK (API 34).
- A reachable Banter server. For local testing on the same machine, expose it
  over HTTPS (e.g. `ngrok http 3000`) and paste that URL in the app — plain
  `http://10.0.2.2:3000` works on the emulator but not for release/Play.

## Run it
1. Open this `android/` folder in Android Studio (File → Open). It will download
   Gradle 8.9 and the dependencies.
2. Let it sync. If you don't have the Gradle wrapper, Android Studio creates it;
   or run `gradle wrapper` from a machine that has Gradle installed.
3. Connect a device or start an emulator (API 26+).
4. Run `app`. The **Banter Keyboard** settings screen opens.
5. Enter your server URL + Banter login, then tap **Save & Connect**.
6. Enable the keyboard: Android Settings → System → Keyboard → On-screen keyboard
   → turn on **Banter Keyboard**.
7. In any text field, long-press the globe/keyboard icon and pick Banter.
   Type something, tap **Banter**, pick a suggestion.

## Configure defaults
In the settings screen you can pre-set the relationship / intent / tone /
language used every time you tap the Banter key (e.g. `partner` / `flirt` /
`warm` / `en`). "Hurry mode" returns one ultra-short line.

## Server side (already built)
- `POST /api/mobile/login` → `{ token }`
- `POST /api/mobile/generate` (Bearer token) → `{ variants, tip, coachNote, ... }`
- A `mobile_tokens` table stores device tokens (30-day expiry).
- Free users are limited to 5 generations/day and cannot use "Works" intents —
  the same rules as the web app.

## Notes / next steps
- This is the MVP keyboard. Polish ideas: inline suggestions above the
  cursor, a language auto-detect toggle, premium "Power Move" tone, and a
  long-press on the Banter key to open full composer settings.
- Live **earbud call** suggestions (the other half of Phase 2) are described in
  the repo's `LIVE_CALL.md` — they need on-device audio capture + speech-to-text
  and are a follow-on, not part of this keyboard MVP.
