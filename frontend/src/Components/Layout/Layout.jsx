import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import TopBanner from "../TopBanner/TopBanner";
import { useEffect, useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import SideBar from "../SideBar/SideBar";
import { Toaster } from "sonner";

function Layout() {
  const [show, setShow] = useState(true);
  const Auth = useAuthContext();

  const topBannerHandler = () => {
    setShow(false);
  };


  useEffect(() => {
    try {
      // Retrieve and parse the 'auth' object from localStorage
      const storedAuth = localStorage.getItem("auth");
      const auth =  storedAuth ? JSON.parse(storedAuth) : {};
      console.log(auth)
      // Check if 'auth' is an object and has 'id' and 'email' properties
      if (auth && auth.id && auth.email) {
        console.log("already login")
        Auth.dispatch({
          type: "login",
          payload: { id: auth.id, email: auth.email },
        });
      } else {
        console.log("Loged out")
        // If 'auth' is invalid, clear the token and log out
        document.cookie = "access_token=; path=/;";
        Auth.dispatch({ type: "logout" });
        console.warn('Logging out due to missing or invalid auth:', auth);
        localStorage.removeItem("auth");
      }
    } catch (error) {
      console.error("Failed to parse 'auth' from localStorage:", error);
      // If parsing fails, clear the token and log out
      document.cookie = "access_token=; Max-Age=0; path=/;";
      Auth.dispatch({ type: "logout" });
      localStorage.removeItem("auth");
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" unstyled={true} visibleToasts="1"/>
      
      {/* Show TopBanner and Header only if the user is not logged in */}
      {!Auth.data.user && !Auth.data.email && (
        <>
          {show && <TopBanner topBannerHandler={topBannerHandler} />}
          <Header />
        </>
      )}

      {/* Show the Sidebar only if the user is logged in */}
      {Auth.data.user && Auth.data.email && <SideBar />}

      {/* Render the child components */}
      <Outlet />
    </>
  );
}

export default Layout;
