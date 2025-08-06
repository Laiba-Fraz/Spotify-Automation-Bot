import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { failToast } from "../../Utils/utils";

function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const auth = useAuthContext();
  const navigate = useNavigate();

  const createTask = async (taskData, botId) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      setLoading(true);
      const value = `${document.cookie}`;
      // const response = await fetch("http://127.0.0.1:8000/create-task", {
        const response = await fetch("https://server.appilot.app/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({
          taskName: taskData.taskName,
          serverId: taskData.serverId !== "" ? taskData.serverId : "",
          channelId: taskData.channelId !== "" ? taskData.channelId : "",
          bot: botId,
          status: "awaiting",
          email: auth.data.email,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useCreateTask");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      return res.id;
    } catch (error) {
      if (error.message === "AbortError") {
        throw new Error("Please try again");
      } else {
        throw new Error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return [loading, createTask];
}

export default useCreateTask;
