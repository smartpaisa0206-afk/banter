# BANTER KEYBOARD — MASTER GUIDE
### Everything: what it is, code logic, privacy model, API contract, how to build the APK, how to release.

**Product:** Banter Keyboard (Android system keyboard / IME) by **HNY Labs**.
**Slogan:** *Say the right thing to the right person. Type rough. Tap 🪄. Send better.*
**Backend:** `https://banter-mu.vercel.app` (Next.js app in the main Banter repo).
**Package:** `com.banter.keyboard` · **APK name:** `banter-keyboard-beta.apk`

**Core principle:** it is a **normal keyboard first, AI second**. The AI only runs when the user
taps the magic key 🪄. Normal typing is never uploaded anywhere.

---

## 1. Folder layout — every file and its job

```
android/
├── build.gradle                  # root: AGP 8.5.2, Kotlin 1.9.24 (versions only)
├── settings.gradle               # repo sources, project name "BanterKeyboard", includes :app
├── gradle.properties             # JVM args, AndroidX flag
├── gradle/wrapper/               # Gradle wrapper config
└── app/
    ├── build.gradle              # compileSdk 34, minSdk 26, targetSdk 34, JDK 17, deps
    ├── proguard-rules.pro
    └── src/main/
        ├── AndroidManifest.xml   # IME service + settings activity + INTERNET permission
        ├── java/com/banter/keyboard/
        │   ├── BanterKeyboard.kt       # THE CORE — InputMethodService (390 lines)
        │   ├── BanterApi.kt            # HTTP client: login + generate
        │   ├── BanterCandidateView.kt  # suggestion chip strip above keys
        │   ├── SettingsActivity.kt     # launcher app: login + settings
        │   └── Constants.kt            # Prefs keys + defaults
        └── res/
            ├── layout/keyboard_view.xml      # toolbar + chips + KeyboardView
            ├── layout/activity_settings.xml  # login/settings screen
            ├── xml/qwerty.xml                # letter layout (QWERTY)
            ├── xml/symbols.xml               # ?123 symbols layout
            ├── xml/method.xml                # IME metadata (points to SettingsActivity)
            ├── drawable/                     # key backgrounds, buttons, launcher icon
            └── values/                       # colors, strings, themes (dark)
```

---

## 2. Architecture / data flow

```
Any app (WhatsApp, etc.)
   │  user types rough text
   ▼
BanterKeyboard (IME service)
   │  user taps 🪄
   │  reads last 220 chars BEFORE cursor  (only now — never during normal typing)
   │  wraps it in a prompt:
   │    TARGET_LANGUAGE rule + STYLE rule + TASK + CURRENT_USER_TEXT
   ▼
BanterApi.generate()  ── HTTPS POST /api/mobile/generate  (Bearer token) ──▶
Next.js server (banter-mu.vercel.app)
   │  rate limits → auth check → plan check
   │  LLM provider fallback: Groq → OpenRouter → Gemini → local templates
   ▼
{ "variants": ["better 1", "better 2", "better 3"] }
   │
   ▼
BanterCandidateView shows 3 chips  →  user taps one
   │
   ▼
commitSuggestion(): deletes the rough text, inserts the chosen variant
   │  "Undo" chip restores the original text
```

---

## 3. Code logic — file by file

### 3.1 `BanterKeyboard.kt` — the core IME
Extends `InputMethodService` + `KeyboardView.OnKeyboardActionListener`.

