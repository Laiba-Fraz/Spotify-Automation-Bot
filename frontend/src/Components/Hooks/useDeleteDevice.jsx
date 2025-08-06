import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { failToast } from "../../Utils/utils";
import { useNavigate } from "react-router-dom";

function useDeleteDevice() {
  const [deleteloading, setDeleteloading] = useState(null);
  const auth = useAuthContext();
  const navigate = useNavigate();

  async function deleteDevice(devices) {
    try {
      const value = `${document.cookie}`;
      setDeleteloading(true);
      // const response = await fetch("http://127.0.0.1:8000/delete-devices", {
      const response = await fetch(
        "https://server.appilot.app/delete-devices",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: value !== "" ? value.split("access_token=")[1] : "",
          },
          body: JSON.stringify({ devices }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of delete task");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    } finally {
      setDeleteloading(false);
    }
  }

  async function UpdateDevice(devices, dataToUpdate) {
    try {
      const value = `${document.cookie}`;
      setDeleteloading(true);
      // const response = await fetch("http://127.0.0.1:8000/edit-device", {
      const response = await fetch(
        "https://server.appilot.app/edit-device",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: value !== "" ? value.split("access_token=")[1] : "",
          },
          body: JSON.stringify({ devices, dataToUpdate }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of update task");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    } finally {
      setDeleteloading(false);
    }
  }

  async function updateDeviceStatus(devices) {
    try {
      const value = `${document.cookie}`;
      const response = await fetch("http://127.0.0.1:8000/update-status", {
      // const response = await fetch(
      //   "https://server.appilot.app/update-status",
      //   {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: value !== "" ? value.split("access_token=")[1] : "",
          },
          body: JSON.stringify({ devices }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of delete task");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.message);
      }
      console.log(res);
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    } 
  }

  return [deleteDevice, deleteloading, setDeleteloading, UpdateDevice,updateDeviceStatus];
}

export default useDeleteDevice;
