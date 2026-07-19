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

## 4. Create the tables + admin
Run the migration once, pointed at Turso (do this from your machine):
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

## Notes
- `secure` cookies are enabled automatically in production (see
  `src/app/api/auth/login/route.ts`), so login works on the hosted HTTPS URL.
- Free tier = 5 generations/day per user; the same rules apply on the host.
- To change the LLM later, just edit the env vars and redeploy — no code change.
