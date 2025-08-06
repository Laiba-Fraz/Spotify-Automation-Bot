import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { failToast } from "../../Utils/utils";

function useUpdateTask() {
  const [loading, setLoading] = useState(false);
  const auth = useAuthContext();
  const navigate = useNavigate();
  const updateTask = async (id, data) => {
    try {
      setLoading(true);
      const value = `${document.cookie}`;
      const response = await fetch("https://server.appilot.app/update-task", {
        // const response = await fetch("http://127.0.0.1:8000/update-task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({
          id: id,
          data: data,
        }),
      });

      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useUpdateTask");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        // throw new Error(res.message);
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return [updateTask, loading];
}

export default useUpdateTask;
