package com.example.appilot;

import android.content.Context;
import android.util.Log;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import java.io.IOException;
import java.security.GeneralSecurityException;

public class SessionManager {

    private static final String PREF_NAME = "session_prefs"; // Name for the preferences file
    private static final String KEY_AUTH_TOKEN = "auth_token"; // The key for storing the auth token
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

    // Save authentication token securely
    public void saveAuthToken(String token) {
        if (sharedPreferences != null) {
            sharedPreferences.edit()
                    .putString(KEY_AUTH_TOKEN, token)  // Save token securely
                    .apply();  // Commit changes
        } else {
            Log.e("SessionManager", "Failed to save auth token. SharedPreferences is not initialized.");
        }
    }

    // Retrieve the stored authentication token
    public String getAuthToken() {
        return sharedPreferences.getString(KEY_AUTH_TOKEN, null);  // Get token, return null if not found
    }

    // Check if the auth token exists
    public boolean hasAuthToken() {
        return getAuthToken() != null;  // Return true if token exists, false otherwise
    }

    // Clear the stored session (authentication token)
    public void clearSession() {
        sharedPreferences.edit()
                .remove(KEY_AUTH_TOKEN)  // Remove token
                .apply();  // Commit changes
    }

    // OPTIONAL: Check if the token has expired (remove if you don't need it)
    // public boolean isTokenExpired() {
    //     long expiryTime = getExpiryTime();
    //     return System.currentTimeMillis() > expiryTime; // Token is expired if current time is past the expiry time
    // }

    // OPTIONAL: Retrieve the stored expiry time (remove if not using expiry)
    // public long getExpiryTime() {
    //     return sharedPreferences.getLong(KEY_EXPIRY_TIME, 0);  // Return 0 if expiry time is not found
    // }
}
