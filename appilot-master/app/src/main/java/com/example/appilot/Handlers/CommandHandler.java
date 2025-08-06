//package com.example.appilot.Handlers;
//
//
//import android.util.Log;
//
//import com.example.appilot.automations.InstagramFollowerBot.InstagramFollowerBotAutomation;
//import com.example.appilot.automations.reddit.RedditAutomation;
//import com.example.appilot.services.MyAccessibilityService;
//
//import org.json.JSONArray;
//import org.json.JSONException;
//import org.json.JSONObject;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//import java.util.Random;
//
//public class CommandHandler {
//    private static final String TAG = "CommandHandler";
//    private final MyAccessibilityService service;
//
//    // Track currently running automation
//    private RedditAutomation redditAutomation;
//    private InstagramFollowerBotAutomation instagramFollowerBotAutomation;
//    private volatile boolean shouldAutomationStop = false;
//    private Random random = new Random();
//
//    // Add a variable to track which automation is currently running
//    private String currentlyRunningAutomation = null;
//
//    public CommandHandler(MyAccessibilityService service) {
//        this.service = service;
//    }
//
//    // Helper method to stop all running automations
//    private void stopAllAutomations() {
//        Log.d(TAG, "Stopping all automations");
//        shouldAutomationStop = true;
//
//        // Stop Reddit automation if running
//        if (redditAutomation != null) {
//            // Assuming RedditAutomation has a method to stop it
////            redditAutomation.shouldStop;
//            redditAutomation = null;
//        }
//
//        // Stop Instagram automation if running
//        if (instagramFollowerBotAutomation != null) {
//            // Assuming InstagramFollowerBotAutomation has a method to stop it
//            instagramFollowerBotAutomation.shouldStop = true;
//            instagramFollowerBotAutomation = null;
//        }
//
//        // Reset the currently running automation tracker
//        currentlyRunningAutomation = null;
//    }
//
//    public void executeAutomation(String command) {
//        String duration = null;
//        JSONArray inputsArray;
//
//        try {
//            // Parse the command as a JSON object
//            JSONObject commandJson = new JSONObject(command);
//            Log.d(TAG, "Start Automation Command Received after JSON conversion: " + command);
//            String appName = commandJson.getString("appName");
//            duration = commandJson.optString("duration", "0");
//            int durationInt = Integer.parseInt(duration);
//            String Task_Id = commandJson.optString("task_id", null);
//            String job_id = commandJson.optString("job_id", null);
//
//            switch (appName.toLowerCase()) {
//                case "stop automation":
//                    Log.e(TAG, "Stopping automation");
//                    stopAllAutomations();
//                    break;
//
//                case "reddit karma bot":
//                    // Set the currently running automation
//                    currentlyRunningAutomation = "reddit";
//
//                    JSONArray scrollingInputs = null;
//                    JSONArray voteInputs = null;
//                    JSONArray commentInputs = null;
//                    JSONArray userType = null;
//                    boolean isvoting = false;
//                    boolean isCommenting = false;
//                    int maxUpvote = 0;
//                    int maxComment = 0;
//                    long upvoteDuration = 0;
//                    long commentDuration = 0;
//
//                    inputsArray = commandJson.getJSONArray("inputs");
//                    for (int i = 0; i < inputsArray.length(); i++) {
//                        JSONObject inputObject = inputsArray.getJSONObject(i);
//                        if (inputObject.has("Scrolling")) {
//                            scrollingInputs = inputObject.getJSONArray("Scrolling");
//                        } else if (inputObject.has("Upvote or Downvote a Random Post")) {
//                            voteInputs = inputObject.getJSONArray("Upvote or Downvote a Random Post");
//                            isvoting = voteInputs.getJSONObject(0).getBoolean("Quick Upvote");
//                        } else if (inputObject.has("Comment on a Random Post")) {
//                            commentInputs = inputObject.getJSONArray("Comment on a Random Post");
//                            isCommenting = commentInputs.getJSONObject(0).getBoolean("Quick Comment") || commentInputs.getJSONObject(1).getBoolean("Detailed Response") || commentInputs.getJSONObject(2).getBoolean("Reply to Comment")? true:false;
//                        }  else if (inputObject.has("User Interaction Speed")) {
//                            userType = inputObject.getJSONArray("User Interaction Speed");
//                        }
//                    }
//
//                    if (durationInt < 1) {
//                        Log.d(TAG, "Insufficient time for automation: " + durationInt);
//                        break;
//                    }
//
//                    if (scrollingInputs != null || voteInputs != null || commentInputs != null || userType != null) {
//                        Log.d(TAG, "Reddit automation will run for duration: " + durationInt);
//                        Log.d(TAG, "Starting Reddit automation with Scrolling: " + scrollingInputs);
//                        Log.d(TAG, "Starting Reddit automation with upvoting: " + voteInputs);
//                        Log.d(TAG, "Starting Reddit automation with commenting: " + commentInputs);
//                        Log.d(TAG, "Starting Reddit automation with User Type: " + userType);
//                        if(isvoting || isCommenting ){
//                            if (userType.getJSONObject(0).getBoolean("Normal User")) {
//                                if (durationInt > 0 && durationInt <= 60) {
//                                    if(isvoting){
//                                        upvoteDuration = 120000 + random.nextInt(360000);
//                                        maxUpvote = 1;
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 720000 + random.nextInt(1800000);
//                                        maxComment = 1;
//                                    }
//                                } else if (durationInt > 60 && durationInt <= 1440) {
//                                    if(isvoting){
//                                        upvoteDuration = 3600000;
//                                        maxUpvote = 10 + random.nextInt(15);
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 3600000;
//                                        maxComment = 2 + random.nextInt(3);
//                                    }
//                                } else if (durationInt > 1440) {
//                                    if(isvoting){
//                                        upvoteDuration = 3600000 + random.nextInt(7200000);
//                                        maxUpvote = 20 + random.nextInt(30);
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 3600000 + random.nextInt(7200000);
//                                        maxComment = 2 + random.nextInt(8);
//                                    }
//                                }
//                            } else if (userType.getJSONObject(1).getBoolean("Extensive User")) {
//                                if (durationInt > 0 && durationInt <= 60) {
//                                    if(isvoting){
//                                        upvoteDuration = 60000 + random.nextInt(120000);
//                                        maxUpvote = 1;
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 360000 + random.nextInt(720000);
//                                        maxComment = 1;
//                                    }
//                                } else if (durationInt > 60 && durationInt <= 1440) {
//                                    if(isvoting){
//                                        upvoteDuration = 3600000;
//                                        maxUpvote = 30 + random.nextInt(20);
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 3600000;
//                                        maxComment = 5 + random.nextInt(5);
//                                    }
//                                } else if (durationInt > 1440) {
//                                    if(isvoting){
//                                        upvoteDuration = 180000 + random.nextInt(300000);
//                                        maxUpvote = 100 + random.nextInt(150);
//                                    }
//                                    if(isCommenting){
//                                        commentDuration = 180000 + random.nextInt(300000);
//                                        maxComment = 15 + random.nextInt(35);
//                                    }
//                                }
//                            }
//                        }
//
//                        redditAutomation = new RedditAutomation(this.service, durationInt, scrollingInputs, voteInputs, commentInputs, userType, maxUpvote, maxComment, upvoteDuration, commentDuration, Task_Id, job_id);
//                        redditAutomation.startScrollingAndUpvoting();
//                        break;
//                    } else {
//                        Log.d(TAG, "inputs are incorrect.");
//                    }
//                    break;
//
//                case "instagram followers bot":
//                    // Set the currently running automation
//                    currentlyRunningAutomation = "instagram";
//
//                    Log.d(TAG, "Starting Instagram followers bot automation with duration: " + durationInt);
//
//                    JSONObject notificationSuggestionFollowInputs = null;
//                    JSONObject profileSuggestionFollowInputs = null;
//                    JSONObject profilePostsFollowInputs = null;
//                    String type = null;
//                    String url = null;
//                    String typeOfSortForUnfollowing = null;
//                    List<String> positiveKeywords = new ArrayList<>();
//                    List<String> negativeKeywords = new ArrayList<>();
//                    List<String> usersToExcludeList = new ArrayList<>();
//
//                    inputsArray = commandJson.getJSONArray("inputs");
//                    List<Object> inputsList = new ArrayList<>();
//                    for (int i = 0; i < inputsArray.length(); i++) {
//                        Object input = inputsArray.get(i); // This will get the Object (could be JSONObject, String, Integer, etc.)
//                        inputsList.add(input);
//                    }
//                    List<String> usernamesToExclude = new ArrayList<>();
//                    boolean multipleAccountAutomation = false;
//                    int maxSleepTime = 2;
//                    int minSleepTime = 1;
//                    int maxFollowsPerHour = 10;
//                    int minFollowsPerHour = 7;
//                    int maxFollowsDaily = 30;
//                    int minFollowsDaily = 20;
//                    int mutualFriendsCount = 1;
//
//                    for (int i = 0; i < inputsArray.length(); i++) {
//                        JSONObject inputObject = inputsArray.getJSONObject(i);
//
//                        if (inputObject.has("Following Automation Type")) {
//                            JSONArray automationTypeArray = inputObject.getJSONArray("Following Automation Type");
//
//                            for (int j = 0; j < automationTypeArray.length(); j++) {
//                                JSONObject automationType = automationTypeArray.getJSONObject(j);
//
//                                if (automationType.has("Follow from Notification Suggestions") &&
//                                        automationType.getBoolean("Follow from Notification Suggestions")) {
//                                    type = "NotificationSuggestion";
//                                    url = "https://www.instagram.com";
//
//                                    JSONArray positiveKeywordsArray = automationType.getJSONArray("positiveKeywords");
//                                    JSONArray negativeKeywordsArray = automationType.getJSONArray("negativeKeywords");
//
//                                    for (int k = 0; k < positiveKeywordsArray.length(); k++) {
//                                        positiveKeywords.add(positiveKeywordsArray.getString(k));
//                                    }
//
//                                    for (int k = 0; k < negativeKeywordsArray.length(); k++) {
//                                        negativeKeywords.add(negativeKeywordsArray.getString(k));
//                                    }
//                                    if (automationType.has("mutualFriendsCount")) {
//                                        mutualFriendsCount = automationType.getInt("mutualFriendsCount");
//                                    }
//
//                                    if (automationType.has("minFollowsPerHour") && automationType.has("maxFollowsPerHour")) {
//                                        minFollowsPerHour = automationType.getInt("minFollowsPerHour");
//                                        maxFollowsPerHour = automationType.getInt("maxFollowsPerHour");
//                                    }
//
//                                    if (automationType.has("minFollowsDaily") && automationType.has("maxFollowsDaily")) {
//                                        maxFollowsDaily = automationType.getInt("maxFollowsDaily");
//                                        minFollowsDaily = automationType.getInt("minFollowsDaily");
//                                    }
//                                    if (automationType.has("maxSleepTime") && automationType.has("minSleepTime")) {
//                                        maxSleepTime = automationType.getInt("maxSleepTime");
//                                        minSleepTime = automationType.getInt("minSleepTime");
//                                    }
//
//                                    Log.d(TAG, "Matched 'Follow from Notification Suggestions'. Breaking loop.");
//                                    break;
//                                } else if (automationType.has("Follow from Profile Followers List") &&
//                                        automationType.getBoolean("Follow from Profile Followers List")) {
//                                    type = "ProfileSuggestion";
//                                    url = automationType.optString("url", "");
//
//                                    JSONArray positiveKeywordsArray = automationType.getJSONArray("positiveKeywords");
//                                    JSONArray negativeKeywordsArray = automationType.getJSONArray("negativeKeywords");
//
//                                    for (int k = 0; k < positiveKeywordsArray.length(); k++) {
//                                        positiveKeywords.add(positiveKeywordsArray.getString(k));
//                                    }
//
//                                    for (int k = 0; k < negativeKeywordsArray.length(); k++) {
//                                        negativeKeywords.add(negativeKeywordsArray.getString(k));
//                                    }
//                                    if (automationType.has("mutualFriendsCount")) {
//                                        mutualFriendsCount = automationType.getInt("mutualFriendsCount");
//                                    }
//
//                                    if (automationType.has("minFollowsPerHour") && automationType.has("maxFollowsPerHour")) {
//                                        minFollowsPerHour = automationType.getInt("minFollowsPerHour");
//                                        maxFollowsPerHour = automationType.getInt("maxFollowsPerHour");
//                                    }
//
//                                    if (automationType.has("minFollowsDaily") && automationType.has("maxFollowsDaily")) {
//                                        maxFollowsDaily = automationType.getInt("maxFollowsDaily");
//                                        minFollowsDaily = automationType.getInt("minFollowsDaily");
//                                    }
//                                    if (automationType.has("maxSleepTime") && automationType.has("minSleepTime")) {
//                                        maxSleepTime = automationType.getInt("maxSleepTime");
//                                        minSleepTime = automationType.getInt("minSleepTime");
//                                    }
//
//                                    Log.d(TAG, "Matched 'Follow from Profile Followers List'. Breaking loop.");
//                                    break;
//                                } else if (automationType.has("Follow from Profile Posts") &&
//                                        automationType.getBoolean("Follow from Profile Posts")) {
//                                    type = "ProfileLikersFollow";
//                                    url = automationType.optString("url", "");
//
//                                    JSONArray positiveKeywordsArray = automationType.getJSONArray("positiveKeywords");
//                                    JSONArray negativeKeywordsArray = automationType.getJSONArray("negativeKeywords");
//
//                                    for (int k = 0; k < positiveKeywordsArray.length(); k++) {
//                                        positiveKeywords.add(positiveKeywordsArray.getString(k));
//                                    }
//
//                                    for (int k = 0; k < negativeKeywordsArray.length(); k++) {
//                                        negativeKeywords.add(negativeKeywordsArray.getString(k));
//                                    }
//                                    if (automationType.has("mutualFriendsCount")) {
//                                        mutualFriendsCount = automationType.getInt("mutualFriendsCount");
//                                    }
//
//                                    if (automationType.has("minFollowsPerHour") && automationType.has("maxFollowsPerHour")) {
//                                        minFollowsPerHour = automationType.getInt("minFollowsPerHour");
//                                        maxFollowsPerHour = automationType.getInt("maxFollowsPerHour");
//                                    }
//
//                                    if (automationType.has("minFollowsDaily") && automationType.has("maxFollowsDaily")) {
//                                        maxFollowsDaily = automationType.getInt("maxFollowsDaily");
//                                        minFollowsDaily = automationType.getInt("minFollowsDaily");
//                                    }
//                                    if (automationType.has("maxSleepTime") && automationType.has("minSleepTime")) {
//                                        maxSleepTime = automationType.getInt("maxSleepTime");
//                                        minSleepTime = automationType.getInt("minSleepTime");
//                                    }
//
//                                    Log.d(TAG, "Matched 'Follow from Profile Posts'. Breaking loop.");
//                                    break;
//                                } else if (automationType.has("Unfollow Non-Followers") &&
//                                        automationType.getBoolean("Unfollow Non-Followers")) {
//                                    type = "unFollow";
//                                    url = "https://www.instagram.com";
//                                    mutualFriendsCount = 0;
//                                    positiveKeywords = Collections.emptyList(); // No keywords required
//                                    negativeKeywords = Collections.emptyList(); // No keywords required
//                                    JSONArray UsersToExcludeList = automationType.getJSONArray("usersToExcludeList");
//                                    typeOfSortForUnfollowing = automationType.optString("typeOfUnfollowing", "Default");
//
//                                    for (int k = 0; k < UsersToExcludeList.length(); k++) {
//                                        usersToExcludeList.add(UsersToExcludeList.getString(k));
//                                    }
//
//                                    if (automationType.has("minFollowsPerHour") && automationType.has("maxFollowsPerHour")) {
//                                        minFollowsPerHour = automationType.getInt("minFollowsPerHour");
//                                        maxFollowsPerHour = automationType.getInt("maxFollowsPerHour");
//                                    }
//
//                                    if (automationType.has("minFollowsDaily") && automationType.has("maxFollowsDaily")) {
//                                        maxFollowsDaily = automationType.getInt("maxFollowsDaily");
//                                        minFollowsDaily = automationType.getInt("minFollowsDaily");
//                                    }
//                                    if (automationType.has("maxSleepTime") && automationType.has("minSleepTime")) {
//                                        maxSleepTime = automationType.getInt("maxSleepTime");
//                                        minSleepTime = automationType.getInt("minSleepTime");
//                                    }
//                                    Log.d(TAG, "Matched 'Unfollow Non-Followers'. Breaking loop.");
//                                    break;
//                                } else if (automationType.has("Accept All Follow Requests") &&
//                                        automationType.getBoolean("Accept All Follow Requests")) {
//                                    type = "FollowAllRequests";
//                                    url = "https://www.instagram.com";
//                                    mutualFriendsCount = 0; // Unnecessary, so set to default
//                                    positiveKeywords = Collections.emptyList(); // No keywords required
//                                    negativeKeywords = Collections.emptyList(); // No keywords required
//                                    if (automationType.has("maxSleepTime") && automationType.has("minSleepTime")) {
//                                        maxSleepTime = automationType.getInt("maxSleepTime");
//                                        minSleepTime = automationType.getInt("minSleepTime");
//                                    }
//                                    Log.d(TAG, "Accept All Follow Requests'. Breaking loop.");
//                                    break;
//                                }
//                            }
//                        } else if (inputObject.has("Multiple Account Automation")) {
//                            JSONArray multipleAccountArray = inputObject.getJSONArray("Multiple Account Automation");
//                            JSONObject multipleAccountObject = multipleAccountArray.getJSONObject(0);
//
//                            if (multipleAccountObject.has("Multiple Account Automation")) {
//                                multipleAccountAutomation = multipleAccountObject.getBoolean("Multiple Account Automation");
//                            }
//
//                            if (multipleAccountObject.has("usernamesToExclude")) {
//                                JSONArray usernamesArray = multipleAccountObject.getJSONArray("usernamesToExclude");
//                                for (int j = 0; j < usernamesArray.length(); j++) {
//                                    usernamesToExclude.add(usernamesArray.getString(j));
//                                }
//                            }
//
//                            Log.d(TAG, "Parsed 'Multiple Account Automation' with usernamesToExclude: " + usernamesToExclude);
//                        }
//                    }
//
//                    instagramFollowerBotAutomation = new InstagramFollowerBotAutomation(
//                            this.service,
//                            Task_Id,
//                            job_id,
//                            inputsList
////                            type,
////                            url,
////                            positiveKeywords,
////                            negativeKeywords,
////                            multipleAccountAutomation,
////                            usernamesToExclude,
////                            minSleepTime,
////                            maxSleepTime,
////                            mutualFriendsCount,
////                            minFollowsPerHour,
////                            maxFollowsPerHour,
////                            maxFollowsDaily,
////                            minFollowsDaily,
////                            typeOfSortForUnfollowing,
////                            usersToExcludeList
//                    );
//                    instagramFollowerBotAutomation.checkToperformWarmUpAndThenStartAutomation();
//                    break;
//
//                case "twitter":
//                    // Stop any running automations before starting new one
//                    stopAllAutomations();
//
//                    // Set the currently running automation
//                    currentlyRunningAutomation = "twitter";
//
//                    Log.d(TAG, "Starting Twitter automation with duration: " + durationInt);
//                    // Placeholder for Twitter automation logic
//                    // Example: twitterAutomation = new TwitterAutomation(this, durationInt);
//                    // twitterAutomation.startAutomation();
//                    break;
//
//                default:
//                    Log.e(TAG, "Unknown command received: " + appName);
//                    break;
//            }
//        } catch (JSONException e) {
//            Log.e(TAG, "Failed to parse command: " + command, e);
//        } catch (NumberFormatException e) {
//            Log.e(TAG, "Invalid duration format: " + duration, e);
//        }
//    }
//}
//
//


