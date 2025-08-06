import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

function useDeleteTask() {
  const [deleteloading, setDeleteloading] = useState(null);
  const auth = useAuthContext();
  const navigate = useNavigate();

  async function deleteTask(tasks) {
    try {
      const value = `${document.cookie}`;
      setDeleteloading(true);
      // const response = await fetch("http://127.0.0.1:8000/delete-tasks", {
      const response = await fetch("https://server.appilot.app/delete-tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ tasks }),
      });
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useDeleteTask");
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
      setDeleteloading(false);
    }
  }

  return [deleteTask, deleteloading, setDeleteloading];
}

export default useDeleteTask;
