@file:Suppress("DEPRECATION")

package com.banter.keyboard

import android.content.ClipboardManager
import android.content.Intent
import android.net.Uri
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
 * - It only reads/sends text when the user taps the magic key.
 * - It disables Banter in sensitive fields like passwords.
 */
class BanterKeyboard : InputMethodService(), KeyboardView.OnKeyboardActionListener {

    private lateinit var kv: KeyboardView
    private lateinit var candidateView: BanterCandidateView
    private lateinit var toolExtra: TextView
    private lateinit var toolSettings: TextView
    private lateinit var toolMagic: TextView

    private var lastContextText: String = ""
    private var lastReplacementText: String = ""
    private var undoAvailable: Boolean = false
    private var banterDisabledForField: Boolean = false
    private var caps: Boolean = false
    private var symbols: Boolean = false

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onCreateInputView(): View {
        val view = layoutInflater.inflate(R.layout.keyboard_view, null)
        kv = view.findViewById(R.id.keyboard)
        candidateView = view.findViewById(R.id.candidates)
        toolExtra = view.findViewById(R.id.tool_extra)
        toolSettings = view.findViewById(R.id.tool_settings)
        toolMagic = view.findViewById(R.id.tool_magic)

        kv.keyboard = Keyboard(this, R.xml.qwerty)
        kv.setOnKeyboardActionListener(this)
        candidateView.onPick = { handleCandidateTap(it) }

        toolExtra.setOnClickListener { showExtraMenu() }
        toolSettings.setOnClickListener { openSettings() }
        toolMagic.setOnClickListener { requestBanterSuggestions() }

        updateToolbarUi()
        updateKeyboardCase()
        return view
    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
        candidateView.clear()
        lastContextText = ""
        lastReplacementText = ""
        undoAvailable = false
        banterDisabledForField = isSensitiveField(info)
        symbols = false
        caps = false
        kv.keyboard = Keyboard(this, R.xml.qwerty)
        updateKeyboardCase()
        if (banterDisabledForField) {
            candidateView.setCandidates(listOf("Magic is disabled in private fields"))
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }

    override fun onKey(primaryCode: Int, keyCodes: IntArray?) {
        val ic = currentInputConnection ?: return
        when (primaryCode) {
            Keyboard.KEYCODE_DELETE -> deleteSelectionOrChar()
            Keyboard.KEYCODE_DONE -> {
                ic.sendKeyEvent(KeyEvent(0, 0, KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_ENTER, 0))
                ic.sendKeyEvent(KeyEvent(0, 0, KeyEvent.ACTION_UP, KeyEvent.KEYCODE_ENTER, 0))
            }
            Keyboard.KEYCODE_SHIFT -> toggleCaps()
            KEYCODE_SYMBOLS -> toggleSymbols()
            KEYCODE_EMOJI -> ic.commitText("🙂", 1)
            else -> {
                if (primaryCode > 0) {
                    val ch = primaryCode.toChar()
                    ic.commitText(if (caps && ch.isLetter()) ch.uppercaseChar().toString() else ch.toString(), 1)
                    if (caps && ch.isLetter()) {
                        caps = false
                        updateKeyboardCase()
                    }
                }
            }
        }
    }

    private fun deleteSelectionOrChar() {
        val ic = currentInputConnection ?: return
        val selected = ic.getSelectedText(0)
        if (!selected.isNullOrEmpty()) {
            ic.commitText("", 1)
        } else {
            ic.deleteSurroundingText(1, 0)
        }
    }

    private fun toggleSymbols() {
        symbols = !symbols
        caps = false
        kv.keyboard = Keyboard(this, if (symbols) R.xml.symbols else R.xml.qwerty)
        updateKeyboardCase()
    }

    private fun showExtraMenu() {
        candidateView.setCandidates(listOf("Clipboard", "Share keyboard", "Modes", "Feedback"))
    }

    private fun showModes() {
        candidateView.setCandidates(listOf("Personal mode", "Professional mode"))
    }

    private fun applyMode(mode: String, showMessage: Boolean) {
        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        val editor = prefs.edit().putString(Prefs.KEY_MODE, mode)

        when (mode) {
            Prefs.MODE_PROFESSIONAL -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "stranger")
                .putString(Prefs.KEY_INTENT, "icebreaker")
                .putString(Prefs.KEY_TONE, "formal")
            else -> editor
                .putString(Prefs.KEY_RELATIONSHIP, "partner")
                .putString(Prefs.KEY_INTENT, "flirt")
                .putString(Prefs.KEY_TONE, "warm")
        }
        editor.apply()
        if (showMessage) candidateView.setCandidates(listOf("${modeLabel(mode)} selected"))
    }