| Method | Logic |
|---|---|
| `onCreateInputView()` | Inflates `keyboard_view.xml`, loads `R.xml.qwerty`, wires the 3 toolbar buttons: **⋯ extra menu**, **⚙ settings**, **🪄 magic**. |
| `onStartInputView()` | Runs every time a text field gains focus. Resets chips/undo. **Detects sensitive fields** → disables magic for that field. Resets to qwerty + lowercase. |
| `onKey()` | Character commit (one-shot caps after a capital), `KEYCODE_DELETE` (deletes selection first, else 1 char), `KEYCODE_DONE` (sends Enter key event), shift toggle, symbols toggle, emoji key 🙂. |
| `requestBanterSuggestions()` | The 🪄 flow: empty text → "Type something first" chip. No token → "Open settings ⚙ and login first". Otherwise reads `getTextBeforeCursor(220, 0)`, calls `styleContext()`, shows "Thinking…", launches coroutine → `BanterApi.generate()` → up to **3 variant chips**. |
| `commitSuggestion()` | Batch edit: `deleteSurroundingText(original.length)` then `commitText(chosen)`. Saves both texts for undo. Shows **Undo / Done ✓** chips. |
| `undoLastSuggestion()` | Deletes the inserted variant, re-commits the original rough text. |
| `isSystemChip()` | Guard: status chips ("Thinking…", errors, "Done ✓"…) can never be committed as message text. |
| `styleContext(mode, text)` | Builds the prompt. Adds `TARGET_LANGUAGE: X only.` marker + style rules + `CURRENT_USER_TEXT: ...`. **Professional** mode = clear/formal, **no emojis unless explicitly requested**. Personal = natural/friendly, emojis only if natural. |
| `detectKeyboardLanguage(text)` | Unicode ranges: Hindi `[\u0900-\u097F]`, Tamil `[\u0B80-\u0BFF]`, Telugu `[\u0C00-\u0C7F]`, Bengali `[\u0980-\u09FF]`. Roman **Hinglish** via word regex (kkrh, kya, tm, nhi, yaar, acha…). Result: `hi / ta / te / bn / hing / en`. **Same-language rule:** output follows input language. |
| `isSensitiveField(info)` | Password variations (`TYPE_TEXT_VARIATION_PASSWORD` etc.) or `IME_FLAG_NO_PERSONALIZED_LEARNING` → magic disabled. |
| `showExtraMenu()` / `showModes()` | Hidden menu chips (no always-on mode row): Clipboard, Share keyboard, **Modes** (Personal / Professional), Feedback. Mode is stored in prefs and applied silently. |
| `updateKeyboardCase()` | Relabels A-Z keys for caps display. |

**Keyboard behavior rules (product spec — keep these when changing UI):**
1. No always-on `Personal | Professional | Hinglish` row. Mode lives under the extra menu.
2. The AI action is **🪄 only** — one obvious magic key.
3. No "HNY" text on the spacebar.
4. Professional suggestions: **no emojis** unless the user asks.
5. Same-language behavior: English→English, Hinglish→Roman Hinglish, Tamil→Tamil, etc.
6. No dead/fake buttons — every chip must do something real.
7. Must feel like a normal daily keyboard first, AI second.

### 3.2 `BanterApi.kt` — network layer
Plain `HttpURLConnection` inside Kotlin coroutines (`Dispatchers.IO`). No Retrofit/OkHttp — tiny and dependency-light.

- `login(baseUrl, email, password)` → `POST /api/mobile/login` body `{"email","password","device":"android-keyboard"}` → returns `token` string or null.
- `generate(baseUrl, token, relationship, intent, tone, language, context, hurry)` → `POST /api/mobile/generate` with `Authorization: Bearer <token>`, body `{"relationship","intent","tone","language","context","hurry"}` → returns `List<String>` from `variants[]`.
- Error mapping to friendly chips: `401` → "Login expired…", `403` → plan message, `429` → limit message, other → server/`Server error` message. Network exception → "Network error — check internet/server".
- Timeouts: connect 15 s, read 20–30 s.

### 3.3 `BanterCandidateView.kt` — suggestion strip
Custom `LinearLayout` with a `HorizontalScrollView` of chips. `setCandidates(list)` rebuilds chips; `onPick` callback routes taps back to `BanterKeyboard.handleCandidateTap()`. Status chips (errors/info) are blue and wider; suggestion chips white, max 2 lines, ellipsized. Undo chip has a distinct background.

