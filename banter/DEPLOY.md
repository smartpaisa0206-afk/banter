# Deploy Banter (get a permanent, always-on link)

Running `npm run dev` on your laptop means the app is only reachable while your
PC is on. For real testers (and the PWA install / Android share target /
keyboard, which all need HTTPS) you want it hosted. This gets you a stable
`https://your-app.vercel.app` link that works 24/7.

## 1. Hosted database (Turso — free)
Banter uses libSQL. Local `file:./banter.db` won't work on a host, so create a
free hosted DB:

```
# install the Turso CLI, then:
turso db create banter
turso db show banter --url        # -> libsql://xxxx.turso.io
turso db tokens create banter     # -> a long auth token
```

## 2. Push code to GitHub
Banter must be in a git repo (it already is). Create a repo on GitHub and push.

## 3. Import in Vercel (recommended for Next.js)
- Go to https://vercel.com → "Add New → Project" → import the repo.
- Framework: **Next.js** (auto-detected). Build command: `npm run build`.
- Add **Environment Variables** (all required):
  ```
  DB_DRIVER=libsql
  DATABASE_URL=libsql://xxxx.turso.io      # from step 1
  DATABASE_AUTH_TOKEN=****                  # token from step 1
  SESSION_SECRET=<32+ random chars>
  APP_ENCRYPTION_KEY=<32+ random chars>
  NEXT_PUBLIC_BRAND_NAME=Banter
  NEXT_PUBLIC_BRAND_TAGLINE=Say the right thing to the right person.
  LLM_PROVIDER=groq
  GROQ_API_KEY=gsk_...
  GROQ_MODEL=llama-3.1-70b-versatile        # stronger Hindi than 8b
  ```
  Generate the two secrets with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- Deploy. Vercel gives you a `https://….vercel.app` URL.

> **Tables are created automatically** — `postbuild` runs `npm run db:migrate`
> during the Vercel build, so the Turso tables exist on first deploy. You only
> need the manual `db:migrate` / `setup` commands below if you'd rather run
> them yourself (e.g. to create the admin account).

## 4. (Optional) Turn on real features
Add these env vars in Vercel → Project → Settings → Environment Variables:

**AI quality** (recommended — without it users get templates only)
```
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-70b-versatile     # stronger Hindi than 8b
```

**Email magic-code / OTP login** (users get a real 6-digit code by email)
```
RESEND_API_KEY=re_...                   # free at resend.com
EMAIL_FROM=Banter <onboarding@resend.dev>
```
Without this, the code is shown on screen (fine for testing, not for public users).

**Google sign-in** (needs `APP_BASE_URL` = your Vercel URL)
```
APP_BASE_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```
Then add the redirect URI `https://your-app.vercel.app/api/auth/google/callback`
in Google Cloud Console.

**Payments (Stripe)** — wiring lives in `src/lib/pricing.ts`; add keys when ready:
```
STRIPE_SECRET_KEY=sk_...
STRIPE_BASIC_PRICE=price_...
STRIPE_PREMIUM_PRICE=price_...
```

## 5. Create the admin account (one-time)
Run from your machine, pointed at Turso:
```
DATABASE_URL=libsql://xxxx.turso.io DATABASE_AUTH_TOKEN=**** npm run db:migrate
ADMIN_EMAIL=admin@banter.app ADMIN_PASSWORD=admin1234 DATABASE_URL=libsql://xxxx.turso.io DATABASE_AUTH_TOKEN=**** npm run setup
```
(The migrate/setup scripts read `DATABASE_URL` / `DATABASE_AUTH_TOKEN` from the
env you prefix them with — they do NOT need your local `.env.local`.)

## 5. Point the Android keyboard at it
In the keyboard's settings screen, use the Vercel URL
(`https://your-app.vercel.app`). A real device can't reach `localhost`, so it
must be this public HTTPS URL.

## Other hosts
Railway / Render work the same way: same env vars, same Turso DB, build =
`npm run build`, start = `npm run start`. HTTPS is provided automatically.

## Verify your deploy
After the first deploy, sanity-check it (replace the URL):
```bash
# Homepage should return HTML with your hero copy
curl -s https://your-app.vercel.app/ | grep -o "Never go" | head -1

# API health: register, then generate (free tier works without an LLM key)
curl -s -X POST https://your-app.vercel.app/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"password123"}'
curl -s -X POST https://your-app.vercel.app/api/generate \
  -H 'Content-Type: application/json' -b cookies.txt \
  -d '{"relationship":"partner","intent":"flirt","tone":"warm","language":"en","context":"great date","stream":false}'
```

## Notes
- `secure` cookies are enabled automatically in production (see
  `src/app/api/auth/login/route.ts`), so login works on the hosted HTTPS URL.
- Free tier = 5 generations/day per user; the same rules apply on the host.
- To change the LLM later, just edit the env vars and redeploy — no code change.