    private fun modeLabel(mode: String): String = if (mode == Prefs.MODE_PROFESSIONAL) "Professional" else "Personal"

    private fun handleCandidateTap(text: String) {
        when (text) {
            "Clipboard" -> pasteClipboard()
            "Share keyboard" -> shareKeyboard()
            "Modes" -> showModes()
            "Feedback" -> openFeedback()
            "Personal mode" -> applyMode(Prefs.MODE_PERSONAL, showMessage = true)
            "Professional mode" -> applyMode(Prefs.MODE_PROFESSIONAL, showMessage = true)
            "Undo" -> undoLastSuggestion()
            else -> commitSuggestion(text)
        }
    }

    private fun pasteClipboard() {
        val cm = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        val text = cm.primaryClip?.getItemAt(0)?.coerceToText(this)?.toString()?.takeIf { it.isNotBlank() }
        if (text == null) {
            candidateView.setCandidates(listOf("Clipboard is empty"))
        } else {
            currentInputConnection?.commitText(text, 1)
            candidateView.setCandidates(listOf("Pasted from clipboard ✓"))
        }
    }

    private fun shareKeyboard() {
        val share = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, "Try Banter Keyboard beta: https://banter-mu.vercel.app")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(Intent.createChooser(share, "Share Banter Keyboard").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    private fun openSettings() {
        val intent = Intent(this, SettingsActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    private fun openFeedback() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://banter-mu.vercel.app/dashboard/feedback"))
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    private fun requestBanterSuggestions() {
        if (banterDisabledForField) {
            candidateView.setCandidates(listOf("Magic is disabled in private fields"))
            return
        }

        val prefs = getSharedPreferences(Prefs.NAME, MODE_PRIVATE)
        val baseUrl = (prefs.getString(Prefs.KEY_BASE_URL, Prefs.DEF_BASE_URL) ?: Prefs.DEF_BASE_URL).trim().trimEnd('/')
        val token = prefs.getString(Prefs.KEY_TOKEN, "") ?: ""
        val mode = prefs.getString(Prefs.KEY_MODE, Prefs.DEF_MODE) ?: Prefs.DEF_MODE
        val relationship = prefs.getString(Prefs.KEY_RELATIONSHIP, Prefs.DEF_RELATIONSHIP) ?: Prefs.DEF_RELATIONSHIP
        val intent = prefs.getString(Prefs.KEY_INTENT, Prefs.DEF_INTENT) ?: Prefs.DEF_INTENT
        val tone = prefs.getString(Prefs.KEY_TONE, Prefs.DEF_TONE) ?: Prefs.DEF_TONE
        val language = "en" // keyboard uses backend auto-detection from current text
        val hurry = prefs.getBoolean(Prefs.KEY_HURRY, false)

        val rawCtx = currentInputConnection?.getTextBeforeCursor(220, 0)?.toString() ?: ""
        val ctx = styleContext(mode, rawCtx.trim())
        if (rawCtx.trim().isBlank()) {
            candidateView.setCandidates(listOf("Type something first, then tap 🪄"))
            return
        }
        if (token.isBlank()) {
            candidateView.setCandidates(listOf("Open settings ⚙ and login first"))
            return
        }

        lastContextText = rawCtx
        candidateView.setCandidates(listOf("Thinking…"))

        scope.launch {
            val variants = BanterApi.generate(baseUrl, token, relationship, intent, tone, language, ctx, hurry)
            withContext(Dispatchers.Main) {
                if (!variants.isNullOrEmpty()) candidateView.setCandidates(variants.take(3))
                else candidateView.setCandidates(listOf("No suggestions. Try again."))
            }
        }
    }

    private fun commitSuggestion(text: String) {
        if (isSystemChip(text)) return

        val ic = currentInputConnection ?: return
        val original = lastContextText
        ic.beginBatchEdit()
        ic.finishComposingText()
        if (original.isNotEmpty()) ic.deleteSurroundingText(original.length, 0)
        ic.commitText(text, 1)
        ic.endBatchEdit()

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
        ic.beginBatchEdit()
        ic.finishComposingText()
        ic.deleteSurroundingText(lastReplacementText.length, 0)
        ic.commitText(lastContextText, 1)
        ic.endBatchEdit()
        lastReplacementText = ""
        undoAvailable = false
        candidateView.setCandidates(listOf("Restored original ✓"))
    }

    private fun isSystemChip(text: String): Boolean {
        return text == "Thinking…" || text == "Done ✓" ||
            text.endsWith("selected") ||
            text.startsWith("Open settings") ||
            text.startsWith("Open Banter") ||
            text.startsWith("Login expired") ||
            text.startsWith("This mode needs") ||
            text.startsWith("Upgrade") ||
            text.startsWith("Daily limit") ||
            text.startsWith("Network error") ||
            text.startsWith("Server error") ||
            text.startsWith("No suggestions") ||
            text.startsWith("Type something") ||
            text.startsWith("Nothing to undo") ||
            text.startsWith("Restored original") ||
            text.startsWith("Magic is disabled") ||
            text.endsWith("coming soon") ||
            text == "Clipboard is empty" ||
            text == "Pasted from clipboard ✓"
    }

    private fun styleContext(mode: String, text: String): String {
        val current = text.trim()
        val target = detectKeyboardLanguage(current)
        val languageRule = when (target) {
            "hing" -> "TARGET_LANGUAGE: Roman Hinglish only."
            "hi" -> "TARGET_LANGUAGE: Hindi only."
            "ta" -> "TARGET_LANGUAGE: Tamil only."
            "te" -> "TARGET_LANGUAGE: Telugu only."
            "bn" -> "TARGET_LANGUAGE: Bengali only."
            else -> "TARGET_LANGUAGE: English only."
        }
        return if (mode == Prefs.MODE_PROFESSIONAL) {
            "$languageRule STYLE: professional, clear, formal if needed, no emojis unless explicitly requested. TASK: rewrite or draft a professional message/email from the current text. CURRENT_USER_TEXT: $current"
        } else {
            "$languageRule STYLE: natural, friendly, concise, emojis only if natural. TASK: write a better sendable reply/message from the current text. CURRENT_USER_TEXT: $current"
        }
    }

    private fun detectKeyboardLanguage(text: String): String {
        if (text.isBlank()) return "en"
        if (Regex("[\u0900-\u097F]").containsMatchIn(text)) return "hi"
        if (Regex("[\u0B80-\u0BFF]").containsMatchIn(text)) return "ta"
        if (Regex("[\u0C00-\u0C7F]").containsMatchIn(text)) return "te"
        if (Regex("[\u0980-\u09FF]").containsMatchIn(text)) return "bn"
        val lower = text.lowercase()
        val hinglish = Regex("(^|[^a-z])(kkrh|krrh|kr rhe|kr rha|kr rhi|kya|ky|tm|tum|nhi|nahi|khna|khana|kha liya|khya liya|yaar|acha|aaj|kal)([^a-z]|$)")
        return if (hinglish.containsMatchIn(lower)) "hing" else "en"
    }

    private fun toggleCaps() {
        caps = !caps
        updateKeyboardCase()
    }

    private fun updateKeyboardCase() {
        val keyboard = kv.keyboard ?: return
        for (key in keyboard.keys) {
            val label = key.label?.toString() ?: continue
            if (label.length == 1 && label[0].isLetter()) {
                key.label = if (caps) label.uppercase() else label.lowercase()
            }
            if (key.codes != null && key.codes.isNotEmpty() && key.codes[0] == Keyboard.KEYCODE_SHIFT) {
                key.label = if (caps) "⇧" else "⇧"
            }
        }
        kv.invalidateAllKeys()
        updateToolbarUi()
    }

    private fun updateToolbarUi() {
        fun bg(fill: Int, stroke: Int): GradientDrawable = GradientDrawable().apply {
            cornerRadius = dp(18).toFloat()
            setColor(fill)
            setStroke(dp(1), stroke)
        }
        toolExtra.background = bg(0xFF171722.toInt(), 0xFF34344A.toInt())
        toolSettings.background = bg(0xFF171722.toInt(), 0xFF34344A.toInt())
        toolMagic.background = bg(0xFF243B63.toInt(), 0xFF4AA8FF.toInt())
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

    override fun onPress(primaryCode: Int) {}
    override fun onRelease(primaryCode: Int) {}
    override fun onText(text: CharSequence?) {}
    override fun swipeLeft() {}
    override fun swipeRight() {}
    override fun swipeDown() {}
    override fun swipeUp() {}

    companion object {
        const val KEYCODE_SYMBOLS = -102
        const val KEYCODE_EMOJI = -103
    }
}
