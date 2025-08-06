import { useNavigate, useParams } from "react-router-dom";
import classes from "./Features.module.css";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { failToast } from "../../../Utils/utils";

function Features() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [features, setfeatures] = useState([]);
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
        // const response = await fetch(`http://127.0.0.1:8000/get-bot?name=${name}&fields=feature`,{
          const response = await fetch(`https://server.appilot.app/get-bot?name=${name}&fields=feature`,{
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
            console.log("inside 401 in features");
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
            failToast("please logIn again")
            auth.dispatch({ type: "logout" });
            localStorage.removeItem("auth");
            navigate("/log-in");
          }
          throw new Error(res.message);
        }
        setfeatures(res.data.feature);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);
  const scrollHandler = () => {
    console.log("scrolled");
  };

  return (
    <div className={classes.featuresmain}>
      {features.map((el) => {
        return (
          <div className={classes.feature}>
            <h2 className={classes.heading}>
              {el.heading}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
                viewBox="0 0 16 16"
                stroke="#1672eb"
                onClick={scrollHandler}
              >
                <path
                  fill="currentColor"
                  d="M9.638 6.014a.75.75 0 1 1-.996 1.122A2.67 2.67 0 0 0 5.13 7.11l-.15.139-1.712 1.709a2.67 2.67 0 0 0 3.616 3.92l.155-.14.708-.708a.75.75 0 0 1 1.133.976l-.072.084-.713.713a4.17 4.17 0 0 1-6.053-5.729l.161-.173L3.92 6.188a4.17 4.17 0 0 1 5.719-.174M10.848 1a4.17 4.17 0 0 1 3.111 6.926l-.16.173-1.718 1.717a4.17 4.17 0 0 1-5.72.17.75.75 0 0 1 .997-1.122 2.67 2.67 0 0 0 3.513.03l.149-.138 1.713-1.714a2.67 2.67 0 0 0-3.616-3.92l-.155.14-.708.709a.75.75 0 0 1-1.133-.977l.072-.084.713-.713A4.17 4.17 0 0 1 10.847 1"
                ></path>
              </svg>
            </h2>
            <p className={classes.description}>{el.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Features;
