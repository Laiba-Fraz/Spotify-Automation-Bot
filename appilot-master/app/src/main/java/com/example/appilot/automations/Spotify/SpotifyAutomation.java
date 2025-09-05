package com.example.appilot.automations.spotify;

import com.example.appilot.automations.spotify.SessionConfig;
import static com.example.appilot.utils.HelperFunctions.findNodesByViewId;
import com.example.appilot.automations.spotify.SpotifyAutomationScheduler;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;

import android.accessibilityservice.AccessibilityService;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Bundle;
import android.util.Log;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.ArrayList;
import java.util.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.SharedPreferences;


import java.util.Map;

import com.example.appilot.automations.Interfaces.Action;
import com.example.appilot.automations.PopUpHandlers.Spotify.SpotifyPopUp;
import com.example.appilot.services.MyAccessibilityService;
import com.example.appilot.utils.HelperFunctions;

import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.graphics.Rect;

import java.util.List;
import java.util.Random;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;

import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Toast;


public class SpotifyAutomation {
    private String currentSong = null; // Variable to store the current song
    private boolean isSongPlaying = false; // Tracks whether the song is playing or paused
    private static final int MAX_SONGS_PER_DAY = 10000;
    private static final String PREF_NAME = "SpotifyStats";
    private static final String KEY_DATE = "last_date";
    private static final String KEY_HISTORY = "song_history";
    private StringBuilder songHistory = new StringBuilder(); // StringBuilder to store song names
    private static final String TAG = "SpotifyAutomation";
    private final Context context;
    private HelperFunctions helperFunctions;
    private MyAccessibilityService service;
    private final Handler handler;
    private final Random random;
    private SpotifyPopUp spotifyPopUp;
    private boolean shouldStop = false;
    private String endTime;
    private StringBuilder returnMessageBuilder = new StringBuilder();
    private String taskId;
    private String jobId;
    private List<Object> inputs;
    private SpotifyAutomationScheduler scheduler;
    public SpotifyAutomation(MyAccessibilityService service, String taskId, String jobId, List<Object> inputs) {
        this.context = service;
        this.service = service;
        this.taskId = taskId;
        this.jobId = jobId;
        this.inputs = inputs;
        this.handler = new Handler(Looper.getMainLooper());
        this.random = new Random();
        this.helperFunctions = new HelperFunctions(context, taskId, jobId);
        this.spotifyPopUp = new SpotifyPopUp(this.service, this.handler, this.random, this.helperFunctions);
//        this.sessionManager = new SessionManager(context);

        // Convert List<Object> to JSONArray for safe parsing
        JSONArray jsonInputs = new JSONArray();
        for (Object obj : inputs) {
            if (obj instanceof JSONObject) {
                jsonInputs.put((JSONObject) obj);
            } else {
                Log.w(TAG, "⚠️ Unexpected input type: " + obj.getClass());
            }
        }

        // Now pass to buildSessionList
        this.scheduler = new SpotifyAutomationScheduler(this, buildSessionList(jsonInputs));
    }
    public List<SessionConfig> buildSessionList(JSONArray inputs) {
        List<SessionConfig> sessionList = new ArrayList<>();

        try {
            for (int i = 0; i < inputs.length(); i++) {
                JSONObject groupObj = inputs.getJSONObject(i);

                if (groupObj.has("Scheduler")) {
                    JSONArray schedulerFields = groupObj.getJSONArray("Scheduler");

                    for (int j = 0; j < schedulerFields.length(); j++) {
                        JSONObject schedulerField = schedulerFields.getJSONObject(j);
                        String key = schedulerField.keys().next();

                        if (key.equals("Session Details")) {
                            JSONArray sessionArray = schedulerField.getJSONArray(key);

                            for (int k = 0; k < sessionArray.length(); k++) {
                                JSONObject sessionObj = sessionArray.getJSONObject(k);

                                JSONObject duration = sessionObj.getJSONObject("duration");
                                int hours = duration.optInt("hours", 0);
                                int minutes = duration.optInt("minutes", 0);
                                long durationMillis = (hours * 60L + minutes) * 60_000;

                                int clones = sessionObj.optInt("clones", 1);

                                sessionList.add(new SessionConfig(durationMillis, clones));
                            }
                        }
                    }
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error parsing session list", e);
        }

        return sessionList;
    }
    public List<String> getPackageIdsFromInputs() {
        List<String> packageIds = new ArrayList<>();

        try {
            JSONArray jsonInputs = new JSONArray();
            for (Object obj : inputs) {
                if (obj instanceof JSONObject) {
                    jsonInputs.put((JSONObject) obj);
                }
            }

            for (int i = 0; i < jsonInputs.length(); i++) {
                JSONObject groupObj = jsonInputs.getJSONObject(i);

                if (groupObj.has("Set Package Ids")) {
                    JSONArray packageFields = groupObj.getJSONArray("Set Package Ids");

                    for (int j = 0; j < packageFields.length(); j++) {
                        JSONObject packageField = packageFields.getJSONObject(j);

                        if (packageField.has("App Package IDs")) {
                            JSONArray packageArray = packageField.getJSONArray("App Package IDs");

                            for (int k = 0; k < packageArray.length(); k++) {
                                String packageId = packageArray.getString(k);
                                packageIds.add(packageId);
                            }
                        }
                    }
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error parsing package IDs from inputs", e);
        }

        return packageIds;
    }
    private void logPackageIds() {
        Log.d(TAG, "=== PACKAGE IDS LOGGING START ===");

        List<String> packageIds = getPackageIdsFromInputs();

        if (packageIds.isEmpty()) {
            Log.d(TAG, "No package IDs found in inputs");
        } else {
            Log.d(TAG, "Total package IDs found: " + packageIds.size());

            for (int i = 0; i < packageIds.size(); i++) {
                Log.d(TAG, "Package ID [" + i + "]: " + packageIds.get(i));
            }
        }

        Log.d(TAG, "=== PACKAGE IDS LOGGING END ===");
    }

    public void start() {
            startAutomation();  // Proceed with automation
    }
    private int parseIntSafe(Object value) {
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception e) {
            return 0;
        }
    }
    public void startAutomation() {
        Log.d(TAG, "Starting Original Spotify Automation...");

//        startTemp();

//       loadOrResetHistory();

        // ✅ Start the scheduler here
        scheduler.startScheduler();

        // 🔁 Optionally comment/remove this line to let scheduler handle session start
        // start_original(() -> {
        //     Log.d(TAG, "✅ Original automation completed!");
        // });

        // Optional: Only if you want to monitor song changes outside the scheduler
//        handler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                // monitorSongChanges();
//                handler.postDelayed(this, 2000);
//            }
//        }, 2000);
    }
    public void launchApp(String packageId, Action callback) {
        Log.d(TAG, "Launching app: " + packageId);
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(packageId);

        if (intent != null) {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(intent);

            handler.postDelayed(() -> {
                if (spotifyPopUp.handleLaunchPopups(callback)) {
                    Log.i(TAG, "After Launching " + packageId + " Found a PopUp handling it through Gesture");
                    return;
                }
                callback.execute();
            }, 5000 + random.nextInt(5000));
        } else {
            Log.e(TAG, "Could not launch app: " + packageId);
            launchAppExplicitly(packageId, callback); // ✅ Updated to pass packageId
        }
    }
    private void launchAppExplicitly(String packageId, Action callback) {
        Log.d(TAG, "Entered launchAppExplicitly.");
        Intent intent = new Intent(Intent.ACTION_VIEW)
                .setData(Uri.parse("https://open.spotify.com/")) // Optional: change URI based on packageId if needed
                .setPackage(packageId)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        try {
            context.startActivity(intent);
            handler.postDelayed(() -> {
                if (spotifyPopUp.handleLaunchPopups(callback)) {
                    Log.i(TAG, "After launching app found a popup; handling it through gesture.");
                    return;
                }
                callback.execute();
            }, 5000 + random.nextInt(5000));
        } catch (Exception e) {
            Log.e(TAG, "Failed to launch app with package: " + packageId, e);
        }
    }
    private void loadOrResetHistory() {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
        String storedDate = prefs.getString(KEY_DATE, "");

        if (!today.equals(storedDate)) {
            // 📆 New day → reset song history
            songHistory = new StringBuilder();
            prefs.edit()
                    .putString(KEY_DATE, today)          // update to today's date
                    .putString(KEY_HISTORY, "")          // clear song history
                    .apply();

            Log.d(TAG, "🕛 New day detected. Song history reset.");
        } else {
            // 📆 Same day → restore previous song history
            String saved = prefs.getString(KEY_HISTORY, "");
            songHistory = new StringBuilder(saved);
            Log.d(TAG, "📅 Resuming song history from SharedPreferences.");
        }
    }
    public void closeMyApp(Action onComplete) {
        if (shouldContinueAutomation()) {
            return;
        }

        AccessibilityService service = (MyAccessibilityService) this.context;
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
        handler.postDelayed(() -> {
            service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);
            handler.postDelayed(() -> {
                closeAppAndClickCenter(onComplete);  // ← PASS callback to this method
            }, 3000);
        }, 1500 + random.nextInt(1500));
    }
    private void closeAppAndClickCenter(Action onComplete) {  // ← ADD callback parameter
        Log.d(TAG, "closeAppAndClickCenter: entered");
        if (shouldContinueAutomation()) {
            return;
        }

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        swipePath.moveTo(screenWidth / 2f, screenHeight * 0.6f);
        swipePath.lineTo(screenWidth / 2f, screenHeight * 0.05f);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 200, 300));

        MyAccessibilityService service = (MyAccessibilityService) context;
        service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
            @Override
            public void onCompleted(GestureDescription gestureDescription) {
                handler.postDelayed(() -> {
                    helperFunctions.clickInCenter();

                    // ← EXECUTE callback AFTER app is fully closed
                    handler.postDelayed(() -> {
                        Log.d(TAG, "✅ App fully closed and cleared from recent tabs");
                        if (onComplete != null) {
                            onComplete.execute();
                        }
                    }, 3000);  // Wait 3 seconds after clicking center
                }, 2000);
            }

            @Override
            public void onCancelled(GestureDescription gestureDescription) {
                Log.e(TAG, "Swipe gesture was cancelled.");
                if (onComplete != null) {
                    onComplete.execute();
                }
            }
        }, null);
    }
    public void goToSearchTab(Action CallBack) {
        Log.d(TAG, "Attempting to navigate to Search tab in Spotify");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null, cannot proceed");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Could not access root window", "error");
            }, 1000);
            return;
        }

        AccessibilityNodeInfo searchTab = HelperFunctions.findNodeByContentDesc(rootNode, "Search, Tab 2 of 5");

        if (searchTab != null) {
            Rect bounds = new Rect();
            searchTab.getBoundsInScreen(bounds);
            helperFunctions.clickOnBounds(bounds, CallBack, "Center", 1500, 3000, helperFunctions);
        } else {
            Log.e(TAG, "Search tab not found via content-desc");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Search tab not found", "error");
            }, 1000);
        }
    }
    public void goToHomeTab(Action CallBack) {
        Log.d(TAG, "Attempting to navigate to Home tab");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Root node null while navigating to Home", "error");
            }, 1000);
            return;
        }

        // Find the "Home" tab using content-desc
        AccessibilityNodeInfo homeTab = HelperFunctions.findNodeByContentDesc(rootNode, "Home, Tab 1 of 4");

        if (homeTab != null) {
            Rect bounds = new Rect();
            homeTab.getBoundsInScreen(bounds);
            helperFunctions.clickOnBounds(bounds, CallBack, "Center", 1500, 3000, helperFunctions);
        } else {
            Log.e(TAG, "Home tab not found via content-desc");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Home tab not found", "error");
            }, 1000);
        }
    }
    public void goToYourLibraryTab(Action CallBack) {
        Log.d(TAG, "Attempting to navigate to Your Library tab");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Root node null while navigating to Your Library", "error");
            }, 1000);
            return;
        }

        AccessibilityNodeInfo libraryTab = HelperFunctions.findNodeByContentDesc(rootNode, "Your Library, Tab 3 of 4");

        if (libraryTab != null) {
            Rect bounds = new Rect();
            libraryTab.getBoundsInScreen(bounds);
            helperFunctions.clickOnBounds(bounds, CallBack, "Center", 1500, 3000, helperFunctions);
        } else {
            Log.e(TAG, "Your Library tab not found via content-desc");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Your Library tab not found", "error");
            }, 1000);
        }
    }
    public void goToYourLibraryTabPremium(Action CallBack) {
        Log.d(TAG, "Attempting to navigate to Your Library tab");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Root node null while navigating to Your Library", "error");
            }, 1000);
            return;
        }

        AccessibilityNodeInfo libraryTab = HelperFunctions.findNodeByContentDesc(rootNode, "Your Library, Tab 3 of 4");

        if (libraryTab != null) {
            Rect bounds = new Rect();
            libraryTab.getBoundsInScreen(bounds);
            helperFunctions.clickOnBounds(bounds, CallBack, "Center", 1500, 3000, helperFunctions);
        } else {
            Log.e(TAG, "Your Library tab not found via content-desc");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Your Library tab not found", "error");
            }, 1000);
        }
    }
    public void clickSearchBar(Action callback) {
        Log.d(TAG, "Attempting to click search bar...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in clickSearchBar");
            helperFunctions.cleanupAndExit("Root node null while clicking search bar", "error");
            return;
        }

        AccessibilityNodeInfo searchBar = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/find_search_field_text", 2);

        if (searchBar != null) {
            if (searchBar.isClickable() && searchBar.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                Log.i(TAG, "Clicked search bar directly.");
                handler.postDelayed(callback::execute, 1500 + random.nextInt(2000));
            } else {
                Rect bounds = new Rect();
                searchBar.getBoundsInScreen(bounds);
                helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
            }
        } else {
            Log.e(TAG, "Search bar not found.");
            helperFunctions.cleanupAndExit("Search bar not found", "error");
        }
    }
    public void typeSongName(Action callback) {
        Log.d(TAG, "Attempting to type song name...");
        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in typeSongName");
            helperFunctions.cleanupAndExit("Root node null while typing song", "error");
            return;
        }

        AccessibilityNodeInfo inputField = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/query", 2);

        if (inputField != null && inputField.isEditable()) {
            String songName = getSongNameFromInputs();// dynamic from input list
            helperFunctions.setText(inputField, songName);

            // Wait for typing to complete, then click search button
            handler.postDelayed(() -> {
                Log.d(TAG, "Attempting to click search button...");

                AccessibilityNodeInfo searchButton = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/row_root", 2);

                if (searchButton != null) {
                    if (searchButton.isClickable() && searchButton.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                        Log.i(TAG, "Clicked search button directly.");
                    } else {
                        Rect bounds = new Rect();
                        searchButton.getBoundsInScreen(bounds);
                        helperFunctions.clickOnBounds(bounds, () -> {
                        }, "Center", 0, 0, helperFunctions);
                    }

                    // Wait for search to trigger, then execute callback
                    handler.postDelayed(callback::execute, 1500 + random.nextInt(1000));

                } else {
                    Log.e(TAG, "Search button not found.");
                    // Still execute callback even if search button not found
                    handler.postDelayed(callback::execute, 1000);
                }

            }, 1500 + random.nextInt(2000));

        } else {
            Log.e(TAG, "Search input field not found or not editable.");
            helperFunctions.cleanupAndExit("Cannot type song", "error");
        }
    }
    private String getSongNameFromInputs() {
        Log.d(TAG, "Inside getSongNameFromInputs() ");
        // 1) Dump raw payload
        try {
            Log.d(TAG, "🔍 Raw inputs:\n" + new JSONArray(inputs).toString(2));
        } catch (JSONException e) {
            Log.e(TAG, "Error logging raw inputs", e);
        }

        // 2) Parse & extract
        try {
            JSONArray groups = new JSONArray(inputs);
            for (int i = 0; i < groups.length(); i++) {
                JSONObject groupObj = groups.getJSONObject(i);

                // 3) Find the "Spotify Action" group by its key
                if (groupObj.has("Spotify Action")) {
                    JSONArray actions = groupObj.getJSONArray("Spotify Action");

                    // 4) Look for the "Search and Play Song" entry
                    for (int j = 0; j < actions.length(); j++) {
                        JSONObject action = actions.getJSONObject(j);
                        if (action.has("Search and Play Song")) {
                            String song = action.getString("Search and Play Song").trim();
                            if (song.isEmpty()) song = "Default Song Name";
                            Log.d(TAG, "✅ Song found: " + song);
                            return song;
                        }
                    }
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error parsing inputs for song name", e);
        }

        Log.e(TAG, "❌ No song name found");
        return null;
    }
    public void clickTopResult(Action callback) {
        Log.d(TAG, "Attempting to click top search result...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in clickTopResult");
            helperFunctions.cleanupAndExit("Root node null while clicking top result", "error");
            return;
        }

        // Find the search results RecyclerView
        AccessibilityNodeInfo recyclerView = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/search_content_recyclerview", 2);

        if (recyclerView != null) {
            // Get all row_root nodes (search results)
            List<AccessibilityNodeInfo> searchResults = HelperFunctions.findNodesByResourceId(recyclerView, "com.spotify.music:id/row_root");

            if (searchResults != null && !searchResults.isEmpty()) {
                // Get the first result (top result)
                AccessibilityNodeInfo topResult = searchResults.get(0);

                if (topResult != null) {
                    // Check if it's a song by looking for subtitle containing "Song •"
                    AccessibilityNodeInfo subtitle = HelperFunctions.findNodeByResourceId(topResult, "com.spotify.music:id/subtitle");

                    if (subtitle != null && subtitle.getText() != null && subtitle.getText().toString().contains("Song •")) {
                        Log.d(TAG, "Found top song result, attempting to click...");

                        if (topResult.isClickable() && topResult.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                            Log.i(TAG, "Clicked top result directly.");
                            handler.postDelayed(callback::execute, 2000 + random.nextInt(1000));
                        } else {
                            Rect bounds = new Rect();
                            topResult.getBoundsInScreen(bounds);
                            helperFunctions.clickOnBounds(bounds, callback, "Center", 2000, 1000, helperFunctions);
                        }
                    } else {
                        Log.e(TAG, "Top result is not a song, skipping...");
                        handler.postDelayed(callback::execute, 1000);
                    }
                } else {
                    Log.e(TAG, "Top result node is null.");
                    helperFunctions.cleanupAndExit("Cannot access top result", "error");
                }
            } else {
                Log.e(TAG, "No search results found.");
                helperFunctions.cleanupAndExit("No search results to click", "error");
            }
        } else {
            Log.e(TAG, "Search results RecyclerView not found.");
            helperFunctions.cleanupAndExit("Cannot find search results", "error");
        }
    }
    public void playPauseSong(Action callback) {
        Log.d(TAG, "Attempting to play/pause song...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in playPauseSong");
            helperFunctions.cleanupAndExit("Root node null while controlling playback", "error");
            return;
        }

        // Find the play/pause button
        AccessibilityNodeInfo playPauseButton = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/play_pause_button", 2);

        if (playPauseButton != null) {
            // Get the content description to know current state
            String contentDesc = playPauseButton.getContentDescription() != null ?
                    playPauseButton.getContentDescription().toString() : "";

            Log.d(TAG, "Play/Pause button found with description: " + contentDesc);

            if (playPauseButton.isClickable() && playPauseButton.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                Log.i(TAG, "Clicked play/pause button directly.");

                // Determine action based on content description
                if (contentDesc.contains("Play")) {
                    Log.d(TAG, "Song was paused, now playing.");
                } else if (contentDesc.contains("Pause")) {
                    Log.d(TAG, "Song was playing, now paused.");
                }

                handler.postDelayed(callback::execute, 1000 + random.nextInt(500));

            } else {
                // Fallback to bounds clicking
                Rect bounds = new Rect();
                playPauseButton.getBoundsInScreen(bounds);
                Log.d(TAG, "Using bounds click for play/pause button.");
                helperFunctions.clickOnBounds(bounds, callback, "Center", 1000, 500, helperFunctions);
            }
        } else {
            Log.e(TAG, "Play/pause button not found.");
            helperFunctions.cleanupAndExit("Cannot find play/pause button", "error");
        }
    }

    public boolean shouldContinueAutomation() {
        Log.e(TAG, "Entered shouldContinueAutomation");

        if (this.shouldStop) {
            Log.e(TAG, "Automation Stopped By Command");
            this.shouldStop = false;

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
            this.endTime = dateFormat.format(new Date());

            returnMessageBuilder.append("End Time:  ").append(this.endTime).append("\n");
            helperFunctions.cleanupAndExit("Automation Stopped", "error");

            return true;
        }

        return false;
    }
    private void performFastScroll(Action callback) {
        performScroll(150, callback); // shorter gesture
    }
    public void performModerateScroll(Action callback) {
        if (shouldContinueAutomation()) return;

        Path path = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        float startY = screenHeight * (0.75f + random.nextFloat() * 0.05f); // lower part
        float endY = screenHeight * (0.4f + random.nextFloat() * 0.05f);   // scroll more than earlier
        float x = screenWidth / 2f;

        path.moveTo(x, startY);
        path.lineTo(x, endY);

        GestureDescription.Builder builder = new GestureDescription.Builder();
        builder.addStroke(new GestureDescription.StrokeDescription(path, 0, 400 + random.nextInt(200)));

        try {
            ((MyAccessibilityService) context).dispatchGesture(builder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);
                    Log.d(TAG, "Moderate scroll gesture completed");
                    handler.postDelayed(callback::execute, 300);
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);
                    Log.d(TAG, "Scroll gesture cancelled");
                    helperFunctions.cleanupAndExit("Scroll gesture cancelled", "error");
                }
            }, null);
        } catch (Exception e) {
            Log.e(TAG, "Error performing moderate scroll", e);
            helperFunctions.cleanupAndExit("Gesture failed", "error");
        }
    }
    private void performScroll(int gestureDuration, Action callback) {
        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        float startY = screenHeight * (0.7f + random.nextFloat() * 0.05f);
        float endY = screenHeight * (0.3f + random.nextFloat() * 0.05f);
        float xVariation = screenWidth * (0.1f * random.nextFloat() - 0.05f);

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder builder = new GestureDescription.Builder();
        builder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, gestureDuration));

        try {
            ((MyAccessibilityService) context).dispatchGesture(
                    builder.build(),
                    new AccessibilityService.GestureResultCallback() {
                        @Override
                        public void onCompleted(GestureDescription gestureDescription) {
                            super.onCompleted(gestureDescription);
                            callback.execute();
                        }

                        @Override
                        public void onCancelled(GestureDescription gestureDescription) {
                            super.onCancelled(gestureDescription);
                            Log.w(TAG, "Scroll gesture cancelled.");
                            handler.postDelayed(callback::execute, 500 + random.nextInt(500));
                        }
                    },
                    null
            );
        } catch (Exception e) {
            Log.e(TAG, "Error during scroll gesture", e);
            handler.postDelayed(callback::execute, 500 + random.nextInt(500));
        }
    }

    public void performStaticScrollUp(Action callback) {
        if (shouldContinueAutomation()) return;

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        // Start and end Y positions (30–40% of screen height scroll)
        float startY = screenHeight * (0.7f + random.nextFloat() * 0.1f); // 70–80%
        float endY = screenHeight * (0.3f + random.nextFloat() * 0.1f);   // 30–40%
        float xVariation = screenWidth * (0.1f * random.nextFloat() - 0.05f); // slight left/right

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        int gestureDuration = 300 + random.nextInt(300); // 300–600ms

        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, gestureDuration));

        try {
            MyAccessibilityService service = (MyAccessibilityService) context;

            service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);

                    // Delay before executing callback: 300–800ms
                    int delay = 300 + random.nextInt(500);
                    handler.postDelayed(callback::execute, delay);
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);

                    // Fallback: Report and exit if scroll fails
                    handler.postDelayed(() -> {
                        helperFunctions.cleanupAndExit("Scroll gesture cancelled. Check accessibility settings.", "error");
                    }, 1000 + random.nextInt(500));
                }
            }, null);

            // Fail-safe timeout if gesture does not finish in 3s
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Scroll gesture timed out.", "error");
            }, 3000);

        } catch (Exception e) {
            Log.e(TAG, "Error during scroll up", e);
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Error during scroll. Check accessibility.", "error");
            }, 1000 + random.nextInt(500));
        }
    }

    public void performScrollUp(Action callback) {
        if (shouldContinueAutomation()) {
            return;
        }

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        // 🔁 Scroll distance is now randomized between 100–400 pixels instead of percentage-based
        float scrollDistance = 100 + random.nextInt(301);  // 100–400 pixels
        float startY = screenHeight / 2f;
        float endY = startY - scrollDistance;

        float xVariation = screenWidth * (0.1f * random.nextFloat() - 0.05f);

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        int gestureDuration = 150 + random.nextInt(150);  // 150–300 ms
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, gestureDuration));

        try {
            MyAccessibilityService service = (MyAccessibilityService) context;
            service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);
                    handler.postDelayed(callback::execute, 1000 + random.nextInt(2000));
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);
                    handler.postDelayed(() -> {
                        helperFunctions.cleanupAndExit(
                                "Automation Could not be Completed. Please make sure the device has Accessibility enabled.",
                                "error"
                        );
                    }, 1000 + random.nextInt(2000));
                }
            }, null);
        } catch (Exception e) {
            Log.e(TAG, "Error during scroll up", e);
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit(
                        "Automation Could not be Completed. Please make sure the device has Accessibility enabled.",
                        "error"
                );
            }, 1000 + random.nextInt(2000));
        }
    }
    public void scrollToEndOfPage(Action onComplete) {
        Log.d(TAG, "▶️ Started scrollToEndOfPage");

        final AtomicBoolean isScrolling = new AtomicBoolean(true);
        final AtomicBoolean hasCompleted = new AtomicBoolean(false); // ✅ prevent multiple executions
        final ArrayList<String> previousContent = new ArrayList<>();

        Runnable[] scrollRunnable = new Runnable[1];

        scrollRunnable[0] = new Runnable() {
            int retryCount = 0;
            int scrollCount = 0;
            String lastHash = "";

            @Override
            public void run() {
                if (!isScrolling.get() || shouldContinueAutomation()) return;

                if (scrollCount >= 20) {
                    Log.w(TAG, "⚠️ Max scroll count (20) reached. Ending scroll loop.");
                    endScroll();
                    return;
                }

                String currentContent = helperFunctions.captureScreenSignature();
                Log.d(TAG, "📸 Screen hash: " + currentContent);

                if (currentContent.equals(lastHash)) {
                    retryCount++;
                    Log.d(TAG, "🔁 Same content detected. Retry #" + retryCount);

                    if (retryCount >= 2) {
                        Log.i(TAG, "✅ End of page confirmed after retries.");
                        endScroll();
                        return;
                    }
                } else {
                    retryCount = 0;
                }

                lastHash = currentContent;
                scrollCount++;

                performModerateScroll(() -> {
                    Log.d(TAG, "⬇️ Scroll #" + scrollCount + " completed. Waiting to retry...");
                    handler.postDelayed(scrollRunnable[0], 300 + random.nextInt(300));
                });
            }

            private void endScroll() {
                if (hasCompleted.getAndSet(true)) return; // ✅ Prevent double-calling
                isScrolling.set(false);
                Log.d(TAG, "🚀 scrollToEndOfPage complete. Proceeding to next step...");
                onComplete.execute();
            }
        };

        // ✅ Safety fallback: stop after 30 seconds regardless
        handler.postDelayed(() -> {
            if (isScrolling.get() && !hasCompleted.get()) {
                Log.w(TAG, "⏰ Safety timeout reached. Ending scroll loop.");
                scrollRunnable[0].run(); // Run one last time
            }
        }, 30000); // 30 seconds max scroll window

        scrollRunnable[0].run();
    }
    // Performs a single moderate downward scroll with natural variation
    public void performModerateScrollDown(Action callback) {
        if (shouldContinueAutomation()) return;

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        // Start higher, end lower = downward scroll
        float startY = screenHeight * (0.3f + random.nextFloat() * 0.1f); // 30–40% down
        float endY = screenHeight * (0.7f + random.nextFloat() * 0.1f);   // 70–80% down
        float xVariation = screenWidth * (0.05f * (random.nextFloat() - 0.5f)); // -2.5% to +2.5%

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        int duration = 300 + random.nextInt(300); // 300–600 ms gesture
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, duration));

        try {
            service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);
                    Log.d(TAG, "✅ performModerateScrollDown: Scroll completed.");
                    handler.postDelayed(callback::execute, 200 + random.nextInt(300)); // Optional small delay
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);
                    Log.e(TAG, "❌ performModerateScrollDown: Gesture cancelled.");
                    handler.postDelayed(() -> helperFunctions.cleanupAndExit(
                            "Scroll gesture cancelled. Please ensure accessibility is enabled.", "error"
                    ), 1000);
                }
            }, null);
        } catch (Exception e) {
            Log.e(TAG, "🔥 Exception during performModerateScrollDown", e);
            handler.postDelayed(() -> helperFunctions.cleanupAndExit(
                    "Scroll failed unexpectedly. Check accessibility and UI state.", "error"
            ), 1000);
        }
    }
    public void performStaticScrollDown(Action callback) {
        if (shouldContinueAutomation()) return;

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        float startY = screenHeight * (0.3f + random.nextFloat() * 0.1f);  // start near top
        float endY = screenHeight * (0.7f + random.nextFloat() * 0.1f);    // end near bottom
        float xVariation = screenWidth * (0.1f * random.nextFloat() - 0.05f);

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        int gestureDuration = 500 + random.nextInt(500); // 500–1000 ms
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, gestureDuration));

        try {
            MyAccessibilityService service = (MyAccessibilityService) context;
            service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);
                    handler.postDelayed(callback::execute, 3000 + random.nextInt(1500)); // delay after scroll
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);
                    handler.postDelayed(() -> {
                        helperFunctions.cleanupAndExit("Automation could not be completed. Accessibility may be disabled.", "error");
                    }, 1000 + random.nextInt(2000));
                }
            }, null);
        } catch (Exception e) {
            Log.e(TAG, "Error during static scroll down", e);
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Automation failed due to unexpected error.", "error");
            }, 1000 + random.nextInt(2000));
        }
    }
    public void performTimedScrollDown(long durationInMillis, Runnable onTimeUpCallback) {
        Log.d(TAG, "▶️ Started performTimedScrollDown | Duration: " + durationInMillis + "ms");

        if (shouldContinueAutomation()) return;

        long startTime = System.currentTimeMillis();
        AtomicBoolean isScrolling = new AtomicBoolean(true);
        final String[] lastContent = {""};
        final int[] sameCount = {0};

        Runnable[] scrollRunnable = new Runnable[1];

        scrollRunnable[0] = new Runnable() {
            @Override
            public void run() {
                if (shouldContinueAutomation() || !isScrolling.get()) return;

                long currentTime = System.currentTimeMillis();

                // ✅ Check if time exceeded
                if (currentTime - startTime >= durationInMillis) {
                    Log.d(TAG, "⏹️ Timed scroll down completed. Total time: " + (currentTime - startTime) + "ms");
                    isScrolling.set(false);
                    onTimeUpCallback.run();
                    return;
                }

                // ✅ Check for repeated screen (indicates top reached)
                String currentContent = helperFunctions.captureScreenSignature();
                if (currentContent.equals(lastContent[0])) {
                    sameCount[0]++;
                    Log.d(TAG, "🔁 Same screen detected (" + sameCount[0] + "x)");
                    if (sameCount[0] >= 2) {
                        Log.d(TAG, "⏫ Top of page detected. Stopping scroll.");
                        isScrolling.set(false);
                        onTimeUpCallback.run();
                        return;
                    }
                } else {
                    sameCount[0] = 0; // reset
                    lastContent[0] = currentContent;
                }

                performModerateScrollDown(() -> {
                    int delay = 1000 + random.nextInt(1000); // 1–2 sec
                    Log.d(TAG, "⬇️ Scroll performed. Scheduling next in " + delay + "ms");
                    handler.postDelayed(scrollRunnable[0], delay);
                });
            }
        };

        // ⚠️ Safety timeout handler
        handler.postDelayed(() -> {
            if (isScrolling.get()) {
                Log.d(TAG, "⚠️ Safety timeout triggered. Forcing end of scroll.");
                isScrolling.set(false);
                onTimeUpCallback.run();
            }
        }, durationInMillis + 3000); // Add buffer

        scrollRunnable[0].run();
    }
    public void scrollToTopOfPage(Action onComplete) {
        Log.d(TAG, "🔼 Started scrollToTopOfPage");

        final AtomicBoolean isScrolling = new AtomicBoolean(true);
        final String[] lastHash = {""};
        final int[] retryCount = {0};

        Runnable[] scrollRunnable = new Runnable[1];

        scrollRunnable[0] = new Runnable() {
            @Override
            public void run() {
                if (shouldContinueAutomation() || !isScrolling.get()) return;

                String currentHash = helperFunctions.captureScreenSignature();
                Log.d(TAG, "🔍 Top scroll check: screen hash = " + currentHash);

                if (currentHash.equals(lastHash[0])) {
                    retryCount[0]++;
                    Log.d(TAG, "⏳ Same content detected. Retrying scroll up #" + retryCount[0]);

                    if (retryCount[0] >= 2) {
                        Log.d(TAG, "⏫ Top of page reached after retries. Stopping scroll.");
                        isScrolling.set(false);
                        onComplete.execute();
                        return;
                    }
                } else {
                    retryCount[0] = 0; // reset retry if new content is seen
                }

                lastHash[0] = currentHash;

                // ✅ Scroll DOWN to go UP the list
                performModerateScrollDown(() -> {
                    Log.d(TAG, "⬆️ Scroll down performed. Scheduling next...");
                    handler.postDelayed(scrollRunnable[0], 300 + random.nextInt(300));
                });
            }
        };

        scrollRunnable[0].run();
    }
    public void performTimedScrollUp(long durationInMillis, Runnable onTimeUpCallback) {
        if (shouldContinueAutomation()) return;

        if (spotifyPopUp.handleLaunchPopups(() -> performTimedScrollUp(durationInMillis, onTimeUpCallback)))
            return;

        final long startTime = System.currentTimeMillis();
        Log.d(TAG, "🟢 Starting timed scroll at: " + new Date(startTime) + " | Duration: " + (durationInMillis / 1000.0) + " seconds");

        final AtomicBoolean isScrolling = new AtomicBoolean(true);
        final Runnable[] scrollRunnable = new Runnable[1];

        scrollRunnable[0] = new Runnable() {
            @Override
            public void run() {
                if (shouldContinueAutomation() || !isScrolling.get()) return;

                long currentTime = System.currentTimeMillis();
                long elapsed = currentTime - startTime;

                if (elapsed >= durationInMillis) {
                    Log.d(TAG, "🛑 Timed scroll ended at: " + new Date(currentTime));
                    Log.d(TAG, "✅ Total scrolling time completed: " + (elapsed / 1000.0) + " seconds");
                    isScrolling.set(false);
                    onTimeUpCallback.run();
                    return;
                }

                Log.d(TAG, "🔄 Performing scroll at: " + new Date(currentTime));

                performScrollUp(() -> {
                    if (isScrolling.get()) {
                        int nextDelay = 200 + random.nextInt(1000); // 200–1200ms
                        Log.d(TAG, "⏸️ Pausing for " + nextDelay + "ms before next scroll (at " + new Date() + ")");
                        handler.postDelayed(scrollRunnable[0], nextDelay);
                    }
                });
            }
        };

        handler.post(scrollRunnable[0]);

        // Fail-safe timeout
        handler.postDelayed(() -> {
            if (isScrolling.get()) {
                long failSafeTime = System.currentTimeMillis();
                Log.d(TAG, "⚠️ Fail-safe triggered at: " + new Date(failSafeTime));
                Log.d(TAG, "⛔ Ending scroll after timeout. Total elapsed: " + ((failSafeTime - startTime) / 1000.0) + " seconds");
                isScrolling.set(false);
                onTimeUpCallback.run();
            }
        }, durationInMillis + 5000);
    }
    // Performs a single moderate upward scroll with natural randomness
    public void performModerateScrollUp(Action callback) {
        if (shouldContinueAutomation()) return;

        Path swipePath = new Path();
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        // 🟢 Swipe down → page scrolls up
        float startY = screenHeight * (0.7f + random.nextFloat() * 0.1f); // start near bottom (70–80%)
        float endY = screenHeight * (0.3f + random.nextFloat() * 0.1f);   // end near top (30–40%)
        float xVariation = screenWidth * (0.05f * (random.nextFloat() - 0.5f)); // small left-right wiggle

        swipePath.moveTo(screenWidth / 2f + xVariation, startY);
        swipePath.lineTo(screenWidth / 2f + xVariation, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        int duration = 300 + random.nextInt(300); // 300–600 ms
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, duration));

        try {
            service.dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
                @Override
                public void onCompleted(GestureDescription gestureDescription) {
                    super.onCompleted(gestureDescription);
                    Log.d(TAG, "✅ performModerateScrollUp: Scroll completed.");
                    handler.postDelayed(callback::execute, 200 + random.nextInt(300));
                }

                @Override
                public void onCancelled(GestureDescription gestureDescription) {
                    super.onCancelled(gestureDescription);
                    Log.e(TAG, "❌ performModerateScrollUp: Gesture cancelled.");
                    handler.postDelayed(() -> helperFunctions.cleanupAndExit(
                            "Scroll up gesture cancelled. Please check accessibility.", "error"
                    ), 1000);
                }
            }, null);
        } catch (Exception e) {
            Log.e(TAG, "🔥 Exception during performModerateScrollUp", e);
            handler.postDelayed(() -> helperFunctions.cleanupAndExit(
                    "Scroll up failed unexpectedly.", "error"
            ), 1000);
        }
    }
    public void selectPlaylistsFilter(Action callback) {
        Log.d(TAG, "Attempting to select 'Playlists' filter...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Root node null while selecting Playlists filter", "error");
            }, 1000);
            return;
        }

        // Debug: Log all content descriptions to help you see what's present
        debugAllContentDescriptions(rootNode);

        // Try to find the filter container
        AccessibilityNodeInfo filterContainer = findFilterContainer(rootNode);

        if (filterContainer == null) {
            Log.e(TAG, "Filter container not found. Retrying after delay...");
            // Retry after 1 second, up to 3 times
            int retryCount = 0;
            retryFindFilterContainer(rootNode, callback, retryCount);
            return;
        }

        // ...rest of your code...
        // Click on the "Playlists" filter button using the specified bounds [16,202][151,298]
        else {
            Rect playlistsFilterBounds = new Rect(32, 234, 64, 266);
            helperFunctions.clickOnBounds(playlistsFilterBounds, callback, "Center", 1500, 3000, helperFunctions);
            Log.d(TAG, "✅ Clicked on 'Playlists' filter at hardcoded bounds: " + playlistsFilterBounds.toString());
        }

