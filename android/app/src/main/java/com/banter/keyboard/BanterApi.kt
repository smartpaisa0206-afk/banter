package com.banter.keyboard

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Tiny HTTP client for the Banter mobile backend (/api/mobile/*).
 * Uses plain HttpURLConnection so there are no extra dependencies to manage.
 */
object BanterApi {

    suspend fun login(
        baseUrl: String,
        email: String,
        password: String,
        device: String = "android-keyboard",
    ): String? = withContext(Dispatchers.IO) {
        try {
            val url = URL("$baseUrl/api/mobile/login")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.doOutput = true
            val body = JSONObject().apply {
                put("email", email)
                put("password", password)
                put("device", device)
            }.toString()
            conn.outputStream.write(body.toByteArray())
            val code = conn.responseCode
            if (code in 200..299) {
                val txt = conn.inputStream.bufferedReader().readText()
                JSONObject(txt).optString("token").takeIf { it.isNotEmpty() }
            } else {
                Log.w("BanterApi", "login http $code")
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
            val url = URL("$baseUrl/api/mobile/generate")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.setRequestProperty("Content-Type", "application/json")
            conn.setRequestProperty("Authorization", "Bearer $token")
            conn.doOutput = true
            val body = JSONObject().apply {
                put("relationship", relationship)
                put("intent", intent)
                put("tone", tone)
                put("language", language)
                put("context", context)
                put("hurry", hurry)
            }.toString()
            conn.outputStream.write(body.toByteArray())
            val code = conn.responseCode
            if (code in 200..299) {
                val txt = conn.inputStream.bufferedReader().readText()
                val json = JSONObject(txt)
                val arr: JSONArray? = json.optJSONArray("variants")
                val list = mutableListOf<String>()
                if (arr != null) {
                    for (i in 0 until arr.length()) list.add(arr.getString(i))
                }
                list
            } else {
                Log.w("BanterApi", "generate http $code")
                null
            }
        } catch (e: Exception) {
            Log.e("BanterApi", "generate failed", e)
            null
        }
    }
}
