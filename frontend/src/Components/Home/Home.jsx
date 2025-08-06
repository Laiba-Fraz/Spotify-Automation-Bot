import { useEffect } from "react";
import classes from "./Home.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import CompleteOverlay from "../Overlay/CompleteOverlay";
import { AddToPhoneOverlay } from "../context/AddToPhone";
import { useContext } from "react";
import AddToPhoneStep from "../Getstarted/AddToPhoneStep";

function Home() {
  const Auth = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const addToPhoneCtx = useContext(AddToPhoneOverlay);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (
      auth &&
      auth.id &&
      auth.email &&
      auth.id.trim() !== "" &&
      auth.email.trim() !== ""
    ) {
      if (location.pathname === "/") {
        navigate("/store");
      }
    } else {
      localStorage.removeItem("auth");
      Auth.dispatch({ type: "logout" });
      navigate("/log-in");
    }
    
  }, [location.pathname, navigate]);

  return (
    <main className={classes.Home}>
      <Outlet />
      {addToPhoneCtx.overlayState && (
        <CompleteOverlay>
          <AddToPhoneStep/>
        </CompleteOverlay>
      )}
    </main>
  );
}

export default Home;
