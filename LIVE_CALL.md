# Phase 2 — Live earbud call suggestions

The keyboard above handles *text* anywhere. The second half of Banter's Phase 2
is **live suggestions during a real phone call** via earbuds (e.g. "what do I
say next?"). This doc sketches the architecture so it can be built as a follow-on
without redesigning the backend.

## User flow
1. User puts in earbuds and starts a call.
2. The Banter companion app (or a foreground service) captures the call audio
   through the earbud mic.
3. Speech-to-text turns the other person's last few sentences into text.
4. Banter's engine returns a short, natural reply suggestion.
5. The suggestion is shown on-screen (and optionally read aloud via TTS) so the
   user can say it.

## Why it's a separate build
- It needs microphone + call audio access and a speech-to-text engine
  (on-device Whisper, or Google Speech / a streaming STT API).
- It's a foreground `Service` + an overlay/`Activity`, not an IME.
- Latency matters more than polish, so it reuses the *streaming* generation path
  already built for the web UI (`/api/generate` with `stream:true`).

## Suggested module layout (Android)
```
app/src/main/java/com/banter/live/
  CallCaptureService.kt   // foreground service, AudioRecord from earbud
  SttEngine.kt            // wraps Whisper / Google Speech
  LiveSuggestor.kt        // calls /api/generate (stream) with transcript
  OverlayView.kt          // shows the live suggestion + TTS button
```

## Reuse from the current codebase
- `POST /api/mobile/generate` (token auth) — same endpoint the keyboard uses.
- `llmReady()` / fallback flags — show "template mode" honestly if the AI is off.
- The intimacy guardrail in `buildSystem()` keeps suggestions tasteful.

## Privacy note
Live call audio is the most sensitive data Banter touches. Default to
**on-device STT** and make capture opt-in + visible (a persistent notification),
never upload raw audio. Only the transcribed text leaves the device, to the
Banter server — consistent with the app's "encrypted, private" promise.
