import { useState, useEffect } from "react";
import classes from "./Faqs.module.css";
import Questions from "./QuestionsTable/Questions";
import QATable from "./QATable/QATable";
import { useNavigate, useParams } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { failToast } from "../../../Utils/utils";

function Faqs() {
  const [show, setShow] = useState(false);
  const [QA, setQA] = useState({
    question: "",
    answer: [],
  });
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [faqs, setfaqs] = useState([]);
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
        // const response = await fetch(
          // `http://127.0.0.1:8000/get-bot?name=${name}&fields=faqs`,
          // {
            const response = await fetch(`https://server.appilot.app/get-bot?name=${name}&fields=faqs`,{
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
            console.log("inside 401 in faqs");
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
        setfaqs(res.data.faqs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);

  const showIssueHandler = (data) => {
    setShow(!show);
    setQA(data);
  };
  return (
    <div className={classes.faqsMain}>
      {!show && (
        <Questions
          showAndHideIssueHandler={showIssueHandler}
          list={faqs}
          isLoading={loading}
        />
      )}
      {show && <QATable data={QA} hideIssueHandler={showIssueHandler} />}
    </div>
  );
}

export default Faqs;
