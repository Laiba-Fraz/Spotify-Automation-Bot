package com.example.appilot.automations.spotify;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.*;
import com.example.appilot.automations.spotify.SpotifyAutomation;  // Import SpotifyAutomation class

    class SessionConfig {
    public long durationMillis;
    public int cloneCount;

    public SessionConfig(long durationMillis, int cloneCount) {
        this.durationMillis = durationMillis;
        this.cloneCount = cloneCount;
    }
}
public class SpotifyAutomationScheduler {
    // private static final long SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
//    private static final long SESSION_DURATION = 60 * 1000; // 1 minute in milliseconds (for testing)


//    private static final long SESSION_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

    private static final long SESSION_DURATION = 120000; // 12 minutes in milliseconds (720,000 ms)



    private static final String TAG = "SpotifyAutomationScheduler";
    private ScheduledExecutorService scheduler;
    private int currentSession = 1;
    private final Handler handler;

    private List<SessionConfig> sessionList; // Will hold your frontend session input

    private final SpotifyAutomation automation;

    // Constructor to initialize the automation class and the scheduler
//    public SpotifyAutomationScheduler(SpotifyAutomation automation) {
//        this.automation = automation;  // Reference to the main automation class
//        // this.scheduler = Executors.newScheduledThreadPool(1);  // Single-threaded scheduler
//        this.scheduler = new ScheduledThreadPoolExecutor(1);
//    }
    public SpotifyAutomationScheduler(SpotifyAutomation automation, List<SessionConfig> sessionList) {
        this.handler = new Handler(Looper.getMainLooper());
        this.automation = automation;
        this.sessionList = sessionList; // Assign frontend-configured sessions here
        this.scheduler = new ScheduledThreadPoolExecutor(1);
    }


    // Method to start the scheduler and calculate the initial delay
    public void startScheduler() {
        Log.d(TAG, "🧮 Total Sessions: " + sessionList.size());

        for (int i = 0; i < sessionList.size(); i++) {
            SessionConfig config = sessionList.get(i);
            long totalMinutes = config.durationMillis / 60000;
            long hours = totalMinutes / 60;
            long minutes = totalMinutes % 60;

            Log.d(TAG, "📌 Session " + (i + 1) + " → Duration: " + hours + "h " + minutes + "m, Clone Count: " + config.cloneCount);
        }

        startNextSession();  // Start Session 1 right away
//        scheduler.scheduleWithFixedDelay(
//                new Runnable() {
//                    @Override
//                    public void run() {
//                        startNextSession();
//                    }
//                },
//                0,  // 🚀 Start immediately
//                SESSION_DURATION,
//                TimeUnit.MILLISECONDS
//        );
        // long initialDelay = getInitialDelayToStartNextSession();
        //
        // scheduler.scheduleWithFixedDelay(
        //         new Runnable() {
        //             @Override
        //             public void run() {
        //                 startNextSession();
        //             }
        //         },
        //         initialDelay,
        //         SESSION_DURATION,
        //         TimeUnit.MILLISECONDS
        // );
    }

    // Calculate the initial delay to start the next session
    private long getInitialDelayToStartNextSession() {
        long currentTimeMillis = System.currentTimeMillis();
        long sessionStartMillis = getNextSessionStartMillis(currentTimeMillis);
        return sessionStartMillis - currentTimeMillis;
    }

    // Get the start time for the next session based on the current time
    private long getNextSessionStartMillis(long currentTimeMillis) {
        int currentHour = new Date(currentTimeMillis).getHours();
        if (currentHour < 8) {
            return getStartTimeForSession(1); // 00:00 - 08:00 (Session 1)
        } else if (currentHour < 16) {
            return getStartTimeForSession(2); // 08:00 - 16:00 (Session 2)
        } else {
            return getStartTimeForSession(3); // 16:00 - 00:00 (Session 3)
        }
    }

    // Return the time in milliseconds for the start of a specific session
    private long getStartTimeForSession(int sessionNumber) {
        long currentTimeMillis = System.currentTimeMillis();
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(currentTimeMillis);

        // Set the start times for each session
        if (sessionNumber == 1) {
            calendar.set(Calendar.HOUR_OF_DAY, 0); // 00:00
        } else if (sessionNumber == 2) {
            calendar.set(Calendar.HOUR_OF_DAY, 8); // 08:00
        } else if (sessionNumber == 3) {
            calendar.set(Calendar.HOUR_OF_DAY, 16); // 16:00
        }
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        return calendar.getTimeInMillis();
    }

