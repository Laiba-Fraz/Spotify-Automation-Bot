import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { failToast } from "../../Utils/utils";

function usecheckLogin() {
  const ctx = useAuthContext();
  const navigate = useNavigate();
  const checkLogin = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (
      auth &&
      auth.id &&
      auth.email &&
      auth.id.trim() !== "" &&
      auth.email.trim() !== ""
    ) {
      failToast("Already logged in");
      navigate("/");
    } else {
      document.cookie = "access_token=; Max-Age=0; path=/;";
      localStorage.removeItem("auth");
      ctx.dispatch({ type: "logout" });
    }
  };
  return checkLogin;
}

export default usecheckLogin;
