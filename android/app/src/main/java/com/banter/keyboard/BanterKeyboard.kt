@file:Suppress("DEPRECATION")

package com.banter.keyboard

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.inputmethodservice.InputMethodService
import android.inputmethodservice.Keyboard
import android.inputmethodservice.KeyboardView
import android.text.InputType
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Banter system keyboard MVP.
 *
 * Privacy behavior:
 * - It does NOT upload while the user is normally typing.
 * - It only reads/sends text when the user taps the Banter key.
 * - It disables Banter in sensitive fields like passwords.
 */
class BanterKeyboard : InputMethodService(), KeyboardView.OnKeyboardActionListener {

    private lateinit var kv: KeyboardView
    private lateinit var candidateView: BanterCandidateView
    private lateinit var personalMode: TextView
    private lateinit var professionalMode: TextView
    private lateinit var genzMode: TextView
    private lateinit var roastMode: TextView

    private var lastContextText: String = ""
    private var lastReplacementText: String = ""
    private var undoAvailable: Boolean = false
    private var banterDisabledForField: Boolean = false

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateInputView(): View {
        val view = layoutInflater.inflate(R.layout.keyboard_view, null)
        kv = view.findViewById(R.id.keyboard)
        candidateView = view.findViewById(R.id.candidates)
        personalMode = view.findViewById(R.id.mode_personal)
        professionalMode = view.findViewById(R.id.mode_professional)
        genzMode = view.findViewById(R.id.mode_genz)
        roastMode = view.findViewById(R.id.mode_roast)

        kv.keyboard = Keyboard(this, R.xml.qwerty)
        kv.setOnKeyboardActionListener(this)
        candidateView.onPick = { commitSuggestion(it) }

        personalMode.setOnClickListener { applyMode(Prefs.MODE_PERSONAL, showMessage = true) }
        professionalMode.setOnClickListener { applyMode(Prefs.MODE_PROFESSIONAL, showMessage = true) }
        genzMode.setOnClickListener { applyMode(Prefs.MODE_GENZ, showMessage = true) }
        roastMode.setOnClickListener { applyMode(Prefs.MODE_ROAST, showMessage = true) }

        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        applyMode(prefs.getString(Prefs.KEY_MODE, Prefs.DEF_MODE) ?: Prefs.DEF_MODE, showMessage = false)

        return view
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        candidateView.clear()
        lastContextText = ""
        lastReplacementText = ""
        undoAvailable = false
        banterDisabledForField = isSensitiveField(info)
        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        updateModeUi(prefs.getString(Prefs.KEY_MODE, Prefs.DEF_MODE) ?: Prefs.DEF_MODE)
        if (banterDisabledForField) {
            candidateView.setCandidates(listOf("Banter is disabled in private fields"))
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
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
            KEYCODE_UNDO -> undoLastSuggestion()
            else -> {
                if (primaryCode > 0) ic.commitText(primaryCode.toChar().toString(), 1)
            }
        }
    }

