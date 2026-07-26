package com.banter.keyboard

import android.content.Context
import android.graphics.Color
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
        setPadding(12, 8, 12, 8)
    }

    var onPick: ((String) -> Unit)? = null

    init {
        orientation = HORIZONTAL
        val scroll = HorizontalScrollView(context).apply { isHorizontalScrollBarEnabled = false }
        scroll.addView(container)
        addView(scroll)
    }

    fun setCandidates(items: List<String>) {
        container.removeAllViews()
        for (text in items) {
            val chip = TextView(context).apply {
                this.text = text
                this.gravity = Gravity.CENTER_VERTICAL
                setTextColor(Color.WHITE)
                setPadding(24, 14, 24, 14)
                val pad = (6 * resources.displayMetrics.density).toInt()
                setMargin(pad)
                background = makeChipBg()
                setOnClickListener { onPick?.invoke(text) }
            }
            container.addView(chip)
        }
    }

    fun clear() = container.removeAllViews()

    private fun TextView.setMargin(px: Int) {
        val lp = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
        )
        lp.setMargins(px, 0, px, 0)
        layoutParams = lp
    }

    private fun makeChipBg(): android.graphics.drawable.GradientDrawable {
        return android.graphics.drawable.GradientDrawable().apply {
            setColor(0xFF1C1C2A.toInt())
            cornerRadius = 18 * resources.displayMetrics.density
            setStroke(1, 0xFF3A3A55.toInt())
        }
    }
}
