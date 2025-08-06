import Header from "../Header/Header";
import classes from "./ConfirmEmail.module.css";
import Mail from "./../../assets/Icons/Mail";
import H24 from "../Headings/H24";
import P14G from "../Paragraphs/P14G";
import PLinks from "../Paragraphs/PLinks";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../assets/Spinner/Spinner";
import usecheckLogin from "../Hooks/usecheckLogin";

function ConfirmEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const checkLogin = usecheckLogin()

  useEffect(()=>{
    checkLogin()
  },[])

  useEffect(() => {
    async function verifyToken() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://server.appilot.app/confirm-email/?token=${token}`,
          // `http://127.0.0.1:8000/confirm-email/?token=${token}`,
          {
            method: "GET",
          }
        );

        const res = await response.json();

        if (!response.ok) {
          setError(res.message || "Failed to verify email.");
          setLoading(false);
          return;
        }

        setSuccess(res.message);
        setLoading(false);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        setError("Something went wrong. Please try again later.");
        setLoading(false);
      }
    }

    verifyToken();
  }, [token]); 

  return (
    <section className={classes.ConfirmEmail}>
      <Header />
      <div className={classes.main}>
        <Mail />
        {loading && (
          <div className={classes.Loading}>
            <H24>Email verification</H24>
            <P14G>Confirming your email </P14G>
            <Spinner />
          </div>
        )}
        {error && (
          <div className={classes.error}>
            <H24>Email verification Failed :(</H24>
            <P14G>{error}</P14G>
            <PLinks>
              Please try <Link to={"/sign-up"}>Sign up</Link> again.
            </PLinks>
          </div>
        )}
        {success && (
          <div className={classes.success}>
            <H24>Congratulations</H24>
            <P14G>{success}</P14G>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConfirmEmail;
