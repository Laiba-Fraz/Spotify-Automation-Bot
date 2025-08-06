import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw Error("useAuthContext must be used inside an Auth provider");
  }
  return ctx;
}
