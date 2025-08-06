import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

function useStopTask() {
  const [Stoploading, setStoploading] = useState(null);
  const [unscheduleLoading, setUnscheduleloading] = useState(null);
  const auth = useAuthContext();
  const navigate = useNavigate();

  async function stopTask(tasks) {
    try {
      const value = `${document.cookie}`;
      setStoploading(true);
      // const response = await fetch("http://127.0.0.1:8000/stop_task", {
      const response = await fetch("https://server.appilot.app/stop_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ command: {
                    appName: "stop automation",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  },
                  Task_ids: tasks }),
      });
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useStopTask");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      return;
    } catch (error) {
      throw new Error(error.message);
    } finally {
        setStoploading(false);
    }
  }


  async function unschedueOldJobs(tasks) {
    try {
      const value = `${document.cookie}`;
      setUnscheduleloading(true);
      // const response = await fetch("http://127.0.0.1:8000/unschedule-jobs", {
      const response = await fetch("https://server.appilot.app/unschedule-jobs", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ tasks }),
      });
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useStopTask");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      return;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setUnscheduleloading(false);
    }
  }

  return [stopTask, Stoploading, setStoploading, unschedueOldJobs, unscheduleLoading];
}

export default useStopTask;