//It’s the class that:
//Receives a command from the backend (via WebSocket)
//Reads what app/task to run (Reddit, Instagram, etc.)
//Extracts options/settings from the command (like duration, features to enable)
//Then starts the right automation


package com.example.appilot.Handlers;


import android.util.Log;

import com.example.appilot.automations.InstagramFollowerBot.InstagramFollowerBotAutomation;
import com.example.appilot.automations.reddit.RedditAutomation;
import com.example.appilot.services.MyAccessibilityService;

//import com.example.appilot.automations.spotify.SpotifyAutomation; //-Laiba
import com.example.appilot.automations.spotify.SpotifyAutomation;



import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class CommandHandler {
    private static final String TAG = "CommandHandler";
    private final MyAccessibilityService service;

    // Track currently running automation
    private RedditAutomation redditAutomation;
    private InstagramFollowerBotAutomation instagramFollowerBotAutomation;

    private SpotifyAutomation spotifyAutomation; //-Laiba

    private volatile boolean shouldAutomationStop = false;
    private Random random = new Random();

    // Add a variable to track which automation is currently running
    private String currentlyRunningAutomation = null;

    public CommandHandler(MyAccessibilityService service) {
        this.service = service;
    }

    // Helper method to stop all running automations
    private void stopAllAutomations() {
        Log.d(TAG, "Stopping all automations");
        shouldAutomationStop = true;

        // Stop Reddit automation if running
        if (redditAutomation != null) {
            // Assuming RedditAutomation has a method to stop it
//            redditAutomation.shouldStop;
            redditAutomation = null;
        }

        // Stop Instagram automation if running
        if (instagramFollowerBotAutomation != null) {
            // Assuming InstagramFollowerBotAutomation has a method to stop it
            instagramFollowerBotAutomation.shouldStop = true;
            instagramFollowerBotAutomation = null;
        }

        // Reset the currently running automation tracker
        currentlyRunningAutomation = null;
    }

    public void executeAutomation(String command) {
        String duration = null;
        JSONArray inputsArray;

        try {
            // Parse the command as a JSON object
            JSONObject commandJson = new JSONObject(command);
            Log.d(TAG, "Start Automation Command Received after JSON conversion: " + command);
            String appName = commandJson.getString("appName");
            duration = commandJson.optString("duration", "0");
            int durationInt = Integer.parseInt(duration);
            String Task_Id = commandJson.optString("task_id", null);
            String job_id = commandJson.optString("job_id", null);

            switch (appName.toLowerCase()) {
                case "stop automation":
                    Log.e(TAG, "Stopping automation");
                    stopAllAutomations();
                    break;

                case "reddit karma bot":
                    // Set the currently running automation
                    currentlyRunningAutomation = "reddit";

                    JSONArray scrollingInputs = null;
                    JSONArray voteInputs = null;
                    JSONArray commentInputs = null;
                    JSONArray userType = null;
                    boolean isvoting = false;
                    boolean isCommenting = false;
                    int maxUpvote = 0;
                    int maxComment = 0;
                    long upvoteDuration = 0;
                    long commentDuration = 0;

                    inputsArray = commandJson.getJSONArray("inputs");
                    for (int i = 0; i < inputsArray.length(); i++) {
                        JSONObject inputObject = inputsArray.getJSONObject(i);
                        if (inputObject.has("Scrolling")) {
                            scrollingInputs = inputObject.getJSONArray("Scrolling");
                        } else if (inputObject.has("Upvote or Downvote a Random Post")) {
                            voteInputs = inputObject.getJSONArray("Upvote or Downvote a Random Post");
                            isvoting = voteInputs.getJSONObject(0).getBoolean("Quick Upvote");
                        } else if (inputObject.has("Comment on a Random Post")) {
                            commentInputs = inputObject.getJSONArray("Comment on a Random Post");
                            isCommenting = commentInputs.getJSONObject(0).getBoolean("Quick Comment") || commentInputs.getJSONObject(1).getBoolean("Detailed Response") || commentInputs.getJSONObject(2).getBoolean("Reply to Comment")? true:false;
                        }  else if (inputObject.has("User Interaction Speed")) {
                            userType = inputObject.getJSONArray("User Interaction Speed");
                        }
                    }

                    if (durationInt < 1) {
                        Log.d(TAG, "Insufficient time for automation: " + durationInt);
                        break;
                    }

                    if (scrollingInputs != null || voteInputs != null || commentInputs != null || userType != null) {
                        Log.d(TAG, "Reddit automation will run for duration: " + durationInt);
                        Log.d(TAG, "Starting Reddit automation with Scrolling: " + scrollingInputs);
                        Log.d(TAG, "Starting Reddit automation with upvoting: " + voteInputs);
                        Log.d(TAG, "Starting Reddit automation with commenting: " + commentInputs);
                        Log.d(TAG, "Starting Reddit automation with User Type: " + userType);
                        if(isvoting || isCommenting ){
                            if (userType.getJSONObject(0).getBoolean("Normal User")) {
                                if (durationInt > 0 && durationInt <= 60) {
                                    if(isvoting){
                                        upvoteDuration = 120000 + random.nextInt(360000);
                                        maxUpvote = 1;
                                    }
                                    if(isCommenting){
                                        commentDuration = 720000 + random.nextInt(1800000);
                                        maxComment = 1;
                                    }
                                } else if (durationInt > 60 && durationInt <= 1440) {
                                    if(isvoting){
                                        upvoteDuration = 3600000;
                                        maxUpvote = 10 + random.nextInt(15);
                                    }
                                    if(isCommenting){
                                        commentDuration = 3600000;
                                        maxComment = 2 + random.nextInt(3);
                                    }
                                } else if (durationInt > 1440) {
                                    if(isvoting){
                                        upvoteDuration = 3600000 + random.nextInt(7200000);
                                        maxUpvote = 20 + random.nextInt(30);
                                    }
                                    if(isCommenting){
                                        commentDuration = 3600000 + random.nextInt(7200000);
                                        maxComment = 2 + random.nextInt(8);
                                    }
                                }
                            } else if (userType.getJSONObject(1).getBoolean("Extensive User")) {
                                if (durationInt > 0 && durationInt <= 60) {
                                    if(isvoting){
                                        upvoteDuration = 60000 + random.nextInt(120000);
                                        maxUpvote = 1;
                                    }
                                    if(isCommenting){
                                        commentDuration = 360000 + random.nextInt(720000);
                                        maxComment = 1;
                                    }
                                } else if (durationInt > 60 && durationInt <= 1440) {
                                    if(isvoting){
                                        upvoteDuration = 3600000;
                                        maxUpvote = 30 + random.nextInt(20);
                                    }
                                    if(isCommenting){
                                        commentDuration = 3600000;
                                        maxComment = 5 + random.nextInt(5);
                                    }
                                } else if (durationInt > 1440) {
                                    if(isvoting){
                                        upvoteDuration = 180000 + random.nextInt(300000);
                                        maxUpvote = 100 + random.nextInt(150);
                                    }
                                    if(isCommenting){
                                        commentDuration = 180000 + random.nextInt(300000);
                                        maxComment = 15 + random.nextInt(35);
                                    }
                                }
                            }
                        }

                        redditAutomation = new RedditAutomation(this.service, durationInt, scrollingInputs, voteInputs, commentInputs, userType, maxUpvote, maxComment, upvoteDuration, commentDuration, Task_Id, job_id);
                        redditAutomation.startScrollingAndUpvoting();
                        break;
                    } else {
                        Log.d(TAG, "inputs are incorrect.");
                    }
                    break;

                case "instagram followers bot":
                    currentlyRunningAutomation = "instagram";

                    Log.d(TAG, "Starting Instagram followers bot automation with duration: " + durationInt);
                    inputsArray = commandJson.getJSONArray("inputs");

                    // Create a proper list of objects from the JSONArray
                    List<Object> inputsList = new ArrayList<>();
                    for (int i = 0; i < inputsArray.length(); i++) {
                        // This will properly maintain the JSONObject type
                        inputsList.add(inputsArray.get(i));
                    }

                    instagramFollowerBotAutomation = new InstagramFollowerBotAutomation(
                            this.service,
                            Task_Id,
                            job_id,
                            inputsList
                    );
                    instagramFollowerBotAutomation.checkToperformWarmUpAndThenStartAutomation();
                    break;

                case "twitter":
                    // Stop any running automations before starting new one
                    stopAllAutomations();

                    // Set the currently running automation
                    currentlyRunningAutomation = "twitter";

                    Log.d(TAG, "Starting Twitter automation with duration: " + durationInt);
                    // Placeholder for Twitter automation logic
                    // Example: twitterAutomation = new TwitterAutomation(this, durationInt);
                    // twitterAutomation.startAutomation();
                    break;

                case "spotify bot":
                    currentlyRunningAutomation = "spotify";

                    Log.d(TAG, "Starting Spotify automation with duration: " + durationInt);

                    // Extract inputs from JSON
                    inputsArray = commandJson.getJSONArray("inputs");
                    List<Object> spotifyInputsList = new ArrayList<>();
                    for (int i = 0; i < inputsArray.length(); i++) {
                        spotifyInputsList.add(inputsArray.get(i));
                    }

                    // Create and start Spotify automation
                    spotifyAutomation = new SpotifyAutomation(this.service, Task_Id, job_id, spotifyInputsList);
                    spotifyAutomation.start();
                    break;


                default:
                    Log.e(TAG, "Unknown command received: " + appName);
                    break;
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse command: " + command, e);
        } catch (NumberFormatException e) {
            Log.e(TAG, "Invalid duration format: " + duration, e);
        }
    }
}