@file:Suppress("DEPRECATION")

package com.banter.keyboard

import android.os.Bundle
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

    private lateinit var personalBtn: Button
    private lateinit var professionalBtn: Button
    private lateinit var genzBtn: Button
    private lateinit var roastBtn: Button

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

        personalBtn = findViewById(R.id.btn_personal)
        professionalBtn = findViewById(R.id.btn_professional)
        genzBtn = findViewById(R.id.btn_genz)
        roastBtn = findViewById(R.id.btn_roast)

        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        baseUrl.setText(prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL))
        email.setText(prefs.getString(Prefs.KEY_EMAIL, ""))
        password.setText("")
        relationship.setText(prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP))
        intentEt.setText(prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT))
        tone.setText(prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE))
        language.setText(prefs.getString(Prefs.KEY_LANGUAGE, Prefs.DEF_LANGUAGE))
        hurry.isChecked = prefs.getBoolean(Prefs.KEY_HURRY, false)

        personalBtn.setOnClickListener {
            relationship.setText("partner")
            intentEt.setText("flirt")
            tone.setText("warm")
            status.text = "Personal mode selected. Tap Save & Connect."
        }

        professionalBtn.setOnClickListener {
            relationship.setText("client")
            intentEt.setText("email_professional")
            tone.setText("formal")
            status.text = "Professional mode selected. Tap Save & Connect."
        }

        genzBtn.setOnClickListener {
            relationship.setText("friend")
            intentEt.setText("icebreaker")
            tone.setText("warm")
            status.text = "Gen-Z reply mode selected. Tap Save & Connect."
        }

        roastBtn.setOnClickListener {
            relationship.setText("friend")
            intentEt.setText("icebreaker")
            tone.setText("confident")
            status.text = "Playful roast mode selected. Keep it friendly. Tap Save & Connect."
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
                remove(Prefs.KEY_PASSWORD)
                putString(Prefs.KEY_RELATIONSHIP, relationship.text.toString().trim())
                putString(Prefs.KEY_INTENT, intentEt.text.toString().trim())
                putString(Prefs.KEY_TONE, tone.text.toString().trim())
                putString(Prefs.KEY_LANGUAGE, language.text.toString().trim().ifBlank { Prefs.DEF_LANGUAGE })
                putBoolean(Prefs.KEY_HURRY, hurry.isChecked)
                remove(Prefs.KEY_TOKEN) // force fresh token if server/login changed
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
                        status.text = "Connected ✓ Password not stored. Now enable Banter Keyboard in Android settings."
                    } else {
                        status.text = "Login failed. Check server URL, account email, and password."
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }
}