### 3.4 `SettingsActivity.kt` — the companion app (launcher icon)
- Fields: base URL (hidden under **Advanced**), email, password, relationship/intent/tone/language (advanced), hurry checkbox, Personal/Professional buttons.
- **Save** → `BanterApi.login()` → stores **token** (+email) in SharedPreferences `banter_prefs`. Password is used **only for login and is not stored long-term**.
- Buttons to open the website `/keyboard` page and `/dashboard/feedback`.
- Shows connection status + version.

### 3.5 `Constants.kt` (`Prefs`)
All SharedPreferences keys + defaults. `DEF_BASE_URL = "https://banter-mu.vercel.app"` (no trailing slash; emulator testing can use `http://10.0.2.2:3000`). Default mode: personal → partner/flirt/warm.

### 3.6 Manifest + resources
- `AndroidManifest.xml`: only permission = `INTERNET`. `usesCleartextTraffic="false"` (HTTPS only). Service `.BanterKeyboard` with `BIND_INPUT_METHOD` + `android.view.input-method` intent + `@xml/method` metadata. Activity `.SettingsActivity` is MAIN/LAUNCHER.
- `res/xml/method.xml`: declares the IME + settings activity.
- `res/xml/qwerty.xml` / `symbols.xml`: key definitions (codes, gaps, % widths).
- `res/layout/keyboard_view.xml`: toolbar row (⋯ ⚙ 🪄) + `BanterCandidateView` + `KeyboardView`.
- `res/drawable/`: dark rounded key/button/input backgrounds + launcher icon.
- Theme: dark (`values/themes.xml`, `colors.xml`).

---

## 4. Backend API contract (what the server must provide)

### `POST /api/mobile/login`
```json
// request
{ "email": "user@example.com", "password": "•••", "device": "android-keyboard" }
// 200 response
{ "token": "<jwt>" }
// 401 response
{ "error": "Invalid credentials" }
```

### `POST /api/mobile/generate`  (header: `Authorization: Bearer <token>`)
```json
// request
{
  "relationship": "partner",   // partner|friend|parent|boss|coworker|client|stranger…
  "intent": "flirt",           // flirt|apologize|reject|followup|icebreaker…
  "tone": "warm",              // warm|formal|casual|direct|funny…
  "language": "en",            // server auto-detects from context if unsure
  "context": "TARGET_LANGUAGE: Roman Hinglish only. STYLE: … CURRENT_USER_TEXT: kkrh",
  "hurry": false
}
// 200 response
{ "variants": ["better 1", "better 2", "better 3"] }
// errors: 401 {"error": "..."} | 403 {"error":"This mode needs Plus access"} | 429 {"error":"Daily limit reached"}
```

Server-side protections already in place (main repo): rate limits (mobile login 8/15 min,
mobile generate 10/60 s/user), plan checks, security event logging, LLM provider fallback
Groq → OpenRouter → Gemini → local templates.

---

## 5. Privacy model (NON-NEGOTIABLE)

1. **Nothing is uploaded during normal typing.** Text is read only when the user taps 🪄.
2. Only the **last 220 characters before the cursor** are sent — never the whole message history, never other apps' data.
3. **Password / private fields:** magic is disabled (password input-type variations + `IME_FLAG_NO_PERSONALIZED_LEARNING`). The chip strip shows "Magic is disabled in private fields".
4. **HTTPS only** (`usesCleartextTraffic="false"`).
5. The auth token lives in app-private SharedPreferences. The password is not stored after login.
6. Clipboard is only read when the user taps "Clipboard" in the extra menu.

---

## 6. How to build the APK

### Prerequisites
- **Android Studio** (Hedgehog or newer) — easiest. OR command line: JDK 17 + Android SDK 34.
- Project opens from the **`android/`** folder (it is a standalone Gradle project).

