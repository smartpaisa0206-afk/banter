# Banter

**Say the right thing to the right person.** Banter is a freemium, relationship-aware
message assistant — get ready-to-send words for flirting, apologizing, pitching, or
just checking in, plus a "Works" mode for emails, social posts, and marketing copy.

- 🌐 Web app (Next.js 14 + Tailwind + framer-motion)
- 🤖 AI via Groq/OpenAI/Anthropic/Ollama (graceful template fallback if no key)
- 🔐 Email OTP + password + Google sign-in
- 🌍 Localized pricing by visitor country + device
- 📱 Native Android keyboard (Phase 2) — see `android/README.md`
- 🔒 Encrypted at rest, secure sessions, rate-limited

## Quick start (local)
```bash
npm install
cp .env.example .env.local      # edit as needed; defaults work in template mode
npm run db:migrate               # creates local SQLite tables
npm run dev                      # http://localhost:3000
```
No API key? Banter still works in **template mode** (smart fallback copy).

## Environment
See `.env.example` for every variable. Essentials:
- `LLM_PROVIDER` + `GROQ_API_KEY` (recommended) — real AI
- `RESEND_API_KEY` — email magic-code login
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` + `APP_BASE_URL` — Google sign-in
- `DATABASE_URL` + `DATABASE_AUTH_TOKEN` — use Turso (hosted libSQL) in production

## Deploy (get a live link)
👉 **[DEPLOY.md](./DEPLOY.md)** — Vercel + Turso in ~10 minutes. Free tiers only.

## Android keyboard (Phase 2)
👉 **[android/README.md](./android/README.md)** — open `android/` in Android Studio,
set your server URL + login, enable the keyboard. Requires Android Studio (the
Gradle wrapper is auto-created on first open).

## Project layout
```
src/
  app/            # Next.js routes (pages + /api)
  components/     # UI (Composer, AuthForm, Landing, PlanCards, ...)
  lib/engine/     # generation engine (languages, intents, tones, prompt build)
  lib/            # auth, db, pricing, email, oauth, security
android/          # native Kotlin IME keyboard
scripts/          # migrate / seed / setup
```

## Docs
- `DEPLOY.md` — hosting + env
- `PHASE2.md`, `LIVE_CALL.md` — roadmap notes
- `android/README.md` — keyboard build & run

---
Made to help people communicate better. Free to start, best quality for everyone.
