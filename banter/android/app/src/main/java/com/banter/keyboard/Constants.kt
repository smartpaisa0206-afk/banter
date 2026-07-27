package com.banter.keyboard

/**
 * Shared preferences keys + sane defaults for the Banter keyboard.
 * Values are set from SettingsActivity and read by BanterKeyboard / BanterApi.
 */
object Prefs {
    const val NAME = "banter_prefs"
    const val KEY_BASE_URL = "base_url"
    const val KEY_EMAIL = "email"
    const val KEY_PASSWORD = "password"
    const val KEY_TOKEN = "token"
    const val KEY_RELATIONSHIP = "relationship"
    const val KEY_INTENT = "intent"
    const val KEY_TONE = "tone"
    const val KEY_LANGUAGE = "language"
    const val KEY_HURRY = "hurry"

    const val DEF_BASE_URL = "https://your-banter-server.com"
    const val DEF_RELATIONSHIP = "partner"
    const val DEF_INTENT = "flirt"
    const val DEF_TONE = "warm"
    const val DEF_LANGUAGE = "en"
}
