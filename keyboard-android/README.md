# Banter Keyboard (Android)

The Banter system keyboard for Android — lives in the same repo as the web app
so the whole product is one complete codebase.

```
keyboard-android/
├── KEYBOARD_MASTER_GUIDE.md   # everything: logic, privacy model, API contract, build & release
└── android/                   # native Android project (package com.banter.keyboard)
    ├── build.gradle           # AGP 8.5.2, Kotlin 1.9.24
    ├── settings.gradle
    └── app/                   # IME service, settings UI, API client
```

**What it is:** a normal Android keyboard (IME) first, AI second. It only calls
the Banter backend when the user taps the 🪄 magic key — normal typing never
leaves the device.

**Backend:** the Next.js app in this repo (see `src/`), live at
`https://banter-mu.vercel.app`. The keyboard talks to it over HTTPS
(`BanterApi.kt`).

**Public download:** the packaged zip ships with the site at
`/banter-keyboard-complete.zip` (see `public/`).

**Building:** open `android/` in Android Studio (JDK 17, compileSdk 34,
minSdk 26) or run `./gradlew assembleRelease`. Build outputs are git-ignored.