### Option A — Android Studio
1. `File → Open` → select the `android/` folder.
2. Wait for Gradle sync (AGP 8.5.2, Kotlin 1.9.24, JDK 17).
3. `Build → Build App Bundle(s) / APK(s) → Build APK(s)`.
4. Click the link in the notification → APK is at:

### Option B — Command line
```bash
cd android
./gradlew assembleDebug          # Windows: gradlew.bat assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

### Publish it on the website
```bash
cp android/app/build/outputs/apk/debug/app-debug.apk ../public/banter-keyboard-beta.apk
```
The web app serves it at `/banter-keyboard-beta.apk`, and `/api/download-keyboard` gates the
download behind login (logs a `keyboard_download` security event, redirects anonymous users to /login).

---

## 7. Install on a phone

1. Copy `banter-keyboard-beta.apk` to the phone → open it → allow "install unknown apps" if asked.
2. `Settings → System → Languages & input → On-screen keyboards → Manage keyboards` → enable **Banter Keyboard**.
3. In any text field, tap the keyboard/globe icon in the nav bar → pick **Banter Keyboard**.
4. Open the **Banter Keyboard** app (launcher icon) → enter email + password of your
   `banter-mu.vercel.app` account → **Save** (you should see "Connected ✓").
5. Open WhatsApp → type rough text (e.g. `sorry busy`) → tap **🪄** → tap a suggestion.

---

## 8. Test checklist (run after every change)

- [ ] Normal typing feels normal: letters, one-shot caps, `?123` symbols, delete (also deletes selection), Enter.
- [ ] 🪄 with empty text → "Type something first, then tap 🪄".
- [ ] 🪄 while logged out → "Open settings ⚙ and login first".
- [ ] 🪄 in a password field → "Magic is disabled in private fields".
- [ ] 🪄 happy path → 3 suggestion chips within ~5 s.
- [ ] Tapping a suggestion replaces **only the rough text** you typed; **Undo** restores it.
- [ ] Hinglish input (`kkrh yaar`) → reply in Roman Hinglish. Tamil input → Tamil reply.
- [ ] Professional mode → suggestions contain **no emojis**.
- [ ] Rate-limited (spam 🪄) → friendly "Daily limit"-style chip, not a crash.
- [ ] Settings → Save works, survives keyboard restart (token persists).

---

## 9. Pitfalls already fixed — do not regress

| Problem | Fix (already in this code) |
|---|---|
| `PreferenceManager` unresolved import | We do **not** use androidx PreferenceManager. `getSharedPreferences(Prefs.NAME, MODE_PRIVATE)` directly. |
| Corrupted `activity_settings.xml` EditText (broken attribute) | Keep the XML valid; re-check after any layout edit. |
| AAPT error on `?123` style attribute | Attribute references must be `?attr/name`, never `?123`. |
| Deprecated `InputMethodService`/`KeyboardView` lint | `@file:Suppress("DEPRECATION")` — fine for MVP; custom views are a later upgrade. |
| Groq 404 (deprecated model) | Server-side: model `openai/gpt-oss-20b` (server lives in the web repo, not here). |
| Trailing slash in base URL | `Constants.kt` keeps `DEF_BASE_URL` slash-free; `SettingsActivity` trims `/` on save. |

---

## 10. How to push keyboard + APK to git (from `D:\banter`)

```cmd
cd /d D:\banter
git add android public/banter-keyboard-beta.apk
git commit -m "keyboard: complete source + beta APK"
git pull --rebase origin main
git push
```
GitHub accepts APKs under 100 MB. If you ever do NOT want the APK in git, keep only `android/`
tracked and serve the APK from `public/` anyway (same commands minus the APK path).

---

## 11. Known limitations / roadmap (not built yet)

- QWERTY English layout only (language routing affects AI output, not key labels).
- No swipe typing, no long-press accents, no GIF/sticker strip.
- Suggestions always come from the server (no on-device offline fallback yet).
- One device token per login (revoke from `Dashboard → Settings → Devices`).
