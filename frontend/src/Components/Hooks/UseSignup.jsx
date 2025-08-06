import { useState } from "react";

function UseSignup() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(null);

  const signUp = async (
    devicesToAutomate,
    DiscordUsername,
    email,
    password
  ) => {
    try {
      if (!email || !password) {
        throw new Error("Email or Password is Invalid");
      }
      setLoading(true);
      setError(null);

      const data = JSON.stringify({
        devicesToAutomate,
        DiscordUsername,
        email,
        password,
      });

      const response = await fetch("https://server.appilot.app/signup", {
      // const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Something went wrong, Please Try again"
        );
      }

      const res = await response.json();
      setSuccess(res.message);
    } catch (err) {
      setSuccess(null);
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return [signUp, error, loading, success, setSuccess];
}

export default UseSignup;