//        // 🔽 Add delay of 3 seconds after clicking
//        handler.postDelayed(() -> {
//            Log.d(TAG, "✅ 3-second delay after clicking 'Playlists' filter completed.");
//            // Continue logic here if needed...
//        }, 3000);
    }
    private void retryFindFilterContainer(AccessibilityNodeInfo rootNode, Action callback, int retryCount) {
        if (retryCount >= 3) {
            Log.e(TAG, "Filter container not found after retries.");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Filter container not found after retries", "error");
            }, 1000);
            return;
        }
        handler.postDelayed(() -> {
            AccessibilityNodeInfo newRoot = service.getRootInActiveWindow();
            AccessibilityNodeInfo filterContainer = findFilterContainer(newRoot);
            if (filterContainer != null) {
                Log.d(TAG, "Filter container found on retry #" + (retryCount + 1));
                AccessibilityNodeInfo playlistsNode = findPlaylistsNode(filterContainer);
                if (playlistsNode != null) {
                    Rect bounds = new Rect();
                    playlistsNode.getBoundsInScreen(bounds);
                    helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
                    Log.d(TAG, "✅ Clicked on 'Playlists' filter at bounds: " + bounds.toString());
                } else {
                    Log.d(TAG, "'Playlists' button not found in filter container. Assuming filter is already applied.");
                    handler.postDelayed(callback::execute, 1000);
                }
            } else {
                retryFindFilterContainer(newRoot, callback, retryCount + 1);
            }
        }, 1000);
    }
    private AccessibilityNodeInfo findFilterContainer(AccessibilityNodeInfo node) {
        if (node == null) return null;

        // Check if this node has a child with "Clear filter" or "Playlists"
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child == null) continue;

            CharSequence desc = child.getContentDescription();
            if (desc != null) {
                String d = desc.toString().toLowerCase();
                if (d.contains("clear filter") || d.contains("playlists")) {
                    // This node is likely the container
                    return node;
                }
            }

            // Recursively check children
            AccessibilityNodeInfo result = findFilterContainer(child);
            if (result != null) return result;
        }
        return null;
    }
    public void checkAndClearFilter(Action callback) {
        Log.d(TAG, "Checking if clear filter button exists...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null in checkAndClearFilter");
            callback.execute();
            return;
        }

        // DEBUG: Let's see what's actually available
        debugAllContentDescriptions(rootNode);

        // Find the clear filter button using the same approach as selectPlaylistsFilter
        AccessibilityNodeInfo clearFilterNode = findClearFilterNode(rootNode);

        if (clearFilterNode != null) {
            Log.d(TAG, "Clear filter button found. Clicking it...");

            Rect clearBounds = new Rect();
            clearFilterNode.getBoundsInScreen(clearBounds);

            helperFunctions.clickOnBounds(clearBounds, () -> {
                Log.d(TAG, "✅ Clicked clear filter button");
                callback.execute();
            }, "Center", 1000, 2000, helperFunctions);

        } else {
            Log.d(TAG, "No clear filter button found. Proceeding after delay...");
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                callback.execute();
            }, 1000); // 1-second delay
        }
    }
    private void debugAllContentDescriptions(AccessibilityNodeInfo node) {
        if (node == null) return;

        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null && contentDesc.toString().toLowerCase().contains("clear")) {
            Log.d(TAG, "DEBUG CLEAR: Found clear-related content-desc: '" + contentDesc + "'");
            Log.d(TAG, "DEBUG CLEAR: Node clickable: " + node.isClickable() + ", bounds: " + getBounds(node));
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            debugAllContentDescriptions(node.getChild(i));
        }
    }
    private AccessibilityNodeInfo findClearFilterNode(AccessibilityNodeInfo node) {
        if (node == null) return null;

        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null) {
            String desc = contentDesc.toString();
            if (desc.equals("Clear filter selection") ||
                    desc.contains("Clear filter") ||
                    desc.toLowerCase().contains("clear filter")) {

                // If this node is clickable, return it
                if (node.isClickable()) {
                    Log.d(TAG, "Found clickable clear filter node: " + desc);
                    return node;
                }

                // Otherwise, find clickable parent
                AccessibilityNodeInfo parent = node.getParent();
                while (parent != null && !parent.isClickable()) {
                    parent = parent.getParent();
                }

                if (parent != null) {
                    Log.d(TAG, "Found clickable parent for clear filter node: " + desc);
                    return parent;
                }
            }
        }

        // Search children
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo result = findClearFilterNode(node.getChild(i));
            if (result != null) return result;
        }

        return null;
    }
    private AccessibilityNodeInfo findNodeByContentDesc(AccessibilityNodeInfo node, String targetDesc) {
        if (node == null) return null;

        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null && contentDesc.toString().equalsIgnoreCase(targetDesc)) {
            return node;
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo result = findNodeByContentDesc(node.getChild(i), targetDesc);
            if (result != null) return result;
        }

        return null;
    }
    private void debugContentDescriptions(AccessibilityNodeInfo node) {
        if (node == null) return;

        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null && contentDesc.toString().toLowerCase().contains("playlist")) {
            Log.d(TAG, "DEBUG: Found playlist-related content-desc: '" + contentDesc + "'");
            Log.d(TAG, "DEBUG: Node clickable: " + node.isClickable() + ", bounds: " + getBounds(node));
        }

        for (int i = 0; i < node.getChildCount(); i++) {
            debugContentDescriptions(node.getChild(i));
        }
    }
    private AccessibilityNodeInfo findPlaylistsNode(AccessibilityNodeInfo node) {
        if (node == null) return null;

        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null) {
            String desc = contentDesc.toString();

            // Be VERY specific - only match the exact filter button text
            if (desc.equals("Playlists, show only playlists.")) {
                Log.d(TAG, "Found exact playlists filter node: " + desc);

                // If this node is clickable, return it
                if (node.isClickable()) {
                    return node;
                }

                // Otherwise, find clickable parent
                AccessibilityNodeInfo parent = node.getParent();
                while (parent != null && !parent.isClickable()) {
                    parent = parent.getParent();
                }

                if (parent != null) {
                    Log.d(TAG, "Found clickable parent for playlists filter node: " + desc);
                    return parent;
                }
            }
        }

        // Search children
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo result = findPlaylistsNode(node.getChild(i));
            if (result != null) return result;
        }

        return null;
    }
    private String getBounds(AccessibilityNodeInfo node) {
        Rect bounds = new Rect();
        node.getBoundsInScreen(bounds);
        return bounds.toString();
    }
    public void clickPlaylistPlayButton(Action callback) {

//        if (hasReachedDailyLimit()) {
//            Log.w(TAG, "🚫 Daily song limit reached. Skipping play.");
//            if (callback != null) callback.execute();  // still call callback to continue flow
//            return;
//        }
        // Correct bounds for the Play button
        int left = 592;   // Left bound of the button
        int top = 740;    // Top bound of the button
        int right = 696;  // Right bound of the button
        int bottom = 844; // Bottom bound of the button

        // Define the bounds for the Play button
        Rect playButtonBounds = new Rect(left, top, right, bottom);

        // Log the exact bounds being triggered
        Log.d(TAG, "Clicking on Play Button with bounds: " + playButtonBounds.toString());

        // Use the helperFunctions instance for calling clickOnBounds
        if (helperFunctions != null) {
            helperFunctions.clickOnBounds(playButtonBounds, () -> {
                Log.d(TAG, "Button clicked.");
                // After clicking, execute the callback
                callback.execute();
            }, "Center", 0, 1000, helperFunctions);  // Pass the correct instance of HelperFunctions
        } else {
            Log.e(TAG, "HelperFunctions instance is not initialized.");
        }
    }
    public void selectArtistsFilter(Action callback) {
        Log.d(TAG, "Attempting to select 'Artists' filter...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

        if (rootNode == null) {
            Log.e(TAG, "Root node is null");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("Root node null while selecting Artists filter", "error");
            }, 1000);
            return;
        }

        // ✅ Step 1: Check for "Clear filter selection" button
        AccessibilityNodeInfo clearFilterButton = HelperFunctions.findNodeByContentDesc(rootNode, "Clear filter selection");

        if (clearFilterButton != null) {
            Log.d(TAG, "🔄 A filter is already active. Clearing it first...");

            Rect clearBounds = new Rect();
            clearFilterButton.getBoundsInScreen(clearBounds);

            // Click the "Clear filter" button, then call this function again after delay
            helperFunctions.clickOnBounds(clearBounds, () -> {
                Log.d(TAG, "✅ Cleared existing filter. Retrying 'selectArtistsFilter'...");
                handler.postDelayed(() -> selectArtistsFilter(callback), 1500);  // Delay before retrying
            }, "Center", 1000, 2000, helperFunctions);

            return; // Exit here — the function will be retried after clearing
        }

        // ✅ Step 2: Find the "Artists" filter button
        AccessibilityNodeInfo artistsButton = HelperFunctions.findNodeByContentDesc(rootNode, "Artists, show only artists.");

        if (artistsButton != null) {
            // Click on the Artists button if it's found
            Rect bounds = new Rect();
            artistsButton.getBoundsInScreen(bounds);
            helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
            Log.d(TAG, "'Artists' filter button clicked.");
        } else {
            Log.e(TAG, "'Artists' button not found.");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("'Artists' button not found", "error");
            }, 1000);
        }
    }
    public void selectRandomArtist(Action callback) {
        Log.d(TAG, "Attempting to select a random artist...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in selectRandomArtist.");
            helperFunctions.cleanupAndExit("Root node is null", "error");
            return;
        }

        // Find the RecyclerView containing the list of artists
        AccessibilityNodeInfo recyclerView = HelperFunctions.findNodeByResourceId(rootNode, "com.spotify.music:id/recycler_view");
        if (recyclerView != null) {
            // Get all the artist items within the RecyclerView (look for rows that are clickable)
            List<AccessibilityNodeInfo> artistItems = HelperFunctions.findNodesByResourceId(recyclerView, "com.spotify.music:id/card_root");

            if (artistItems != null && !artistItems.isEmpty()) {
                // Filter out items with content-desc "Add artists," (and other invalid selections)
                List<AccessibilityNodeInfo> filteredArtistItems = new ArrayList<>();
                for (AccessibilityNodeInfo artistItem : artistItems) {
                    // Exclude the "Add artists" button by checking its content description
                    CharSequence contentDescription = artistItem.getContentDescription();
                    if (contentDescription != null
                            && !contentDescription.toString().contains("Add artists,") // Cast to String to use contains
                            && artistItem.isClickable()) {
                        filteredArtistItems.add(artistItem);
                    }
                }

                if (!filteredArtistItems.isEmpty()) {
                    // Randomly select an artist from the filtered list
                    Random rand = new Random();
                    int randomIndex = rand.nextInt(filteredArtistItems.size());
                    AccessibilityNodeInfo randomArtist = filteredArtistItems.get(randomIndex);

                    if (randomArtist != null && randomArtist.isClickable()) {
                        Rect bounds = new Rect();
                        randomArtist.getBoundsInScreen(bounds);
                        helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
                        Log.d(TAG, "Random artist selected and clicked.");
                    } else {
                        Log.e(TAG, "Random artist not clickable or found.");
                        helperFunctions.cleanupAndExit("Random artist not clickable", "error");
                    }
                } else {
                    Log.e(TAG, "No valid artists found in the RecyclerView.");
                    helperFunctions.cleanupAndExit("No valid artists found", "error");
                }
            } else {
                Log.e(TAG, "No artists found in the RecyclerView.");
                helperFunctions.cleanupAndExit("No artists found", "error");
            }
        } else {
            Log.e(TAG, "RecyclerView not found.");
            helperFunctions.cleanupAndExit("RecyclerView not found", "error");
        }
    }
    public void playArtist(Action callback) {
        Log.d(TAG, "Attempting to play artist...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in playArtist");
            helperFunctions.cleanupAndExit("Root node null while controlling artist playback", "error");
            return;
        }

        // Find the play button for the artist
        AccessibilityNodeInfo playButton = helperFunctions.FindAndReturnNodeById("com.spotify.music:id/play_button", 2);

        if (playButton != null) {
            // Get the content description to know current state
            String contentDesc = playButton.getContentDescription() != null ?
                    playButton.getContentDescription().toString() : "";

            Log.d(TAG, "Play artist button found with description: " + contentDesc);

            if (playButton.isClickable() && playButton.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                Log.i(TAG, "Clicked play artist button directly.");

                // Check the action based on the content description (Play or Pause)
                if (contentDesc.contains("Play")) {
                    Log.d(TAG, "Artist was paused, now playing.");
                } else if (contentDesc.contains("Pause")) {
                    Log.d(TAG, "Artist was playing, now paused.");
                }

                // Execute callback after a delay
                handler.postDelayed(callback::execute, 1000 + random.nextInt(500));

            } else {
                // If the button is not clickable, fallback to bounds clicking
                Rect bounds = new Rect();
                playButton.getBoundsInScreen(bounds);
                Log.d(TAG, "Using bounds click for play artist button.");
                helperFunctions.clickOnBounds(bounds, callback, "Center", 1000, 500, helperFunctions);
            }
        } else {
            Log.e(TAG, "Play artist button not found.");
            helperFunctions.cleanupAndExit("Cannot find play artist button", "error");
        }
    }
    public void logCreatePlaylistInputs() {
        Log.d(TAG, "Starting to log Create Playlist inputs...");

        // Example inputs for testing (replace with actual JSON input)
        String inputs = "[{\"Create Playlist\":[{\"Want to Create Playlist?\":true},{\"Playlist Name\":\"playlist2222\"},{\"List of Songs to Add\":[\"shape of you\",\"hello\"]}]}]";

        try {
            // Parse the JSON input
            JSONArray groups = new JSONArray(inputs);

            // Loop through the input groups
            for (int i = 0; i < groups.length(); i++) {
                JSONObject groupObj = groups.getJSONObject(i);

                // Check for "Create Playlist" block
                if (groupObj.has("Create Playlist")) {
                    JSONArray createPlaylistInputs = groupObj.getJSONArray("Create Playlist");

                    // Iterate over "Create Playlist" inputs
                    for (int j = 0; j < createPlaylistInputs.length(); j++) {
                        JSONObject createField = createPlaylistInputs.getJSONObject(j);

                        // Extract and log values for each field
                        String inputName = createField.keys().next(); // Get the key (input name)
                        String description = createField.optString(inputName); // Get the description or value
                        String inputValue = createField.optString(inputName);

                        Log.d(TAG, "Input Name: " + inputName);
                        Log.d(TAG, "Description/Value: " + description);
                        Log.d(TAG, "Input Value: " + inputValue);

                        // Handle dynamic list if it's found
                        if (inputName.equals("List of Songs to Add") && createField.has(inputName)) {
                            JSONArray dynamicList = createField.getJSONArray(inputName);
                            if (dynamicList.length() > 0) {
                                Log.d(TAG, "List of Songs to Add:");
                                for (int k = 0; k < dynamicList.length(); k++) {
                                    Log.d(TAG, "Song: " + dynamicList.optString(k));
                                }
                            }
                        }
                    }
                }
            }
        } catch (JSONException e) {
            Log.e(TAG, "Error logging Create Playlist inputs", e);
        }

        Log.d(TAG, "Completed logging Create Playlist inputs.");
    }
    private AccessibilityNodeInfo findClickableParent(AccessibilityNodeInfo node) {
        AccessibilityNodeInfo current = node;

        // Traverse up the hierarchy to find a clickable parent
        while (current != null) {
            if (current.isClickable()) {
                Log.d(TAG, "Found clickable parent with class: " + current.getClassName());
                return current;
            }
            current = current.getParent();
        }

        Log.d(TAG, "No clickable parent found");
        return null;
    }
    private AccessibilityNodeInfo findPlaylistRecursive(AccessibilityNodeInfo node) {
        if (node == null) return null;

        // Check if this node contains "Playlist" text and is clickable or has clickable parent
        if (node.getText() != null && "Playlist".equals(node.getText().toString().trim())) {
            // Found the text, now find clickable parent
            AccessibilityNodeInfo clickableParent = findClickableParent(node);
            if (clickableParent != null) {
                return clickableParent;
            }
        }

        // If this node is clickable and contains child with "Playlist" text
        if (node.isClickable() && containsPlaylistText(node)) {
            return node;
        }

        // Recursively search children
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            AccessibilityNodeInfo result = findPlaylistRecursive(child);
            if (result != null) {
                return result;
            }
        }

        return null;
    }
    private boolean containsPlaylistText(AccessibilityNodeInfo node) {
        if (node == null) return false;

        // Check this node's text
        if (node.getText() != null && "Playlist".equals(node.getText().toString().trim())) {
            return true;
        }

        // Check children's text
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (containsPlaylistText(child)) {
                return true;
            }
        }

        return false;
    }
    private AccessibilityNodeInfo findPlaylistOptionNode(AccessibilityNodeInfo rootNode) {
        if (rootNode == null) return null;

        // Check if this node has "Playlist" text
        if (rootNode.getText() != null && "Playlist".equals(rootNode.getText().toString())) {
            // Find the clickable parent
            AccessibilityNodeInfo parent = rootNode.getParent();
            while (parent != null) {
                if (parent.isClickable()) {
                    return parent;
                }
                parent = parent.getParent();
            }
        }

        // Recursively search children
        for (int i = 0; i < rootNode.getChildCount(); i++) {
            AccessibilityNodeInfo child = rootNode.getChild(i);
            if (child != null) {
                AccessibilityNodeInfo result = findPlaylistOptionNode(child);
                if (result != null) {
                    return result;
                }
            }
        }

        return null;
    }
    private String getPlaylistNameFromInputs() {
        try {
            if (inputs.size() == 0) {
                Log.e(TAG, "Inputs list is empty.");
                return null;
            }

            // Look through all input groups for "Create Playlist"
            for (Object inputObj : inputs) {
                JSONObject inputGroup = (JSONObject) inputObj;

                if (inputGroup.has("Create Playlist")) {
                    JSONArray createPlaylistActions = inputGroup.getJSONArray("Create Playlist");

                    for (int i = 0; i < createPlaylistActions.length(); i++) {
                        JSONObject action = createPlaylistActions.getJSONObject(i);

                        // Check for playlist name
                        if (action.has("Playlist Name")) {
                            String playlistName = action.getString("Playlist Name");
                            Log.d(TAG, "Found playlist name: " + playlistName);
                            return playlistName;
                        }
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error extracting playlist name from inputs", e);
        }
        return "My Playlist"; // Default name if not found
    }
    private void monitorSongChanges() {
        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        Log.d(TAG, "🔍 MONITORING CHECK #" + System.currentTimeMillis() + " - Checking for song changes...");

        if (rootNode == null) {
            Log.e(TAG, "Root node is null, cannot monitor song changes.");
            return;
        }

        AccessibilityNodeInfo songTitleNode = HelperFunctions.findSongTitleByResourceId(rootNode);

        if (songTitleNode != null && songTitleNode.getText() != null) {
            String detectedSongTitle = songTitleNode.getText().toString().trim();

            Log.d(TAG, "Currently detected song: " + detectedSongTitle);

            // ✅ Only update if the song actually changed
            if (currentSong == null || !currentSong.equals(detectedSongTitle)) {

                if (hasReachedDailyLimit()) {
                    Log.w(TAG, "🚫 Daily song limit reached (" + MAX_SONGS_PER_DAY + "). Stopping automation.");
                    stopMonitoringSong();
                    closeMyApp(() -> Log.d(TAG, "✅ App closed after reaching daily limit."));
                    return;
                }
                currentSong = detectedSongTitle;  // Update current song tracker
                songHistory.append(currentSong).append("\n"); // Add new song to history

                Log.d(TAG, "🎵 NEW SONG ADDED: " + currentSong);
                Log.d(TAG, "Total songs played: " + countSongsPlayed());

                // ✅ Save updated history to SharedPreferences
                SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
                prefs.edit()
                        .putString(KEY_HISTORY, songHistory.toString())
                        .apply();
            }
        } else {
            Log.e(TAG, "Song title node not found.");
        }
    }
    public void startMonitoringSong() {
        Log.d(TAG, "🎬 Starting song monitoring...");
        isSongPlaying = true;

        // ✅ FIX: Immediately capture first song
        monitorSongChanges();

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isSongPlaying) { // Only continue if still playing
                    monitorSongChanges();
                    handler.postDelayed(this, 2000);
                }
            }
        }, 2000);
    }
    public void stopMonitoringSong() {
        Log.d(TAG, "🛑 Stopping song monitoring...");
        isSongPlaying = false; // ✅ FIX: Set flag first
        handler.removeCallbacksAndMessages(null);

        Log.d(TAG, "Final song history:\n" + songHistory.toString());
        Log.d(TAG, "Total songs played: " + countSongsPlayed());

        Log.i(TAG, "📅 DAILY SONG REPORT:");
        Log.i(TAG, songHistory.toString());
    }
    public void toggleSongMonitoring() {
        if (isSongPlaying) {
            // If the song is playing, stop monitoring
            stopMonitoringSong();
            isSongPlaying = false;  // Mark the song as paused
        } else {
            // If the song is paused, start monitoring
            startMonitoringSong();
            isSongPlaying = true;  // Mark the song as playing
        }
    }
    public int countSongsPlayed() {
        if (songHistory.length() == 0) {
            return 0;
        }

        // Count newlines = count songs (since each song ends with \n)
        String historyStr = songHistory.toString();
        int count = 0;
        for (int i = 0; i < historyStr.length(); i++) {
            if (historyStr.charAt(i) == '\n') {
                count++;
            }
        }

        Log.d(TAG, "📈 Song count (by newlines): " + count);
        return count;
    }
    private boolean hasReachedDailyLimit() {
        int count = countSongsPlayed();
        return count >= MAX_SONGS_PER_DAY;
    }
    public void shuffle(Action callback) {
        Log.d(TAG, "✅ Attempting to toggle Shuffle...");

        // First, go to the Now Playing Bar
        goToNowPlayingBar(() -> {
            // Wait for 2 seconds to ensure UI is fully loaded
            handler.postDelayed(() -> {
                // Now that the UI is loaded, check the current shuffle status
                AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

                if (rootNode == null) {
                    Log.e(TAG, "Root node is null, cannot proceed with shuffle check.");
                    return;  // Simply return, no need to crash the app
                }

                // Look for the shuffle button by content description
                AccessibilityNodeInfo shuffleNode = HelperFunctions.findNodeByContentDesc(rootNode, "Shuffle tracks");

                if (shuffleNode != null) {
                    // If shuffle button is found (meaning shuffle is off), click to enable shuffle
                    Log.d(TAG, "Shuffle is OFF, turning it ON.");
                    Rect bounds = new Rect();
                    shuffleNode.getBoundsInScreen(bounds);
                    helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
                } else {
                    // If shuffle button is not found, do nothing and just log the state
                    Log.d(TAG, "✅ Shuffle button not found, no action needed.");
                }

                // Wait for 2 seconds before clicking on the specified bounds
                handler.postDelayed(() -> {
                    Log.d(TAG, "✅ Clicking on the specified bounds [24,104][100,180]...");
                    Rect boundsToClick = new Rect(24, 104, 100, 180);  // Rect with bounds [24,104][100,180]
                    helperFunctions.clickOnBounds(boundsToClick, callback, "Center", 1500, 3000, helperFunctions);
                }, 2000); // Delay of 2 seconds before clicking on bounds
            }, 2000); // Initial 2 seconds to ensure UI is loaded
        });
    }


    // Navigate to the "Now Playing Bar" to check the shuffle status

