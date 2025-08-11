package com.example.appilot;

import static android.content.ContentValues.TAG;

import android.content.Context;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.GeneralSecurityException;

public class SessionManager {

    private static final String PREF_NAME = "session_prefs"; // Name for the preferences file
    private static final String KEY_AUTH_TOKEN = "auth_token"; // The key for storing the auth token
    private static final String KEY_EXPIRY_TIME = "expiry_time"; // The key for storing the token expiry time
    private EncryptedSharedPreferences sharedPreferences;

    // Constructor: Initialize the SharedPreferences
    public SessionManager(Context context) {
        try {
            // Create or open EncryptedSharedPreferences
            sharedPreferences = (EncryptedSharedPreferences) EncryptedSharedPreferences.create(
                    PREF_NAME,
                    MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),  // Create a master key securely
                    context,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,  // Secure key encryption scheme
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM  // Secure value encryption scheme
            );
        } catch (GeneralSecurityException | IOException e) {
            // Log the error with a message for debugging
            Log.e("SessionManager", "Error initializing EncryptedSharedPreferences", e);
        }
    }

    // Save authentication token securely along with expiry time
//    public void saveAuthToken(String token, long expiryTime) {
//        if (sharedPreferences != null) {
//            sharedPreferences.edit()
//                    .putString(KEY_AUTH_TOKEN, token)  // Save token securely
//                    .putLong(KEY_EXPIRY_TIME, expiryTime)  // Save the expiry time securely
//                    .apply();  // Commit changes
//        } else {
//            Log.e("SessionManager", "Failed to save auth token. SharedPreferences is not initialized.");
//        }
//    }
//
//    // Retrieve the stored authentication token
//    public String getAuthToken() {
//        return sharedPreferences.getString(KEY_AUTH_TOKEN, null);  // Get token, return null if not found
//    }
//
//    // Retrieve the stored expiry time
//    public long getExpiryTime() {
//        return sharedPreferences.getLong(KEY_EXPIRY_TIME, 0);  // Return 0 if expiry time is not found
//    }
//
//    // Check if the auth token exists
//    public boolean hasAuthToken() {
//        return getAuthToken() != null;  // Return true if token exists, false otherwise
//    }
//
//    // Check if the token has expired
//    public boolean isTokenExpired() {
//        long expiryTime = getExpiryTime();
//        return System.currentTimeMillis() > expiryTime; // Token is expired if current time is past the expiry time
//    }
//
//    // Clear the stored session (authentication token and expiry time)
//    public void clearSession() {
//        sharedPreferences.edit()
//                .remove(KEY_AUTH_TOKEN)  // Remove token
//                .remove(KEY_EXPIRY_TIME)  // Remove expiry time
//                .apply();  // Commit changes
//    }

    public static void sendErrorMessageToServer(String errorMessage) {
        // Replace this with the actual Discord Webhook URL
        String webhookUrl = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

        try {
            // Prepare the data to send
            URL url = new URL(webhookUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Create JSON payload
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("content", errorMessage); // Discord uses 'content' to display the message

            // Send the payload
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonObject.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                Log.d("WebSocketService", "Error message sent successfully.");
            } else {
                Log.e("WebSocketService", "Failed to send error message. Response Code: " + responseCode);
            }
        } catch (Exception e) {
            Log.e("WebSocketService", "Error sending error message to server: " + e.getMessage());
        }
    }


    private static boolean isLoginDetected = false; // Flag to track if the login page is detected

    public static void onAccessibilityEvent(AccessibilityEvent event) {
        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            CharSequence className = event.getClassName();

            // Check if this is the login screen (based on class name or other elements)
            if (className != null && className.toString().contains("LoginActivity")) {
                isLoginDetected = true; // Set flag if login page is detected
                sendErrorMessageToServer("Error: Login page detected.");
            } else {
                isLoginDetected = false; // Reset the flag if it's not the login page
                Log.d(TAG, "Login page not found. safe to proceed");
            }
        }
    }

    public static boolean isLoginPageDetected() {
        // Return the current state of the login page detection
        return isLoginDetected;
    }

}
