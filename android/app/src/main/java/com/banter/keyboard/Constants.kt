package com.banter.keyboard

/**
 * Shared preferences keys + defaults for the Banter Android keyboard.
 *
 * Important:
 * - Real phones should use the live HTTPS Banter URL.
 * - Local emulator testing can use http://10.0.2.2:3000 if your Next.js app is running locally.
 */
object Prefs {
    const val NAME = "banter_prefs"
    const val KEY_BASE_URL = "base_url"
    const val KEY_EMAIL = "email"
    const val KEY_PASSWORD = "password"
    const val KEY_TOKEN = "token"
    const val KEY_MODE = "mode"
    const val KEY_RELATIONSHIP = "relationship"
    const val KEY_INTENT = "intent"
    const val KEY_TONE = "tone"
    const val KEY_LANGUAGE = "language"
    const val KEY_HURRY = "hurry"

    const val MODE_PERSONAL = "personal"
    const val MODE_PROFESSIONAL = "professional"

    // Your live Banter website. Keep no slash at the end.
    const val DEF_BASE_URL = "https://banter-mu.vercel.app"

    // Safe default: personal/flirty warm reply.
    const val DEF_MODE = MODE_PERSONAL
    const val DEF_RELATIONSHIP = "partner"
    const val DEF_INTENT = "flirt"
    const val DEF_TONE = "warm"
    const val DEF_LANGUAGE = "en"
}
