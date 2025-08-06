import { useState } from "react";

function useResetPassword() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const Reset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await fetch("https://server.appilot.app/reset-password", {
        // const response = await fetch('http://127.0.0.1:8000/reset-password',{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resestConfirm = async (password, token) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await fetch(
        `https://server.appilot.app/update-password/?token=${token}`,
        // `http://127.0.0.1:8000/update-password/?token=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return [Reset, resestConfirm, loading, error, success, setSuccess, setError];
}

export default useResetPassword;
