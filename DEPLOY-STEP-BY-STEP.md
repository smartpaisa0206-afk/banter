# Banter — Every Single Step to Deploy (beginner-proof)

Read top to bottom. Do each numbered item in order. Commands you can copy are
in `code blocks`. I assume you're on a Windows or Mac laptop and have NEVER
deployed anything before.

> Everything below is FREE on the free tiers. You only pay if you later choose
> paid add-ons (you don't need to).

---

## PART 0 — Accounts you must create (do these first)

You need 2 accounts minimum to go live. A 3rd gives you real AI replies.

### 0.1 GitHub (where your code lives)
1. Open https://github.com/signup in your browser.
2. Enter email → click **Continue** → set password → username → verify.
3. Check your email and click the confirmation link.
4. You now have a GitHub account. Keep the tab open.

### 0.2 Vercel (where the app runs, 24/7)
1. Open https://vercel.com/signup.
2. Click **Continue with GitHub** → approve the connection.
3. You now have a Vercel account linked to GitHub.

### 0.3 Groq (the AI brain — optional but recommended)
1. Open https://groq.com → **Login / Sign up** (use GitHub is fine).
2. After login, open https://console.groq.com/keys.
3. Click **Create API Key** → name it `banter` → **Submit**.
4. **Copy the key now** (`gsk_...`). You won't see it again. Paste it somewhere
   temporary (Notepad). (Do NOT use the old leaked key.)

> Skip 0.3 if you're OK with template replies for now; the app still works
> without it (users get smart pre-written lines instead of AI). Add it later.

---

## PART 1 — Install two small tools on your laptop

### 1.1 Install Node.js (the runtime)
1. Open https://nodejs.org → download the **LTS** button (left, "18.x" or "20.x").
2. Run the installer → keep clicking **Next / Install** with defaults.
3. Verify: open a terminal (Windows: search "PowerShell"; Mac: open "Terminal")
   and type:
   ```bash
   node -v
   ```
   You should see something like `v20.x.x`. If you see a version, it worked.

### 1.2 Install Git (to upload code)
1. Windows: open https://git-scm.com/download/win → run installer → click Next
   through everything (default is fine).
   Mac: open Terminal and run `git --version`; if it says "command not found",
   install from https://git-scm.com/download/mac.
2. Verify:
   ```bash
   git --version
   ```
   Should print `git version 2.x.x`.

---

## PART 2 — Get the Banter code onto your laptop

### 2.1 Download the zip from this workspace
- In the Arena workspace file list, find **`banter-src.zip`** (144 KB) and
  download it to your computer (e.g. your `Downloads` folder).

### 2.2 Unzip it
- Double-click `banter-src.zip` → it creates a `banter` folder.
- Move that `banter` folder somewhere easy, e.g. `C:\Users\You\banter` (Windows)
  or `/Users/You/banter` (Mac).

### 2.3 Open a terminal in that folder
- Windows: open the `banter` folder in File Explorer, type `cmd` in the address
  bar, press Enter. (Or right-click → "Open in Terminal".)
- Mac: open Terminal, type `cd ` (with a space), then drag the `banter` folder
  into the Terminal and press Enter.
- Confirm you're inside it:
  ```bash
  dir        # Windows — should list package.json
  ls         # Mac/Linux — should list package.json
  ```

---

## PART 3 — Put the code on GitHub

### 3.1 Create the empty repo
1. Go to https://github.com/new.
2. **Repository name**: `banter` (or anything).
3. Leave **Public** selected (Private works too, just slower free builds).
4. **DO NOT** tick "Add a README / .gitignore / license" — leave them empty.
5. Click **Create repository**.

### 3.2 Connect and push (option A — command line)
On GitHub's next page you'll see a quick-setup box. Copy the commands under
"…or push an existing repository from the command line". They look like:
```bash
git remote add origin https://github.com/<you>/banter.git
git branch -M main
git push -u origin main
```
Paste them into your terminal (the one opened in PART 2.3) and press Enter.
When prompted for username/password, use your GitHub username and a
**Personal Access Token** (GitHub no longer accepts your account password for
git). To make a token: GitHub → top-right avatar → **Settings → Developer
settings → Personal access tokens → Tokens (classic) → Generate new token
(classic)** → tick `repo` → **Generate** → copy it → paste as the password.

### 3.3 (Easier alternative) Push with GitHub Desktop
1. Install https://desktop.github.com.
2. **File → Add local repository** → choose your `banter` folder.
3. It will say "not a git repository" → click **Initialize**.
4. Type a summary like `Banter app` → **Commit to main**.
5. **Publish repository** → sign in → **Publish**.

Either way, refresh your GitHub repo page — you should now see `package.json`,
`src/`, `android/`, etc.

---

## PART 4 — Create the hosted database (Turso, free)

The app needs a database that lives on the internet (not your laptop). Turso is
free.

### 4.1 Install the Turso CLI
> ⚠️ The old `get.tur.so/install.ps1` link is DEAD (returns a 404). Use the
> GitHub-releases installer below.

- Windows (PowerShell):
  ```powershell
  irm https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.ps1 | iex
  ```
- Mac/Linux (Terminal):
  ```bash
  curl --proto '=https' --tlsv1.2 -LsSf https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.sh | sh
  ```
- Restart your terminal, then verify:
  ```bash
  turso --version
  ```
  (If "command not found", close & reopen the terminal so PATH updates.)

### 4.1b NO-INSTALL alternative (web dashboard)
If the CLI won't install, just do it in the browser at **https://turso.tech**:
1. Sign up / log in.
2. **Databases → Create database** → name `banter` → pick a region → Create.
3. Copy the **Database URL** (`libsql://banter-xxxx.turso.io`).
4. On that DB page find **Tokens / Generate token** → create → copy it.
You now have `DATABASE_URL` + `DATABASE_AUTH_TOKEN` for Part 5.3 — no terminal.

### 4.2 Log in to Turso
```bash
turso auth signup      # if new  — uses browser
turso auth login       # if you already made an account on the site
```
Follow the browser prompt.

### 4.3 Create the database + grab credentials
```bash
turso db create banter
turso db show banter --url
```
→ Copy the output, it looks like `libsql://xxxx.turso.io`. Save it.
```bash
turso db tokens create banter
```
→ Copy the long token it prints. Save it.

You now have two values:
- **DATABASE_URL** = `libsql://xxxx.turso.io`
- **DATABASE_AUTH_TOKEN** = the long token

---

## PART 5 — Deploy on Vercel (the main event)

### 5.1 Import the repo
1. Go to https://vercel.com → dashboard.
2. Click **Add New… → Project**.
3. Under "Import Git Repository", find **`banter`** → click **Import**.
   (If it's not listed, click **Adjust GitHub permissions** and allow Vercel to
   access your repos, then refresh.)

### 5.2 Framework settings (usually auto-filled)
- **Framework Preset**: Next.js (should auto-detect).
- **Root Directory**: `/` (leave as-is — the zip has package.json at the top).
- **Build Command**: `npm run build` (auto).
- **Output**: auto.
- Do NOT click Deploy yet.

### 5.3 Add Environment Variables (IMPORTANT — do this BEFORE deploying)
Click **Environment Variables** (or after import: Project → **Settings →
Environment Variables**). Add each row below. For **Environments** select
**Production, Preview, Development** (or just leave all checked).

| Name | Value | How to get |
|---|---|---|
| `DB_DRIVER` | `libsql` | type it |
| `DATABASE_URL` | `libsql://xxxx.turso.io` | from 4.3 |
| `DATABASE_AUTH_TOKEN` | the long token | from 4.3 |
| `SESSION_SECRET` | 64 random chars | see 5.4 |
| `APP_ENCRYPTION_KEY` | 64 random chars | see 5.4 |
| `NEXT_PUBLIC_BRAND_NAME` | `Banter` | type it |
| `NEXT_PUBLIC_BRAND_TAGLINE` | `Say the right thing to the right person.` | type it |
| `LLM_PROVIDER` | `groq` | type it (skip if no AI) |
| `GROQ_API_KEY` | `gsk_...` | your new key from 0.3 |
| `GROQ_MODEL` | `llama-3.1-70b-versatile` | type it |

### 5.4 Generate the two secret keys
In your terminal, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
It prints 64 characters. Copy that into **`SESSION_SECRET`**. Run it **again**,
copy the new output into **`APP_ENCRYPTION_KEY`**. (Use two different values.)

> Why before deploy? The build runs a database migration at the end
> (`postbuild`). If `DATABASE_URL`/`DATABASE_AUTH_TOKEN` aren't set yet, the
> build fails. So set all env vars first, then deploy.

### 5.5 (Optional) Pin Node version
Project → **Settings → General → Node.js Version** → set **20.x** → Save.
(Not required; default usually works.)

### 5.6 Deploy
Click **Deploy**. First build takes 1–3 minutes. You'll see live build logs.
When it says **"Ready"** or shows a ✓, click the **Visit** button (or the
`https://banter-xxx.vercel.app` link). You should see the Banter homepage
("Never go blank on what to say again.").

> If the build fails: open the build logs, scroll to the red error. 95% of the
> time it's a missing `DATABASE_URL`/`DATABASE_AUTH_TOKEN`. Go back to
> Environment Variables, add them, then **Redeploy** (Deployments → ⋯ →
> Redeploy).

---

## PART 6 — Create your admin account (one-time)

You run this from your laptop terminal, inside the `banter` folder (same as
PART 2.3), pointing at your Turso DB. Replace the Turso values with yours from
Part 4.

> ⚠️ **PowerShell gotcha (this is why Part 6 errored):** the style
> `VAR=value command` is **bash-only**. In PowerShell you must set vars with
> `$env:NAME="value"` first. Also you must have run `npm install` once in this
> folder, or you'll get `tsx: not found`.

**Windows — PowerShell (your shell):**
```powershell
cd banter
npm install            # one-time, only if you haven't already
$env:DATABASE_URL="libsql://banter-xxxx.turso.io"
$env:DATABASE_AUTH_TOKEN="<your-token>"
$env:ADMIN_EMAIL="admin@banter.app"
$env:ADMIN_PASSWORD="MyStrongPass123"
npm run setup
```

**Mac/Linux — Terminal, OR Windows Git Bash (the original one-liner works):**
```bash
cd banter
npm install            # one-time, only if you haven't already
DATABASE_URL=libsql://banter-xxxx.turso.io DATABASE_AUTH_TOKEN=<your-token> \
  ADMIN_EMAIL=admin@banter.app ADMIN_PASSWORD=MyStrongPass123 npm run setup
```

You should see `[seed] admin created: admin@banter.app` (or `admin already
exists` if you ran it before — both are fine). Now log in at
`https://<project>.vercel.app/login` with **admin@banter.app / MyStrongPass123**
to get admin powers (manage users, settings). Use a stronger password than the
example.

---

## PART 7 — Verify it's actually working

### 7.1 In your browser (easiest)
1. Open your `https://<project>.vercel.app` link.
2. Click **Sign up** → create a normal account (password tab).
3. On the dashboard, pick a relationship + intent + tone, type context, generate.
   You should get reply suggestions. ✅

### 7.2 Check the mobile endpoint (what the Android keyboard uses)
In your terminal:
```bash
# register a test user
curl -s -X POST https://<project>.vercel.app/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"password123"}'

# get a mobile token
curl -s -X POST https://<project>.vercel.app/api/mobile/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke@test.com","password":"password123","device":"check"}'
# copy the "token":"..." value

# generate
curl -s -X POST https://<project>.vercel.app/api/mobile/generate \
  -H 'Content-Type: application/json' -H "Authorization: Bearer <token>" \
  -d '{"relationship":"partner","intent":"flirt","tone":"warm","language":"en","context":"great date"}'
```
You should see JSON containing `"variants":["...","..."]`. ✅ That's the exact
shape the keyboard reads.

---

## PART 8 — Build the Android keyboard (Android Studio)

### 8.1 Install Android Studio
1. Download from https://developer.android.com/studio (Hedgehog/Iguana or newer).
2. Run installer. On the "SDK Components Setup" screen, leave defaults checked
   (it installs Android SDK + Platform 34 + Build-Tools). Click Next → Finish.
3. First launch: choose "Standard" install, wait for it to download components.

### 8.2 Open the keyboard project
1. **File → Open** → navigate into your `banter` folder → open the **`android`**
   subfolder → **OK**.
2. Android Studio says "Gradle sync" / "Building". **This is automatic** — it
   downloads Gradle 8.9 + dependencies. The `gradle-wrapper.jar` that's missing
   gets created here on first sync. This can take a few minutes (slow first
   time). Let it finish; don't click away.

### 8.3 Run it
1. Connect your Android phone via USB with **USB debugging** on (Settings →
   About phone → tap "Build number" 7 times → back → System → Developer options
   → USB debugging). **Or** click **Device Manager → Create Virtual Device** to
   make an emulator (pick a Pixel, API 26+).
2. Click the green **Run ▶ 'app'** button (top toolbar). The **Banter Keyboard**
   settings screen appears on the device/emulator.

### 8.4 Connect it to your live server
In the settings screen on the phone:
- **Server URL**: `https://<project>.vercel.app`  ← your real live URL
  (NOT localhost — a phone can't reach your laptop).
- **Email / Password**: a Banter account that has a **password**. (Sign up on
  the web with the password tab; an OTP-only account can't log into the
  keyboard yet.)
- Defaults are fine: partner / flirt / warm / en. Toggle **Hurry mode** for
  one-liners.
- Tap **Save & Connect**. It logs in and caches a token.

### 8.5 Enable + use the keyboard
1. Phone: **Settings → System → Keyboard → On-screen keyboard** → turn on
   **Banter Keyboard**. (Path varies: Samsung = Settings → General management →
   Keyboard list → Banter. Just search "keyboard" in Settings.)
2. Open any app (WhatsApp, Messages, Instagram). Tap a text box.
3. Long-press the **globe / emoji** key → choose **Banter Keyboard**.
4. Type a few words, tap the **Banter** key (the special key on the keyboard).
   Suggestions appear as chips above the keys → tap one to insert it. ✅

### 8.6 Build a shareable APK (to install on other phones)
**Build → Build Bundle(s) / APK(s) → Build APK(s)**. When done, click the
locator or find it at `android/app/build/outputs/apk/debug/app-debug.apk`.
Copy that file to a phone and tap to install.

---

## PART 9 — Turn on optional features (when you want)

**Email magic-code login (real 6-digit codes by email)**
1. Sign up free at https://resend.com → get an API key (`re_...`).
2. Vercel → Project → Environment Variables → add:
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM=Banter <onboarding@resend.dev>`
3. Redeploy. (Without this, the code just shows on screen — fine for testing.)

**Google sign-in**
1. https://console.cloud.google.com → APIs & Services → Credentials →
   **Create OAuth client ID** (Web application).
2. Add authorized redirect URI:
   `https://<project>.vercel.app/api/auth/google/callback`.
3. Copy Client ID + Secret into Vercel env vars:
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `APP_BASE_URL=https://<project>.vercel.app`
4. Redeploy.

**Stripe payments (real checkout)** — not wired yet; currently
`/api/billing/demo` just flips a test account to premium. Ask me to build the
real Stripe Checkout using the already-localized prices in `src/lib/pricing.ts`.

---

## PART 10 — If something breaks

- **Build failed / red error during deploy** → almost always a missing
  `DATABASE_URL` or `DATABASE_AUTH_TOKEN`. Add them, Redeploy.
- **Site loads but generate says "Unauthorized" / 401** → the user/token is
  wrong. For the keyboard, make sure you used an account with a **password**.
- **Keyboard shows no suggestions** → check Server URL is exactly
  `https://…vercel.app` (https, no trailing slash issues), and that "Save &
  Connect" said success. Open logcat (Android Studio → View → Tool Windows →
  Logcat, filter "BanterApi") to see the HTTP error.
- **Pricing not in INR on Indian visits** → works automatically via Vercel's
  country header; make sure you deployed on Vercel (not localhost) and the
  upgrade page reads your region.
- **`node: not found` / `git: not found`** → you skipped PART 1; install them.
- **Lost your Turso token** → you do NOT need the old one. (a) Copy it from
  Vercel: Project → **Settings → Environment Variables** → reveal `DATABASE_AUTH_TOKEN`
  (and `DATABASE_URL`) → paste into Part 6. OR (b) mint a new one at
  **https://turso.tech** → Databases → `banter` → **Tokens / Generate token**. A
  new token works; the old one stays valid too, so the live app is unaffected.

---

That's the whole path. After PART 7 the web app is live; after PART 8 the
keyboard works. Tell me when you hit a step and I'll unblock it.
