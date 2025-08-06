import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

function useClearOldTasks() {
  const [clearOldTasksloading, setclearOldTasksloading] = useState(null);
  const auth = useAuthContext();
  const navigate = useNavigate();

  async function clearOldTasks(tasks) {
    try {
      const value = `${document.cookie}`;
      setclearOldTasksloading(true);
      // const response = await fetch("http://127.0.0.1:8000/clear-old-jobs", {
      const response = await fetch("https://server.appilot.app/clear-old-jobs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ command: {
                    requestType: "Clear old Tasks",
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
        setclearOldTasksloading(false);
    }
  }

  return [clearOldTasks, clearOldTasksloading, setclearOldTasksloading];
}

export default useClearOldTasks;
