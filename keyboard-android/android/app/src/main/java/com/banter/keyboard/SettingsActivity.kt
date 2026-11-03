@file:Suppress("DEPRECATION")

package com.banter.keyboard

import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.view.View
import android.widget.LinearLayout
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Settings screen for Banter Keyboard.
 * User enters server + login once; keyboard stores a mobile token and uses it later.
 * Password is used only for login and is NOT stored long-term.
 */
class SettingsActivity : AppCompatActivity() {

    private lateinit var baseUrl: EditText
    private lateinit var email: EditText
    private lateinit var password: EditText
    private lateinit var relationship: EditText
    private lateinit var intentEt: EditText
    private lateinit var tone: EditText
    private lateinit var language: EditText
    private lateinit var hurry: CheckBox
    private lateinit var save: Button
    private lateinit var status: TextView
    private lateinit var connectionStatus: TextView
    private lateinit var modeStatus: TextView
    private lateinit var versionText: TextView
    private lateinit var advancedSection: LinearLayout
    private lateinit var toggleAdvanced: Button
    private lateinit var keyboardPageBtn: Button
    private lateinit var feedbackBtn: Button

    private lateinit var personalBtn: Button
    private lateinit var professionalBtn: Button

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        baseUrl = findViewById(R.id.et_base_url)
        email = findViewById(R.id.et_email)
        password = findViewById(R.id.et_password)
        relationship = findViewById(R.id.et_relationship)
        intentEt = findViewById(R.id.et_intent)
        tone = findViewById(R.id.et_tone)
        language = findViewById(R.id.et_language)
        hurry = findViewById(R.id.cb_hurry)
        save = findViewById(R.id.btn_save)
        status = findViewById(R.id.tv_status)
        connectionStatus = findViewById(R.id.tv_connection_status)
        modeStatus = findViewById(R.id.tv_mode_status)
        versionText = findViewById(R.id.tv_version)
        advancedSection = findViewById(R.id.advanced_section)
        toggleAdvanced = findViewById(R.id.btn_toggle_advanced)
        keyboardPageBtn = findViewById(R.id.btn_open_keyboard_page)
        feedbackBtn = findViewById(R.id.btn_feedback)

        personalBtn = findViewById(R.id.btn_personal)
        professionalBtn = findViewById(R.id.btn_professional)

        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        baseUrl.setText(prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL))
        email.setText(prefs.getString(Prefs.KEY_EMAIL, ""))
        password.setText("")
        relationship.setText(prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP))
        intentEt.setText(prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT))
        tone.setText(prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE))
        language.setText(prefs.getString(Prefs.KEY_LANGUAGE, Prefs.DEF_LANGUAGE))
        hurry.isChecked = prefs.getBoolean(Prefs.KEY_HURRY, false)
        updateConnectionStatus(prefs.getString(Prefs.KEY_TOKEN, ""))
        updateModeStatus(prefs.getString(Prefs.KEY_MODE, Prefs.DEF_MODE) ?: Prefs.DEF_MODE)
        versionText.text = "Beta 0.3 • Android"

        keyboardPageBtn.setOnClickListener { openUrl("https://banter-mu.vercel.app/keyboard") }
        feedbackBtn.setOnClickListener { openUrl("https://banter-mu.vercel.app/dashboard/feedback") }

        toggleAdvanced.setOnClickListener {
            val show = advancedSection.visibility != View.VISIBLE
            advancedSection.visibility = if (show) View.VISIBLE else View.GONE
            toggleAdvanced.text = if (show) "Hide advanced defaults" else "Show advanced defaults"
        }

        personalBtn.setOnClickListener {
            prefs.edit().putString(Prefs.KEY_MODE, Prefs.MODE_PERSONAL).apply()
            relationship.setText("partner")
            intentEt.setText("flirt")
            tone.setText("warm")
            updateModeStatus(Prefs.MODE_PERSONAL)
            status.text = "Personal mode selected. Tap Save and Connect."
        }

        professionalBtn.setOnClickListener {
            prefs.edit().putString(Prefs.KEY_MODE, Prefs.MODE_PROFESSIONAL).apply()
            relationship.setText("stranger")
            intentEt.setText("icebreaker")
            tone.setText("formal")
            updateModeStatus(Prefs.MODE_PROFESSIONAL)
            status.text = "Professional mode selected. Tap Save and Connect."
        }


        save.setOnClickListener {
            val url = baseUrl.text.toString().trim().trimEnd('/')
            val emailValue = email.text.toString().trim()
            val passwordValue = password.text.toString()

            if (url.isBlank()) {
                status.text = "Add server URL first. Example: https://banter-mu.vercel.app"
                return@setOnClickListener
            }
            if (emailValue.isBlank() || passwordValue.isBlank()) {
                status.text = "Add Banter email and password first. Password is used once and not stored."
                return@setOnClickListener
            }

            prefs.edit().apply {
                putString(Prefs.KEY_BASE_URL, url)
                putString(Prefs.KEY_EMAIL, emailValue)
                if (intentEt.text.toString().trim() == "icebreaker" && tone.text.toString().trim() == "formal") putString(Prefs.KEY_MODE, Prefs.MODE_PROFESSIONAL)
                else putString(Prefs.KEY_MODE, Prefs.MODE_PERSONAL)
                remove(Prefs.KEY_PASSWORD)
                putString(Prefs.KEY_RELATIONSHIP, relationship.text.toString().trim())
                putString(Prefs.KEY_INTENT, intentEt.text.toString().trim())
                putString(Prefs.KEY_TONE, tone.text.toString().trim())
                putString(Prefs.KEY_LANGUAGE, language.text.toString().trim().ifBlank { Prefs.DEF_LANGUAGE })
                putBoolean(Prefs.KEY_HURRY, hurry.isChecked)
                remove(Prefs.KEY_TOKEN)
                apply()
            }

            status.text = "Saved. Connecting…"
            save.isEnabled = false

            scope.launch {
                val token = BanterApi.login(url, emailValue, passwordValue)
                withContext(Dispatchers.Main) {
                    save.isEnabled = true
                    if (token != null) {
                        prefs.edit()
                            .putString(Prefs.KEY_TOKEN, token)
                            .remove(Prefs.KEY_PASSWORD)
                            .apply()
                        password.setText("")
                        updateConnectionStatus(token)
                        updateModeStatus(prefs.getString(Prefs.KEY_MODE, Prefs.DEF_MODE) ?: Prefs.DEF_MODE)
                        status.text = "Connected ✓ Password not stored. Now enable Banter Keyboard in Android settings."
                    } else {
                        status.text = "Login failed. Check server URL, account email, and password."
                    }
                }
            }
        }
    }

    private fun openUrl(url: String) {
        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }

    private fun updateModeStatus(mode: String) {
        val label = if (mode == Prefs.MODE_PROFESSIONAL) "Professional" else "Personal"
        modeStatus.text = "Default style: $label"
    }

    private fun updateConnectionStatus(token: String?) {
        if (!token.isNullOrBlank()) {
            connectionStatus.text = "Status: Connected ✓ Ready to use"
            connectionStatus.setTextColor(0xFF34D399.toInt())
        } else {
            connectionStatus.text = "Status: Not connected — login and tap Save"
            connectionStatus.setTextColor(0xFFE9C46A.toInt())
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }
}
