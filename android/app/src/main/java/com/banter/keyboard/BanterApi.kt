package com.banter.keyboard

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Tiny HTTP client for Banter mobile backend.
 * Endpoints used:
 * - POST /api/mobile/login
 * - POST /api/mobile/generate
 */
object BanterApi {

    suspend fun login(
        baseUrl: String,
        email: String,
        password: String,
        device: String = "android-keyboard",
    ): String? = withContext(Dispatchers.IO) {
        try {
            val conn = (URL("$baseUrl/api/mobile/login").openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                connectTimeout = 15000
                readTimeout = 20000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("email", email)
                put("password", password)
                put("device", device)
            }.toString()

            conn.outputStream.use { it.write(body.toByteArray()) }
            val code = conn.responseCode

            if (code in 200..299) {
                val txt = conn.inputStream.bufferedReader().use { it.readText() }
                JSONObject(txt).optString("token").takeIf { it.isNotEmpty() }
            } else {
                val err = conn.errorStream?.bufferedReader()?.use { it.readText() }
                Log.w("BanterApi", "login http $code $err")
                null
            }
        } catch (e: Exception) {
            Log.e("BanterApi", "login failed", e)
            null
        }
    }

    suspend fun generate(
        baseUrl: String,
        token: String,
        relationship: String,
        intent: String,
        tone: String,
        language: String,
        context: String,
        hurry: Boolean,
    ): List<String>? = withContext(Dispatchers.IO) {
        try {
            val conn = (URL("$baseUrl/api/mobile/generate").openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Authorization", "Bearer $token")
                connectTimeout = 15000
                readTimeout = 30000
                doOutput = true
            }

            val body = JSONObject().apply {
                put("relationship", relationship)
                put("intent", intent)
                put("tone", tone)
                put("language", language)
                put("context", context)
                put("hurry", hurry)
            }.toString()

            conn.outputStream.use { it.write(body.toByteArray()) }
            val code = conn.responseCode

            if (code in 200..299) {
                val txt = conn.inputStream.bufferedReader().use { it.readText() }
                val json = JSONObject(txt)
                val arr: JSONArray? = json.optJSONArray("variants")
                val list = mutableListOf<String>()
                if (arr != null) {
                    for (i in 0 until arr.length()) {
                        val value = arr.optString(i)
                        if (value.isNotBlank()) list.add(value)
                    }
                }
                list
            } else {
                val err = conn.errorStream?.bufferedReader()?.use { it.readText() }
                Log.w("BanterApi", "generate http $code $err")
                val serverMessage = try {
                    if (!err.isNullOrBlank()) JSONObject(err).optString("error") else ""
                } catch (_: Exception) {
                    ""
                }
                when (code) {
                    401 -> listOf("Login expired — open Banter Keyboard app and Save again")
                    403 -> listOf(serverMessage.ifBlank { "This mode needs Plus access" })
                    429 -> listOf(serverMessage.ifBlank { "Daily limit reached" })
                    else -> listOf(serverMessage.ifBlank { "Server error. Try again later" })
                }
            }
        } catch (e: Exception) {
            Log.e("BanterApi", "generate failed", e)
            listOf("Network error — check internet/server")
        }
    }
}
