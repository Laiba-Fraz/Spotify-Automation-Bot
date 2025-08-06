import { useNavigate, useParams } from "react-router-dom";
import classes from "./Readme.module.css";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { failToast } from "../../../Utils/utils";

function Readme(props) {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [readme, setReadme] = useState("");
  const id = useParams("id");
  const auth = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBots() {
      const name = id.id.trim().replace(/-/g, " ");
      try {
        setLoading(true);
        setError(null);
        const value = `${document.cookie}`;
        // const response = await fetch(`http://127.0.0.1:8000/get-bot?name=${name}&fields=readme`,{
          const response = await fetch(`https://server.appilot.app/get-bot?name=${name}&fields=readme`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                value !== "" ? value.split("access_token=")[1] : "",
            },
          }
        );

        const res = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            console.log("inside 401 in Readme");
            // toast("please logIn again", {
            //   style: {
            //     color: "#ef6045",
            //     backgroundColor: "#40191b",
            //     border: "1px solid #aa3229",
            //     display: "flex",
            //     gap: "16px",
            //   },
            //   duration: 3000,
            //   icon: <TriangleAlert />,
            // });
            failToast("please logIn again");
            auth.dispatch({ type: "logout" });
            localStorage.removeItem("auth");
            navigate("/log-in");
          }
          throw new Error(res.message);
        }
        setReadme(res.data.readme);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);
  // const scrollHandler = () => {
  //   console.log("scrolled");
  // };
  return (
    <div className={classes.readmemain}>
      {loading ? (
        <div className={classes.loading}>
          <div className={classes.content}></div>
          <div className={classes.loadingEffect}></div>
        </div>
      ) : (
        <p>{readme}</p>
      )}
    </div>
  );
}

export default Readme;
