package com.banter.keyboard

import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Onboarding screen: where the Banter server lives + the user's login.
 * On save we exchange credentials for a device token (stored in prefs) so the
 * keyboard can call /api/mobile/generate without re-authenticating.
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

        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        baseUrl.setText(prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL))
        email.setText(prefs.getString(Prefs.KEY_EMAIL, ""))
        password.setText(prefs.getString(Prefs.KEY_PASSWORD, ""))
        relationship.setText(prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP))
        intentEt.setText(prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT))
        tone.setText(prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE))
        language.setText(prefs.getString(Prefs.KEY_LANGUAGE, Prefs.DEF_LANGUAGE))
        hurry.isChecked = prefs.getBoolean(Prefs.KEY_HURRY, false)

        save.setOnClickListener {
            val url = baseUrl.text.toString().trim().trimEnd('/')
            prefs.edit().apply {
                putString(Prefs.KEY_BASE_URL, url)
                putString(Prefs.KEY_EMAIL, email.text.toString())
                putString(Prefs.KEY_PASSWORD, password.text.toString())
                putString(Prefs.KEY_RELATIONSHIP, relationship.text.toString())
                putString(Prefs.KEY_INTENT, intentEt.text.toString())
                putString(Prefs.KEY_TONE, tone.text.toString())
                putString(Prefs.KEY_LANGUAGE, language.text.toString())
                putBoolean(Prefs.KEY_HURRY, hurry.isChecked)
                apply()
            }
            status.text = "Saved. Connecting…"
            scope.launch {
                val token = BanterApi.login(url, email.text.toString(), password.text.toString())
                withContext(Dispatchers.Main) {
                    if (token != null) {
                        prefs.edit().putString(Prefs.KEY_TOKEN, token).apply()
                        status.text = "Connected ✓ token saved."
                    } else {
                        status.text = "Login failed. Check server URL + credentials."
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