    private fun applyMode(mode: String, showMessage: Boolean) {
        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        val editor = prefs.edit().putString(Prefs.KEY_MODE, mode)

        when (mode) {
            Prefs.MODE_PROFESSIONAL -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "client")
                .putString(Prefs.KEY_INTENT, "email_professional")
                .putString(Prefs.KEY_TONE, "formal")
            Prefs.MODE_GENZ -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "friend")
                .putString(Prefs.KEY_INTENT, "genz_reply")
                .putString(Prefs.KEY_TONE, "genz")
            Prefs.MODE_ROAST -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "friend")
                .putString(Prefs.KEY_INTENT, "roast_comeback")
                .putString(Prefs.KEY_TONE, "savage")
            else -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "partner")
                .putString(Prefs.KEY_INTENT, "flirt")
                .putString(Prefs.KEY_TONE, "warm")
        }
        editor.apply()
        updateModeUi(mode)
        if (showMessage) {
            candidateView.setCandidates(listOf("${modeLabel(mode)} mode selected"))
        }
    }

    private fun updateModeUi(active: String) {
        styleMode(personalMode, active == Prefs.MODE_PERSONAL, 0xFF7C5CFF.toInt())
        styleMode(professionalMode, active == Prefs.MODE_PROFESSIONAL, 0xFF4AA8FF.toInt())
        styleMode(genzMode, active == Prefs.MODE_GENZ, 0xFFA78BFA.toInt())
        styleMode(roastMode, active == Prefs.MODE_ROAST, 0xFFE9C46A.toInt())
    }

    private fun styleMode(view: TextView, active: Boolean, color: Int) {
        view.setTextColor(if (active) Color.WHITE else 0xFFB9B9C8.toInt())
        view.background = GradientDrawable().apply {
            cornerRadius = dp(18).toFloat()
            setColor(if (active) adjustAlpha(color, 0.35f) else 0xFF171722.toInt())
            setStroke(dp(1), if (active) color else 0xFF34344A.toInt())
        }
    }

    private fun modeLabel(mode: String): String {
        return when (mode) {
            Prefs.MODE_PROFESSIONAL -> "Professional"
            Prefs.MODE_GENZ -> "Gen-Z"
            Prefs.MODE_ROAST -> "Roast"
            else -> "Personal"
        }
    }

    private fun requestBanterSuggestions() {
        if (banterDisabledForField) {
            candidateView.setCandidates(listOf("Banter is disabled in private fields"))
            return
        }

        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        val baseUrl = (prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL) ?: Prefs.DEF_BASE_URL).trim().trimEnd('/')
        val token = prefs.getString(Prefs.KEY_TOKEN, "") ?: ""
        val relationship = prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP) ?: Prefs.DEF_RELATIONSHIP
        val intent = prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT) ?: Prefs.DEF_INTENT
        val tone = prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE) ?: Prefs.DEF_TONE
        val language = prefs.getString(Prefs.KEY_LANGUAGE, Prefs.DEF_LANGUAGE) ?: Prefs.DEF_LANGUAGE
        val hurry = prefs.getBoolean(Prefs.KEY_HURRY, false)

        val ctx = currentInputConnection?.getTextBeforeCursor(200, 0)?.toString()?.trim() ?: ""
        if (ctx.isBlank()) {
            candidateView.setCandidates(listOf("Type something first, then tap Banter ✨"))
            return
        }
        if (token.isBlank()) {
            candidateView.setCandidates(listOf("Open Banter Keyboard app → login first"))
            return
        }

        lastContextText = ctx
        candidateView.setCandidates(listOf("Thinking…"))

        scope.launch {
            val variants = BanterApi.generate(baseUrl, token, relationship, intent, tone, language, ctx, hurry)
            withContext(Dispatchers.Main) {
                if (!variants.isNullOrEmpty()) {
                    candidateView.setCandidates(variants.take(3))
                } else {
                    candidateView.setCandidates(listOf("No suggestions. Check login/server, then try again."))
                }
            }
        }
    }

    private fun commitSuggestion(text: String) {
        if (isSystemChip(text)) return

        val ic = currentInputConnection ?: return
        val original = lastContextText
        if (original.isNotEmpty()) {
            ic.deleteSurroundingText(original.length, 0)
        }
        ic.commitText(text, 1)

        lastContextText = original
        lastReplacementText = text
        undoAvailable = original.isNotEmpty()
        candidateView.setCandidates(listOf("Undo", "Done ✓"))
    }

    private fun undoLastSuggestion() {
        if (!undoAvailable || lastReplacementText.isBlank()) {
            candidateView.setCandidates(listOf("Nothing to undo"))
            return
        }
        val ic = currentInputConnection ?: return
        ic.deleteSurroundingText(lastReplacementText.length, 0)
        ic.commitText(lastContextText, 1)
        lastReplacementText = ""
        undoAvailable = false
        candidateView.setCandidates(listOf("Restored original ✓"))
    }

    private fun isSystemChip(text: String): Boolean {
        if (text == "Undo") {
            undoLastSuggestion()
            return true
        }
        return text == "Thinking…" ||
            text == "Done ✓" ||
            text.endsWith("mode selected") ||
            text.startsWith("Open Banter") ||
            text.startsWith("No suggestions") ||
            text.startsWith("Type something") ||
            text.startsWith("Nothing to undo") ||
            text.startsWith("Restored original") ||
            text.startsWith("Banter is disabled")
    }

    private fun isSensitiveField(info: EditorInfo?): Boolean {
        val inputType = info?.inputType ?: return false
        val variation = inputType and InputType.TYPE_MASK_VARIATION
        val clazz = inputType and InputType.TYPE_MASK_CLASS

        val passwordVariations = setOf(
            InputType.TYPE_TEXT_VARIATION_PASSWORD,
            InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD,
            InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD,
            InputType.TYPE_NUMBER_VARIATION_PASSWORD,
        )

        if (variation in passwordVariations) return true
        if (clazz == InputType.TYPE_CLASS_NUMBER && variation == InputType.TYPE_NUMBER_VARIATION_PASSWORD) return true
        if (info.imeOptions and EditorInfo.IME_FLAG_NO_PERSONALIZED_LEARNING != 0) return true
        return false
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private fun adjustAlpha(color: Int, factor: Float): Int {
        val alpha = (Color.alpha(color) * factor).toInt()
        return Color.argb(alpha, Color.red(color), Color.green(color), Color.blue(color))
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
        const val KEYCODE_UNDO = -101
    }
}
