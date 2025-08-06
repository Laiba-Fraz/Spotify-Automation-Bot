import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const Login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://server.appilot.app/login", {
      // const response = await fetch('http://127.0.0.1:8000/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        // credentials: "include"
      });
      const res = await response.json();
      if (!response.ok) {
        console.log("res");
        throw new Error(res.message || "Failed to log in");
      }
      console.log(res);
      // document.cookie = `access_token=Bearer ${res.access_token}; path=/; secure=true; samesite=None`;
      // In your Login function, replace the cookie line with:
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      document.cookie = `access_token=Bearer ${res.access_token}; path=/; secure=true; samesite=None; expires=${expirationDate.toUTCString()}`;
      localStorage.setItem(
        "auth",
        JSON.stringify({ id: res.id, email: res.email })
      );
      dispatch({ type: "login", payload: { id: res.id, email: res.email } });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw new Error("invalid email or password");
    }
  };

  return [Login, loading, error, setError];
}

export default useLogin;
