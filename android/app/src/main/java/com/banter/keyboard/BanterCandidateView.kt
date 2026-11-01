package com.banter.keyboard

import android.content.Context
import android.graphics.Color
import android.text.TextUtils
import android.util.AttributeSet
import android.view.Gravity
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Horizontal strip of suggestion chips shown above the keyboard.
 * Tapping a chip commits that suggestion via [onPick].
 */
class BanterCandidateView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : LinearLayout(context, attrs) {

    private val container = LinearLayout(context).apply {
        orientation = HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        setPadding(dp(8), dp(8), dp(8), dp(8))
    }

    var onPick: ((String) -> Unit)? = null

    init {
        orientation = HORIZONTAL
        val scroll = HorizontalScrollView(context).apply {
            isHorizontalScrollBarEnabled = false
            overScrollMode = OVER_SCROLL_NEVER
        }
        scroll.addView(container)
        addView(scroll, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
    }

    fun setCandidates(items: List<String>) {
        container.removeAllViews()
        for (text in items) {
            val isStatus = isStatusChip(text)
            val chip = TextView(context).apply {
                this.text = text
                gravity = Gravity.CENTER_VERTICAL
                setTextColor(if (isStatus) 0xFF9FD0FF.toInt() else Color.WHITE)
                textSize = if (isStatus) 13f else 14f
                maxLines = 2
                ellipsize = TextUtils.TruncateAt.END
                setPadding(dp(16), dp(9), dp(16), dp(9))
                minHeight = dp(38)
                maxWidth = if (isStatus) dp(360) else dp(300)
                setMargin(dp(5))
                background = makeChipBg(isStatus, text == "Undo")
                setOnClickListener { onPick?.invoke(text) }
            }
            container.addView(chip)
        }
    }

    fun clear() = container.removeAllViews()

    private fun isStatusChip(text: String): Boolean {
        return text == "Thinking…" ||
            text == "Undo" ||
            text == "Done ✓" ||
            text.startsWith("Open Banter") ||
            text.startsWith("No suggestions") ||
            text.startsWith("Type something") ||
            text.startsWith("Nothing to undo") ||
            text.startsWith("Restored original") ||
            text.startsWith("Banter is disabled")
    }

    private fun TextView.setMargin(px: Int) {
        val lp = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
        )
        lp.setMargins(px, 0, px, 0)
        layoutParams = lp
    }

    private fun makeChipBg(isStatus: Boolean, isUndo: Boolean): android.graphics.drawable.GradientDrawable {
        return android.graphics.drawable.GradientDrawable().apply {
            cornerRadius = dp(18).toFloat()
            if (isUndo) {
                setColor(0xFF243B63.toInt())
                setStroke(dp(1), 0xFF4AA8FF.toInt())
            } else if (isStatus) {
                setColor(0xFF141B2B.toInt())
                setStroke(dp(1), 0xFF274E78.toInt())
            } else {
                setColor(0xFF1C1C2A.toInt())
                setStroke(dp(1), 0xFF3A3A55.toInt())
            }
        }
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