    // This method is called every 8 hours to start the next session
//    private void startNextSession() {
//        Log.d(TAG, "Starting Session " + currentSession);
//
//        // Trigger session-specific automation tasks
//        if (currentSession == 1) {
//            // Call start_original for session 1
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 1 completed!");
//            });
//        } else if (currentSession == 2) {
//            // Call start_clone for session 2
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 2 completed!");
//            });
//        } else if (currentSession == 3) {
//            // Call start_clone for session 3
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 3 completed!");
//            });
//        }
//
//        // Increment session counter and reset if necessary
//        currentSession = (currentSession % 3) + 1;
//    }

//    private void startNextSession() {
//        SessionConfig config = sessionList.get(currentSession - 1);
//        Log.d(TAG, "🛠️ Loaded Session " + currentSession + " → durationMillis: " + config.durationMillis + ", cloneCount: " + config.cloneCount);
//        int cloneCount = config.cloneCount;
//        Log.d(TAG, "🔁 Clone Count for Session " + currentSession + ": " + cloneCount);
//
//        Log.d(TAG, "Starting Session " + currentSession);
//        Log.d(TAG, "📅 Current Time: " + System.currentTimeMillis());
//
////        if (currentSession == 1) {
////            automation.start_original(() -> {
////                Log.d(TAG, "✅ Session 1 completed!");
////            });
//        if (currentSession == 1) {
//            // Start the original automation task
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 1 Original completed!");
//
//                // After the original automation task is finished, start the clone task
//                automation.start_clone(() -> {
//                    Log.d(TAG, "✅ Session 1 Clone completed!");
//                });
//            });
//        } else if (currentSession == 2) {
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 2 completed!");
//            });
//        } else if (currentSession == 3) {
//            automation.start_original(() -> {
//                Log.d(TAG, "✅ Session 3 completed!");
//                Log.d(TAG, "🛑 All sessions completed. Stopping scheduler.");
//                stopScheduler();
//            });
//
//            return;
//        }
//
//        Log.d(TAG, "⏳ Waiting " + (SESSION_DURATION / 1000) + " seconds before Session " + (currentSession + 1) + "...");
//        scheduler.schedule(new Runnable() {
//            @Override
//            public void run() {
//                currentSession++;
//                startNextSession();
//            }
//        }, SESSION_DURATION, TimeUnit.MILLISECONDS);
//
////        currentSession = currentSession + 1;
//    }

    private void startNextSession() {
        SessionConfig config = sessionList.get(currentSession - 1);
        Log.d(TAG, "🛠️ Loaded Session " + currentSession + " → durationMillis: " + config.durationMillis + ", cloneCount: " + config.cloneCount);
        int cloneCount = config.cloneCount;
        Log.d(TAG, "🔁 Clone Count for Session " + currentSession + ": " + cloneCount);

        Log.d(TAG, "Starting Session " + currentSession);
        Log.d(TAG, "📅 Current Time: " + System.currentTimeMillis());

        if (currentSession > sessionList.size()) {
            Log.d(TAG, "🛑 All sessions completed. Stopping scheduler.");
            stopScheduler();
            return;
        }

//        SessionConfig config = sessionList.get(currentSession - 1);
        long sessionDuration = config.durationMillis;

        Log.d(TAG, "🚀 Starting Session " + currentSession);
        Log.d(TAG, "🕒 Duration: " + sessionDuration / 1000 + " seconds");
        Log.d(TAG, "🔁 Clone Count: " + config.cloneCount);


        // Start both original and clone tasks concurrently
        automation.start_original(() -> {
                    Log.d(TAG, "✅ Original automation finished! Starting clone...");

                    // Optional: Add small delay between automations
                    handler.postDelayed(() -> {
                        automation.start_clone(() -> {
                            Log.d(TAG, "✅ All automations completed successfully!");
                            // Both automations are now completely done
                        });

                    }, 5000); // 5 second delay between automations
        });





//        automation.start_original(() -> Log.d(TAG, "✅ Original finished for session " + currentSession));
//        automation.start_clone(() -> Log.d(TAG, "✅ Clone finished for session " + currentSession));

        // Schedule next session after this one’s actual duration
//        scheduler.schedule(() -> {
//            automation.clearOnlySpotifyApps(() -> {
//                Log.d(TAG, "✅ Spotify apps cleared from recents.");
//                // Optional: proceed to next session or finish
//            });
//            currentSession++;
//            startNextSession();
//        }, sessionDuration, TimeUnit.MILLISECONDS);
        scheduler.schedule(() -> {
            automation.clearOnlySpotifyApps(() -> {
                Log.d(TAG, "✅ Spotify apps cleared from recents.");
            });

            currentSession++;

            // Delay next session by 10 seconds (10000 ms)
            handler.postDelayed(() -> {
                startNextSession();
            }, 120000);

        }, sessionDuration, TimeUnit.MILLISECONDS);

    }


//    private void startNextSession() {
//        Log.d(TAG, "Starting Session " + currentSession);
//
//        // Start the automation task for this session
//        automation.start_original(() -> {
//            Log.d(TAG, "✅ Session " + currentSession + " completed!");
//        });
//
//        // Wait for 1 minute before going to the next session
//        scheduler.schedule(new Runnable() {
//            @Override
//            public void run() {
//                currentSession++;
//
//                if (currentSession <= 3) {
//                    startNextSession(); // Start the next session
//                } else {
//                    Log.d(TAG, "🛑 All 3 sessions completed. Stopping scheduler.");
//                    stopScheduler();
//                }
//            }
//        }, SESSION_DURATION, TimeUnit.MILLISECONDS);
//    }

//    private void startNextSession() {
//        Log.d(TAG, "🚀 Starting Session " + currentSession);
//
//        // Start the automation task for this session
//        automation.start_original(() -> {
//            Log.d(TAG, "✅ Session " + currentSession + " completed!");
//        });
//
//        Log.d(TAG, "⏳ Waiting 1 minute before starting next session...");
//
//        // Schedule the next session after 1 minute
//        scheduler.schedule(new Runnable() {
//            @Override
//            public void run() {
//                currentSession++;
//
//                if (currentSession <= 3) {
//                    startNextSession(); // Start the next session
//                } else {
//                    Log.d(TAG, "🛑 All 3 sessions completed. Stopping scheduler.");
//                    stopScheduler();
//                }
//            }
//        }, SESSION_DURATION, TimeUnit.MILLISECONDS);
//    }

    // Stop the scheduler when needed
    public void stopScheduler() {
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdown();
        }
    }





}
