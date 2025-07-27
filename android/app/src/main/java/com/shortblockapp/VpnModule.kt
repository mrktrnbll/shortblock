package com.shortblockapp

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import com.facebook.react.bridge.*

class VpnModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "VpnModule"

    @ReactMethod
    fun prepareVpn(promise: Promise) {
        val intent = VpnService.prepare(reactApplicationContext)
        if (intent != null) {
            promise.resolve("preparation_required")
            currentActivity?.startActivityForResult(intent, 100)
        } else {
            promise.resolve("prepared")
        }
    }

    @ReactMethod
    fun startVpn(promise: Promise) {
        val intent = Intent(reactApplicationContext, PacketLoggingVpnService::class.java)
        reactApplicationContext.startService(intent)
        promise.resolve(true)
    }

    @ReactMethod
    fun stopVpn(promise: Promise) {
        val intent = Intent(reactApplicationContext, PacketLoggingVpnService::class.java)
        reactApplicationContext.stopService(intent)
        promise.resolve(true)
    }

    @ReactMethod
    fun getVpnStatus(promise: Promise) {
        // For demo, always return false (implement actual status check as needed)
        promise.resolve(false)
    }
}