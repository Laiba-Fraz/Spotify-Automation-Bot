import { useState } from "react";

function useSaveDevice() {
  const [loading, setloading] = useState(null);

  const saveDevice = async (devices, id) => {
    try {
      const value = `${document.cookie}`;
        const response = await fetch("https://server.appilot.app/save-device", {
    //   const response = await fetch("http://127.0.0.1:8000/save-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ devices, id }),
      });
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return [saveDevice, loading];
}

export default useSaveDevice;