//    public void goToNowPlayingBar(Action callback) {
//        Log.d(TAG, "Attempting to navigate to Now Playing Bar...");
//
//        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
//
//        if (rootNode == null) {
//            Log.e(TAG, "Root node is null, cannot proceed to Now Playing Bar.");
//            handler.postDelayed(() -> {
//                helperFunctions.cleanupAndExit("Root node null while navigating to Now Playing Bar", "error");
//            }, 1000);
//            return;
//        }
//
//        // Look for the "Now Playing Bar" using resource-id
//        AccessibilityNodeInfo nowPlayingBarNode = HelperFunctions.findNodeByPartialResourceId(rootNode, "now_playing_bar_layout");
//
//
//        if (nowPlayingBarNode != null) {
//            // Click on it if found
//            Rect bounds = new Rect();
//            nowPlayingBarNode.getBoundsInScreen(bounds);
//            helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
//        } else {
//            Log.e(TAG, "Now Playing Bar not found.");
//            handler.postDelayed(() -> {
//                helperFunctions.cleanupAndExit("Now Playing Bar not found", "error");
//            }, 1000);
//        }
//    }
    public void goToNowPlayingBar(Action callback) {
    Log.d(TAG, "Attempting to navigate to Now Playing Bar...");

    AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();

    if (rootNode == null) {
        Log.e(TAG, "Root node is null, cannot proceed to Now Playing Bar.");
        handler.postDelayed(() -> {
            // Pass a callback to clickHomeButton
            clickHomeButton(() -> {
                // Code to execute after home button click
                Log.d(TAG, "Home button clicked, callback executed.");
                callback.execute(); // Execute the callback passed to goToNowPlayingBar
            });
        }, 1000);
        return;
    }

    // Look for the "Now Playing Bar" using resource-id
    AccessibilityNodeInfo nowPlayingBarNode = HelperFunctions.findNodeByPartialResourceId(rootNode, "now_playing_bar_layout");

    if (nowPlayingBarNode != null) {
        // Click on it if found
        Rect bounds = new Rect();
        nowPlayingBarNode.getBoundsInScreen(bounds);
        helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
    } else {
        Log.e(TAG, "Now Playing Bar not found.");
        handler.postDelayed(() -> {
            helperFunctions.cleanupAndExit("Now Playing Bar not found", "error");
        }, 1000);
    }
}
    public void clickHomeButton(Action onComplete) {
        // Check if automation should continue
        if (shouldContinueAutomation()) {
            return;
        }

        // Get the service instance (assuming it's already initialized)
        AccessibilityService service = (MyAccessibilityService) this.context;

        // Perform the GLOBAL_ACTION_HOME action to minimize the app and go to the home screen
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);

        // If needed, execute callback after the action
        if (onComplete != null) {
            onComplete.execute();
        }
    }
    public List<AccessibilityNodeInfo> getAllNodes() {
        AccessibilityNodeInfo root = service.getRootInActiveWindow();
        List<AccessibilityNodeInfo> allNodes = new ArrayList<>();
        if (root != null) {
            collectNodesRecursively(root, allNodes);
        }
        return allNodes;
    }
    private void collectNodesRecursively(AccessibilityNodeInfo node, List<AccessibilityNodeInfo> result) {
        result.add(node);
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if (child != null) {
                collectNodesRecursively(child, result);
            }
        }
    }
    public void clearOnlySpotifyApps(Action onComplete) {
        Log.d(TAG, "🧹 Starting to clear only Spotify apps from recents...");

        AccessibilityService service = (MyAccessibilityService) this.context;
        service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);

        handler.postDelayed(() -> {
            service.performGlobalAction(AccessibilityService.GLOBAL_ACTION_RECENTS);

            handler.postDelayed(() -> {
                List<AccessibilityNodeInfo> allNodes = getAllNodes();

                List<AccessibilityNodeInfo> spotifyNodes = new ArrayList<>();

                for (AccessibilityNodeInfo node : allNodes) {
                    if (node == null) continue;

                    // Log everything visible
                    String label = "";

                    if (node.getContentDescription() != null)
                        label = node.getContentDescription().toString().toLowerCase();
                    else if (node.getText() != null)
                        label = node.getText().toString().toLowerCase();

                    if (label.contains("spotify")) {
                        spotifyNodes.add(node);
                        Log.d(TAG, "🎯 Found Spotify node: " + label);
                        continue;
                    }

                    // Optional: match by package name
                    if (node.getPackageName() != null) {
                        String pkg = node.getPackageName().toString().toLowerCase();
                        if (pkg.contains("spotify")) {
                            spotifyNodes.add(node);
                            Log.d(TAG, "🎯 Found Spotify by package: " + pkg);
                        }
                    }
                }

                if (spotifyNodes.isEmpty()) {
                    Log.d(TAG, "🛑 No Spotify apps found in recents.");
                    if (onComplete != null) onComplete.execute();
                    return;
                }

                // Swipe each Spotify node up
                clearSpotifyNodesSequentially(spotifyNodes, 0, onComplete);

            }, 1500);
        }, 1000);
    }
    private void closeNodesSequentially(List<AccessibilityNodeInfo> nodes, int index, Action onComplete) {
        if (index >= nodes.size()) {
            Log.d(TAG, "✅ All Spotify apps closed.");
            if (onComplete != null) onComplete.execute();
            return;
        }

        AccessibilityNodeInfo node = nodes.get(index);
        Rect bounds = new Rect();
        node.getBoundsInScreen(bounds);

        if (bounds.width() > 0 && bounds.height() > 0) {
            Path swipePath = new Path();
            swipePath.moveTo(bounds.centerX(), bounds.centerY());
            swipePath.lineTo(bounds.centerX(), bounds.centerY() - 500); // Swipe up

            GestureDescription.Builder builder = new GestureDescription.Builder();
            builder.addStroke(new GestureDescription.StrokeDescription(swipePath, 0, 300));

            ((MyAccessibilityService) context).dispatchGesture(builder.build(),
                    new AccessibilityService.GestureResultCallback() {
                        @Override
                        public void onCompleted(GestureDescription gestureDescription) {
                            Log.d(TAG, "🧹 Closed Spotify app " + (index + 1));
                            handler.postDelayed(() -> closeNodesSequentially(nodes, index + 1, onComplete), 1000);
                        }

                        @Override
                        public void onCancelled(GestureDescription gestureDescription) {
                            Log.e(TAG, "❌ Swipe to close app " + (index + 1) + " was cancelled.");
                            closeNodesSequentially(nodes, index + 1, onComplete);
                        }
                    }, null);
        } else {
            Log.w(TAG, "⚠️ Skipping invalid bounds for app at index " + index);
            closeNodesSequentially(nodes, index + 1, onComplete);
        }
    }
    private void clearSpotifyNodesSequentially(List<AccessibilityNodeInfo> nodes, int index, Action onComplete) {
        if (index >= nodes.size()) {
            Log.d(TAG, "✅ All Spotify apps cleared. Session complete.");

            // Go to home after final swipe
            handler.postDelayed(() -> {
                ((MyAccessibilityService) context).performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
                Log.d(TAG, "🏠 Returned to HOME after clearing Spotify apps.");

                if (onComplete != null) onComplete.execute();
            }, 1000); // Small delay before HOME

            return;
        }

        Log.d(TAG, "🌀 Performing swipe to close Spotify app at index: " + index);

        // Perform safe center-based swipe instead of using node bounds
        int screenHeight = context.getResources().getDisplayMetrics().heightPixels;
        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;

        float startX = screenWidth / 2f;
        float startY = screenHeight * 0.6f;
        float endY = screenHeight * 0.05f;

        Path swipePath = new Path();
        swipePath.moveTo(startX, startY);
        swipePath.lineTo(startX, endY);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(swipePath, 200, 300));

        ((MyAccessibilityService) context).dispatchGesture(gestureBuilder.build(), new AccessibilityService.GestureResultCallback() {
            @Override
            public void onCompleted(GestureDescription gestureDescription) {
                Log.d(TAG, "✅ Swipe complete for Spotify app at index: " + index);

                handler.postDelayed(() -> {
                    clearSpotifyNodesSequentially(nodes, index + 1, onComplete);
                }, 1000);
            }

            @Override
            public void onCancelled(GestureDescription gestureDescription) {
                Log.e(TAG, "❌ Swipe cancelled for Spotify app at index: " + index);
                handler.postDelayed(() -> clearSpotifyNodesSequentially(nodes, index + 1, onComplete), 1000);
            }
        }, null);
    }
    public void ensureGridViewIfNeeded(String packageId, Action callback) {
        Log.d(TAG, "Checking view density toggle (button_view_density) with retry...");
        if (shouldContinueAutomation()) return;

        AccessibilityNodeInfo root = service.getRootInActiveWindow();
        if (root == null) {
            Log.e(TAG, "Root node is null in ensureGridViewIfNeeded");
            helperFunctions.cleanupAndExit("Root node null while checking view density", "error");
            return;
        }

        AccessibilityNodeInfo btn = findViewDensityButton(root, packageId);
        if (btn != null) {
            handleViewDensityDecision(btn, callback);
        } else {
            // mirror your pattern: retry up to 3 times, then exit
            retryFindViewDensityButton(packageId, callback, 0);
        }
    }
    private void retryFindViewDensityButton(String packageId, Action callback, int retryCount) {
        if (retryCount >= 3) {
            Log.e(TAG, "View density button not found after retries.");
            handler.postDelayed(() -> {
                helperFunctions.cleanupAndExit("View density button not found after retries", "error");
            }, 1000);
            return;
        }

        handler.postDelayed(() -> {
            AccessibilityNodeInfo newRoot = service.getRootInActiveWindow();
            AccessibilityNodeInfo btn = findViewDensityButton(newRoot, packageId);

            if (btn != null) {
                Log.d(TAG, "View density button found on retry #" + (retryCount + 1));
                handleViewDensityDecision(btn, callback);
            } else {
                retryFindViewDensityButton(packageId, callback, retryCount + 1);
            }
        }, 1000);
    }
    private void handleViewDensityDecision(AccessibilityNodeInfo node, Action callback) {
        // prefer clickable parent if needed
        AccessibilityNodeInfo clickable = node.isClickable() ? node : findClickableParent(node);
        if (clickable == null) clickable = node;

        // try to read content-desc from node or its clickable parent
        String desc = "";
        if (clickable.getContentDescription() != null) {
            desc = clickable.getContentDescription().toString().trim();
        } else if (node.getContentDescription() != null) {
            desc = node.getContentDescription().toString().trim();
        }

        Log.d(TAG, "button_view_density content-desc: '" + desc + "'");

        if ("Show List view".equalsIgnoreCase(desc)) {
            // Already in Grid (tapping would switch to List) → do nothing
            Log.d(TAG, "Already in Grid view (desc says 'Show List view'). No action taken.");
            handler.postDelayed(() -> {
                if (callback != null) callback.execute();
            }, 600 + random.nextInt(600));
            return;
        }

        if ("Show Grid view".equalsIgnoreCase(desc)) {
            // Currently in List; tapping switches to Grid → click
            Log.d(TAG, "Currently in List view. Tapping to switch to Grid...");
            if (!clickable.performAction(AccessibilityNodeInfo.ACTION_CLICK)) {
                Rect b = new Rect();
                clickable.getBoundsInScreen(b);
                helperFunctions.clickOnBounds(b, callback, "Center", 1000, 1200, helperFunctions);
            } else {
                handler.postDelayed(() -> {
                    if (callback != null) callback.execute();
                }, 1000 + random.nextInt(800));
            }
            return;
        }

        // Unknown/empty description → best-effort: just continue
        Log.w(TAG, "Unexpected content-desc for view density: '" + desc + "'. Skipping toggle.");
        handler.postDelayed(() -> {
            if (callback != null) callback.execute();
        }, 600 + random.nextInt(600));
    }
    private AccessibilityNodeInfo findViewDensityButton(AccessibilityNodeInfo root, String packageId) {
        if (root == null) return null;

        // 1) Full resource-id
        String fullId = packageId + ":id/button_view_density";
        AccessibilityNodeInfo n = HelperFunctions.findNodeByResourceId(root, fullId);
        if (n != null) {
            AccessibilityNodeInfo c = n.isClickable() ? n : findClickableParent(n);
            return c != null ? c : n;
        }

        // 2) Partial resource-id (clones/OEM)
        n = HelperFunctions.findNodeByPartialResourceId(root, "button_view_density");
        if (n != null) {
            AccessibilityNodeInfo c = n.isClickable() ? n : findClickableParent(n);
            return c != null ? c : n;
        }

        // 3) Content-desc fallback
        AccessibilityNodeInfo byGrid = HelperFunctions.findNodeByContentDesc(root, "Show Grid view");
        if (byGrid != null) {
            AccessibilityNodeInfo c = byGrid.isClickable() ? byGrid : findClickableParent(byGrid);
            if (c != null) return c;
        }
        AccessibilityNodeInfo byList = HelperFunctions.findNodeByContentDesc(root, "Show List view");
        if (byList != null) {
            AccessibilityNodeInfo c = byList.isClickable() ? byList : findClickableParent(byList);
            if (c != null) return c;
        }

        return null;
    }
    public void selectRandomPlaylist(String packageName, Action callback) {
        try {
            Log.d(TAG, "Attempting to select a random playlist...");

            // Get the root node of the active window
            AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
            if (rootNode == null) {
                Log.e(TAG, "Root node is null in selectRandomPlaylist.");
                helperFunctions.cleanupAndExit("Root node is null", "error");
                return;
            }

            // Find the RecyclerView containing the list of playlists
            String recyclerViewId = packageName + ":id/recycler_view";
            AccessibilityNodeInfo recyclerView = HelperFunctions.findNodeByResourceId(rootNode, recyclerViewId);

            if (recyclerView != null) {
                // Get all the playlist items by the resource-id '...:id/card_root'
                String cardRootId = packageName + ":id/card_root";
                List<AccessibilityNodeInfo> playlistItems = HelperFunctions.findNodesByResourceId(recyclerView, cardRootId);

                if (playlistItems != null && !playlistItems.isEmpty()) {
                    // Randomly select a playlist
                    Random rand = new Random();
                    int randomIndex = rand.nextInt(playlistItems.size());
                    AccessibilityNodeInfo randomPlaylist = playlistItems.get(randomIndex);

                    if (randomPlaylist != null && randomPlaylist.isClickable()) {
                        // Get the bounds of the selected playlist to simulate the click action
                        Rect bounds = new Rect();
                        randomPlaylist.getBoundsInScreen(bounds);

                        // Clicking on the bounds of the selected playlist
                        helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
                        Log.d(TAG, "Random playlist selected and clicked.");
                    } else {
                        Log.e(TAG, "Random playlist not clickable or found.");
                        helperFunctions.cleanupAndExit("Random playlist not clickable", "error");
                    }
                } else {
                    Log.e(TAG, "No playlists found in the RecyclerView.");
                    helperFunctions.cleanupAndExit("No playlists found", "error");
                }
            } else {
                Log.e(TAG, "RecyclerView not found.");
                helperFunctions.cleanupAndExit("RecyclerView not found", "error");
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception occurred while selecting a random playlist: " + e.getMessage());
            e.printStackTrace();
            helperFunctions.cleanupAndExit("Exception occurred: " + e.getMessage(), "error");
        }
    }
    private void selectPlaylistBasedOnLayout(String packageId, Action callback) {
        try {
            AccessibilityNodeInfo root = service.getRootInActiveWindow();
            if (root == null) {
                Log.w(TAG, "selectPlaylistBasedOnLayout: root is null, default to list selector.");
                selectRandomPlaylist(packageId, callback);
                return;
            }

            String toggleId = packageId + ":id/button_view_density";
            AccessibilityNodeInfo toggle =
                    HelperFunctions.findNodeByResourceId(root, toggleId);
            if (toggle == null) {
                // fallback to partial match if needed
                toggle = HelperFunctions.findNodeByPartialResourceId(root, "button_view_density");
            }

            if (toggle != null) {
                CharSequence cd = toggle.getContentDescription();
                String desc = (cd == null) ? "" : cd.toString().toLowerCase();
                Log.d(TAG, "View density button content-desc: " + desc);

                if (desc.contains("show grid view")) {
                    // Current is LIST (pressing would show grid) → use list selector
                    Log.d(TAG, "Detected LIST layout → selectRandomPlaylist");
                    selectRandomPlaylistClone(packageId, callback);
                } else if (desc.contains("show list view")) {
                    // Current is GRID (pressing would show list) → use grid selector
                    Log.d(TAG, "Detected GRID layout → selectRandomPlaylistClone");
                    selectRandomPlaylist(packageId, callback);

                } else {
                    Log.w(TAG, "Unknown content-desc; defaulting to selectRandomPlaylist.");
                    selectRandomPlaylist(packageId, callback);
                }
            } else {
                Log.w(TAG, "button_view_density not found; defaulting to selectRandomPlaylist.");
                selectRandomPlaylist(packageId, callback);
            }
        } catch (Exception e) {
            Log.e(TAG, "selectPlaylistBasedOnLayout error: " + e.getMessage(), e);
            // Safe fallback
            selectRandomPlaylist(packageId, callback);
        }
    }
    public void selectRandomPlaylistClone(String packageId, Action callback) {
        Log.d(TAG, "Attempting to select a random playlist in the cloned app...");

        AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
        if (rootNode == null) {
            Log.e(TAG, "Root node is null in selectRandomPlaylistClone.");
            helperFunctions.cleanupAndExit("Root node is null", "error");
            return;
        }

        // 1) Find the RecyclerView
        String recyclerViewId = packageId + ":id/recycler_view";
        AccessibilityNodeInfo recyclerView =
                HelperFunctions.findNodeByResourceId(rootNode, recyclerViewId);
        if (recyclerView == null) {
            recyclerView = HelperFunctions.findNodeByPartialResourceId(rootNode, "recycler_view");
        }
        if (recyclerView == null) {
            Log.e(TAG, "RecyclerView not found.");
            helperFunctions.cleanupAndExit("RecyclerView not found", "error");
            return;
        }

        // 2) Collect playlist items
        List<AccessibilityNodeInfo> items =
                HelperFunctions.findNodesByResourceId(recyclerView, packageId + ":id/row_root");
        if (items == null || items.isEmpty()) {
            // Fallback to grid layout
            items = HelperFunctions.findNodesByResourceId(recyclerView, packageId + ":id/card_root");
        }
        if (items == null || items.isEmpty()) {
            // Final fallback with partials
            items = HelperFunctions.findNodesByPartialResourceId(recyclerView, "row_root");
            if (items == null || items.isEmpty()) {
                items = HelperFunctions.findNodesByPartialResourceId(recyclerView, "card_root");
            }
        }

        if (items == null || items.isEmpty()) {
            Log.e(TAG, "No playlists found inside RecyclerView.");
            helperFunctions.cleanupAndExit("No playlists found", "error");
            return;
        }

        // 3) Prefer clickable nodes (or their clickable parents)
        List<AccessibilityNodeInfo> clickableItems = new ArrayList<>();
        for (AccessibilityNodeInfo n : items) {
            if (n == null) continue;
            AccessibilityNodeInfo clickNode = n;
            if (!clickNode.isClickable()) {
                AccessibilityNodeInfo p = clickNode.getParent();
                while (p != null && !p.isClickable()) p = p.getParent();
                if (p != null) clickNode = p;
            }
            if (clickNode != null && clickNode.isClickable()) {
                clickableItems.add(clickNode);
            }
        }

        if (clickableItems.isEmpty()) {
            Log.e(TAG, "Playlist nodes found but none clickable.");
            helperFunctions.cleanupAndExit("Playlist nodes not clickable", "error");
            return;
        }

        // 4) Pick a random clickable item within bounds of the list
        Random rand = new Random();
        int count = clickableItems.size();
        int randomIndex = rand.nextInt(count);
        AccessibilityNodeInfo target = clickableItems.get(randomIndex);

        Rect bounds = new Rect();
        target.getBoundsInScreen(bounds);
        Log.d(TAG, "Random playlist index: " + randomIndex + " / " + count + ", bounds: " + bounds);

        // 5) Click
        helperFunctions.clickOnBounds(bounds, callback, "Center", 1500, 3000, helperFunctions);
        Log.d(TAG, "Random playlist selected and clicked.");
    }
    void start_original(String packageId, Action onComplete) {
        Log.d(TAG, "Starting Original Spotify Automation...");

        launchApp(packageId, () -> {
            handler.postDelayed(() -> {
                // Step 1: Check if Login text appears on the current screen
                AccessibilityNodeInfo rootNode = service.getRootInActiveWindow();
                if (rootNode != null) {
                    // Check if "login" appears in any node's text or contentDescription
                    if (isLoginPage(rootNode)) {
                        // If login page appears, handle error and return without proceeding to the library tab
                        Log.d(TAG, "Login page detected. Handling error.");
                        helperFunctions.cleanupAndExit("Login page detected, cannot proceed in package: " + packageId, "error");

                        // Skip all further actions and immediately call onComplete
                        if (onComplete != null) {
                            handler.post(() -> onComplete.execute());  // Ensuring the callback is executed
                        }
                        return; // Exit the function, no need to proceed further
                    }
                }

                // Step 2: Go to 'Your Library' if login page does not appear
                goToYourLibraryTabPremium(() -> {
                    Log.d(TAG, "✅ Successfully navigated to Your Library.");

                    // Step 3: Clear any existing filter
                    checkAndClearFilter(() -> {

                        // Step 4: Apply 'Playlists' filter
                        handler.postDelayed(() -> {
                            selectPlaylistsFilter(() -> {
                                Log.d(TAG, "✅ Playlists filter applied.");

                                // Step 5: Choose selector based on current layout (no layout switching)
                                handler.postDelayed(() -> {
                                    selectPlaylistBasedOnLayout(packageId, () -> {
                                        Log.d(TAG, "✅ Random playlist selected.");

                                        // Step 6: Play (after 5s)
                                        handler.postDelayed(() -> {
                                            clickPlaylistPlayButton(() -> {
                                                Log.d(TAG, "✅ Playlist started playing.");

                                                // Step 7: Shuffle (after 5s)
                                                handler.postDelayed(() -> {
                                                    shuffle(() -> {
                                                        Log.d(TAG, "✅ Shuffle completed.");

                                                        // Step 8: Home (after 2s)
                                                        handler.postDelayed(() -> {
                                                            clickHomeButton(() -> {
                                                                Log.d(TAG, "✅ Home button clicked.");
                                                                if (onComplete != null)
                                                                    onComplete.execute();
                                                            });
                                                        }, 2000);
                                                    });
                                                }, 5000);
                                            });
                                        }, 5000);
                                    });
                                }, 3000); // let the list settle before selection

                            });
                        }, 1000); // small wait after clear (or skip)
                    });
                });
            }, 5000); // let app stabilize after launch
        });
    }
    private boolean isLoginPage(AccessibilityNodeInfo rootNode) {
        Log.d(TAG, "✅ Inside login detection function.");
        if (rootNode == null) return false;

        try {
            return isLoginPageRecursive(rootNode);
        } catch (Exception e) {
            Log.e(TAG, "Error in login detection: " + e.getMessage());
            return false;
        }
    }
    private boolean isLoginPageRecursive(AccessibilityNodeInfo node) {
        if (node == null) return false;

        // Check current node
        if (containsLoginIndicators(node)) {
            return true;
        }

        // Recursively check all children
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo childNode = node.getChild(i);
            if (childNode != null) {
                try {
                    if (isLoginPageRecursive(childNode)) {
                        return true;
                    }
                } finally {
                    childNode.recycle(); // Prevent memory leaks
                }
            }
        }

        return false;
    }
    private boolean containsLoginIndicators(AccessibilityNodeInfo node) {
        // Define multiple indicators for login pages
        String[] loginIndicators = {
                "log in", "login", "sign in", "signin", "log into spotify",
                "email", "password", "username", "continue with"
        };

        // Check text content
        CharSequence text = node.getText();
        if (text != null) {
            String textStr = text.toString().toLowerCase();
            for (String indicator : loginIndicators) {
                if (textStr.contains(indicator)) {
                    Log.d(TAG, "Found login indicator in text: " + indicator);
                    return true;
                }
            }
        }

        // Check content description
        CharSequence contentDesc = node.getContentDescription();
        if (contentDesc != null) {
            String descStr = contentDesc.toString().toLowerCase();
            for (String indicator : loginIndicators) {
                if (descStr.contains(indicator)) {
                    Log.d(TAG, "Found login indicator in content description: " + indicator);
                    return true;
                }
            }
        }

        // Check resource ID (if available)
        CharSequence resourceId = node.getViewIdResourceName();
        if (resourceId != null) {
            String idStr = resourceId.toString().toLowerCase();
            if (idStr.contains("login") || idStr.contains("signin") ||
                    idStr.contains("email") || idStr.contains("password")) {
                Log.d(TAG, "Found login indicator in resource ID: " + idStr);
                return true;
            }
        }

        return false;
    }
}