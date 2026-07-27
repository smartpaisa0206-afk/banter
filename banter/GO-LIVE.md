# Banter — Go Live Guide (Deploy → Android Studio)

Verified working: `npm run build` is green (17 API routes), and the full
mobile chain was tested live: register → `/api/mobile/login` (token) →
`/api/mobile/generate` returns top-level `variants[]` (exactly what the
Android keyboard parses). The repo is already initialized + committed locally.

Do these in order. Steps that need *your* accounts (GitHub, Vercel, Turso) are
marked **[YOU]** — everything else I've already done or it's automatic.

---

## ⚠️ DO THIS FIRST: rotate the leaked Groq key
An earlier session exposed a Groq key in chat. Even though it is NOT in the
repo, rotate it before any public launch:
1. Go to https://console.groq.com/keys → delete the old `gsk_VWH...` key.
2. Create a new key → you'll paste it into Vercel (Phase 3), not into the repo.

---

## Phase 1 — Push to GitHub **[YOU]**
Repo is already `git init`'d + committed locally. You just need a remote.
1. Create a **new empty repo** at https://github.com/new (don't add README/.gitignore).
2. On your machine (where this code lives), run:
   ```bash
   cd banter
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

## Phase 2 — Hosted database (Turso, free) **[YOU]**
Local `file:./banter.db` won't work on a host. Create a free hosted libSQL DB:
```bash
# install CLI (correct current link):
#   Mac/Linux: curl --proto '=https' --tlsv1.2 -LsSf \
#     https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.sh | sh
#   Windows:   irm https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.ps1 | iex
# No-install option: create the DB + token at https://turso.tech (Databases -> Create)
turso db create banter
turso db show banter --url          # -> libsql://xxxx.turso.io
turso db tokens create banter       # -> long auth token
```
Copy both values — you need them in Phase 3.

## Phase 3 — Deploy on Vercel **[YOU]**
1. https://vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework = **Next.js** (auto-detected). Build = `npm run build`.
   (`postbuild` auto-runs the DB migration, so tables are created on deploy.)
3. In **Settings → Environment Variables**, add ALL of these:

   | Key | Value |
   |---|---|
   | `DB_DRIVER` | `libsql` |
   | `DATABASE_URL` | `libsql://xxxx.turso.io` (from Phase 2) |
   | `DATABASE_AUTH_TOKEN` | token from Phase 2 |
   | `SESSION_SECRET` | 32+ random chars |
   | `APP_ENCRYPTION_KEY` | 32+ random chars |
   | `NEXT_PUBLIC_BRAND_NAME` | `Banter` |
   | `NEXT_PUBLIC_BRAND_TAGLINE` | `Say the right thing to the right person.` |
   | `LLM_PROVIDER` | `groq` |
   | `GROQ_API_KEY` | your NEW key from the console (not the leaked one) |
   | `GROQ_MODEL` | `llama-3.1-70b-versatile` (better Hindi than 8b) |

   Generate the two secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Click **Deploy**. You get `https://<project>.vercel.app`.

### Turn on extras (optional, add when ready)
- **Email OTP login**: `RESEND_API_KEY=re_...`, `EMAIL_FROM=Banter <onboarding@resend.dev>`
  (without it, the 6-digit code shows on-screen — fine for testing).
- **Google sign-in**: `APP_BASE_URL=https://<project>.vercel.app`,
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (add redirect URI
  `https://<project>.vercel.app/api/auth/google/callback` in Google Console).
- **Payments (Stripe)**: `STRIPE_SECRET_KEY`, `STRIPE_BASIC_PRICE`,
  `STRIPE_PREMIUM_PRICE` — wiring exists in `src/lib/pricing.ts`; wire real
  Checkout when you have Stripe keys (currently `/api/billing/demo` just flips
  role to premium for testing).

## Phase 4 — Create the admin account (one-time) **[YOU]**
Run from your machine, pointed at Turso:
```bash
DATABASE_URL=libsql://xxxx.turso.io DATABASE_AUTH_TOKEN=<token> \
  ADMIN_EMAIL=admin@banter.app ADMIN_PASSWORD=<strong-pass> \
  npm run setup
```
(Edit `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env.example` or just override on the
command line as shown.)

## Phase 5 — Verify your live deploy **[YOU]**
Replace the URL, then:
```bash
# Homepage shows hero copy
curl -s https://<project>.vercel.app/ | grep -o "Never go"

# Register + generate (free tier works without an LLM key too)
curl -s -X POST https://<project>.vercel.app/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"password123"}'
curl -s -X POST https://<project>.vercel.app/api/mobile/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"password123","device":"check"}'
# copy token, then:
curl -s -X POST https://<project>.vercel.app/api/mobile/generate \
  -H 'Content-Type: application/json' -H "Authorization: Bearer <token>" \
  -d '{"relationship":"partner","intent":"flirt","tone":"warm","language":"en","context":"great date"}'
# expect JSON with "variants":[...]
```

## Phase 6 — Android Studio (build the keyboard) **[YOU]**
> The `android/` folder has all Kotlin source + layouts + manifest. The only
> missing piece is `gradle/wrapper/gradle-wrapper.jar` + `gradlew` scripts —
> **Android Studio creates these automatically on first open**, so don't
> pre-create them.

1. Install **Android Studio** (Hedgehog/Iguana+), open the SDK Manager, install
   **Android SDK Platform 34** + **Build-Tools**.
2. **File → Open** and select this `android/` folder. Let it sync (downloads
   Gradle 8.9 + deps; first sync also generates the Gradle wrapper).
3. Connect a phone (USB debugging on) **or** start an emulator (API 26+).
4. Click **Run ▶ app**. The **Banter Keyboard** settings screen opens.
5. In settings, set:
   - **Server URL** = `https://<project>.vercel.app`  ← your live URL (NOT localhost)
   - **Email / Password** = a Banter account that has a **password**
     (sign up on the web with the password tab; OTP-only accounts can't log into
     the keyboard yet).
   - Defaults: relationship `partner`, intent `flirt`, tone `warm`, language `en`.
     Toggle **Hurry mode** for one ultra-short line.
6. Tap **Save & Connect** (it logs in, caches the token).
7. Enable the keyboard: Android **Settings → System → Keyboard → On-screen
   keyboard → turn on Banter Keyboard**.
8. In any app (WhatsApp, Messages…), tap a text field, long-press the
   globe/keyboard icon, pick **Banter**. Type a few words, tap the **Banter**
   key → suggestions appear as chips → tap one to insert.

### To ship the APK (not just run from Studio)
**Build → Build Bundle(s) / APK(s) → Build APK(s)**. For Play Store you'll later
need an app signing key + `aab` (Build → Generate Signed Bundle / APK).

---

## Optional next (not blocking launch)
- **Stripe real checkout** with localized prices (swap the demo button).
- **OG/social-share image** for homepage link previews.
- **Earbud live-call** suggestions (see `LIVE_CALL.md`) — needs on-device
  audio + STT; follow-on, not part of the keyboard MVP.

## Quick command reference
```bash
npm run dev          # local dev  (http://localhost:3000, template mode)
npm run build        # production build (postbuild migrates DB)
npm run db:migrate   # create tables manually
npm run setup        # create admin account
```
