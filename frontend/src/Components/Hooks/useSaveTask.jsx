import { useState } from "react";
import { failToast, loadingToast, transformData, transformDataForSchedule, updateLoadingToast, validateInputs } from "../../Utils/utils";
import { useAuthContext } from "./useAuthContext";

function useSaveTask() {
  const [loading, setLoading] = useState(false);
  const auth = useAuthContext();

  const saveTask = async (task) => {
    console.log("entered saveTask");
    console.log(task);
    const validateInputsResult = validateInputs(task.task.inputs.inputs)
    if(!validateInputsResult){
      console.log("Inputs check failed");
      return {
        success: false,
        navigateTo: "Input"
      }
    }
    console.log("Inputs validated");
    const durationInputs = transformDataForSchedule(task.task.schedules);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      setLoading(true);
      const Loadingid = loadingToast("Saving Task");
      // setError(null);
      const value = `${document.cookie}`;
      const response = await fetch("https://server.appilot.app/send_command", {
        // const response = await fetch("http://127.0.0.1:8000/send_command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({
          command: {
            task_id: task.task.id,
            appName: task.bot.botName,
            inputs: transformData(task.task.inputs.inputs),
            ...durationInputs,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            newInputs: task.task.inputs,
            newSchecdules: task.task.schedules
          },
          device_ids: task.task.deviceIds,
        }),
        // signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const res = await response.json();
      if (!response.ok) {
        updateLoadingToast(Loadingid);
        if (response.status === 401) {
          updateLoadingToast(Loadingid);
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          failToast("please logIn again");
          return {
            success: false,
            navigateTo: "/log-in"
          }
          // console.log("inside 401 of send_command");
          // failToast("please logIn again");
          // navigate("/log-in");
        } else if (response.status === 400) {
          updateLoadingToast(Loadingid);
          failToast(res.message);
          return {
            success: false,
            navigateTo: "/tasks"
          }
        }
        if (response.detail?.devices) {
          const errorMessage = response.detail.devices
            .map((el) => el.deviceName)
            .join(", ");
          throw new Error(`Devices with name ${errorMessage} are not active`);
        }
        throw new Error(response.message);
      }
      updateLoadingToast(Loadingid);
      return {
        success: true,
        message: "Task started",
        navigateTo: "/tasks"
      }
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

  return [loading, saveTask];
}

export default useSaveTask;
