package com.banter.keyboard

import android.inputmethodservice.InputMethodService
import android.inputmethodservice.Keyboard
import android.inputmethodservice.KeyboardView
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import androidx.preference.PreferenceManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Banter's system keyboard. Tap the "Banter" key to send the text you've typed
 * (the last 200 chars before the cursor) to your Banter server and get
 * ready-to-send rewrites as candidate chips.
 */
class BanterKeyboard : InputMethodService(), KeyboardView.OnKeyboardActionListener {

    private lateinit var kv: KeyboardView
    private lateinit var candidateView: BanterCandidateView
    private var lastContextText: String = ""
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateInputView(): View {
        val view = layoutInflater.inflate(R.layout.keyboard_view, null)
        kv = view.findViewById(R.id.keyboard)
        candidateView = view.findViewById(R.id.candidates)
        kv.keyboard = Keyboard(this, R.xml.qwerty)
        kv.setOnKeyboardActionListener(this)
        candidateView.onPick = { commitSuggestion(it) }
        return view
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        candidateView.clear()
        lastContextText = ""
    }

    override fun onKey(primaryCode: Int, keyCodes: IntArray?) {
        val ic = currentInputConnection ?: return
        when (primaryCode) {
            Keyboard.KEYCODE_DELETE -> ic.deleteSurroundingText(1, 0)
            Keyboard.KEYCODE_DONE -> {
                ic.sendKeyEvent(KeyEvent(0, 0, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER, 0))
                ic.sendKeyEvent(KeyEvent(0, 0, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER, 0))
            }
            KEYCODE_BANTER -> requestBanterSuggestions()
            else -> {
                if (primaryCode > 0) ic.commitText(primaryCode.toChar().toString(), 1)
            }
        }
    }

    private fun requestBanterSuggestions() {
        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        val baseUrl = (prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL) ?: Prefs.DEF_BASE_URL).trimEnd('/')
        var token = prefs.getString(Prefs.KEY_TOKEN, "") ?: ""
        val email = prefs.getString(Prefs.KEY_EMAIL, "") ?: ""
        val password = prefs.getString(Prefs.KEY_PASSWORD, "") ?: ""
        val relationship = prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP) ?: Prefs.DEF_RELATIONSHIP
        val intent = prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT) ?: Prefs.DEF_INTENT
        val tone = prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE) ?: Prefs.DEF_TONE
        val language = prefs.getString(Prefs.KEY_LANGUAGE, Prefs.DEF_LANGUAGE) ?: Prefs.DEF_LANGUAGE
        val hurry = prefs.getBoolean(Prefs.KEY_HURRY, false)

        val ctx = currentInputConnection?.getTextBeforeCursor(200, 0)?.toString() ?: ""
        lastContextText = ctx

        scope.launch {
            if (token.isEmpty() && email.isNotEmpty() && password.isNotEmpty()) {
                token = BanterApi.login(baseUrl, email, password) ?: ""
                if (token.isNotEmpty()) prefs.edit().putString(Prefs.KEY_TOKEN, token).apply()
            }
            if (token.isEmpty()) {
                withContext(Dispatchers.Main) {
                    candidateView.setCandidates(listOf("Open Banter Keyboard app → set server + login"))
                }
                return@launch
            }
            val variants = BanterApi.generate(baseUrl, token, relationship, intent, tone, language, ctx, hurry)
            withContext(Dispatchers.Main) {
                if (!variants.isNullOrEmpty()) {
                    candidateView.setCandidates(variants)
                } else {
                    candidateView.setCandidates(listOf("No suggestions — tap Banter again"))
                }
            }
        }
    }

    private fun commitSuggestion(text: String) {
        val ic = currentInputConnection ?: return
        if (lastContextText.isNotEmpty()) {
            ic.deleteSurroundingText(lastContextText.length, 0)
        }
        ic.commitText(text, 1)
        candidateView.clear()
        lastContextText = ""
    }

    override fun onPress(primaryCode: Int) {}
    override fun onRelease(primaryCode: Int) {}
    override fun onText(text: CharSequence?) {}
    override fun swipeLeft() {}
    override fun swipeRight() {}
    override fun swipeDown() {}
    override fun swipeUp() {}

    companion object {
        const val KEYCODE_BANTER = -100
    }
}
