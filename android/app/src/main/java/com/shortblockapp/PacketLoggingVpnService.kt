package com.shortblockapp

import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.util.concurrent.Executors

class PacketLoggingVpnService : VpnService() {
    private var vpnInterface: ParcelFileDescriptor? = null
    private val executor = Executors.newSingleThreadExecutor()
    @Volatile private var running = false

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (vpnInterface == null) {
            val builder = Builder()
            builder.addAddress("10.0.0.2", 32)
            builder.addRoute("0.0.0.0", 0)
            builder.setSession("Shortblock VPN")
            val configureIntent = PendingIntent.getActivity(this, 0, Intent(), 0)
            builder.setConfigureIntent(configureIntent)
            vpnInterface = builder.establish()
        }
        running = true
        executor.execute { runVpn() }
        return START_STICKY
    }

    override fun onDestroy() {
        running = false
        vpnInterface?.close()
        vpnInterface = null
        super.onDestroy()
    }

    private fun runVpn() {
        val input = FileInputStream(vpnInterface?.fileDescriptor)
        val output = FileOutputStream(vpnInterface?.fileDescriptor)
        val buffer = ByteArray(32767)
        while (running) {
            val length = input.read(buffer)
            if (length > 0) {
                // Log the packet (for demo, just log the first bytes as hex)
                val hex = buffer.take(length).joinToString(" ") { "%02x".format(it) }
                Log.d("ShortblockVPN", "Packet: $hex")
                // Optionally, forward packets (not implemented here)
            }
        }
    }
}