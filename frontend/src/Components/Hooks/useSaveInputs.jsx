import { useState } from "react";

function useSaveInputs() {
  const [loading, setloading] = useState(null);

  const saveInputs = async (inputs, id) => {
    try {
      const value = `${document.cookie}`;
        const response = await fetch("https://server.appilot.app/save-inputs", {
    //   const response = await fetch("http://127.0.0.1:8000/save-inputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
        body: JSON.stringify({ inputs, id }),
      });
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.message);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return [saveInputs, loading];
}

export default useSaveInputs;
