package com.screenshottoggler



import android.app.Activity
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.os.Handler
import android.os.Looper

class ScreenshotToggleModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenshotToggleModule"
    }

    @ReactMethod
    fun toggleScreenshot(enable: Boolean, promise: Promise) {
        val activity: Activity? = currentActivity
        if (activity == null) {
            promise.reject("ERROR", "Activity is null")
            return
        }

        // Ensure the UI update happens on the main thread
        Handler(Looper.getMainLooper()).post {
            try {
                if (enable) {
                    activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                } else {
                    activity.window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                }
                promise.resolve(enable)
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        }
    }
}
