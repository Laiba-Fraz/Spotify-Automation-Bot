import MyForm from "../Form/MyForm";
import H24 from "../Headings/H24";
import P14G from "../Paragraphs/P14G";
import Input from "../Inputs/Input";
import classes from "./ForgotPassword.module.css";
import BlueButton from "../Buttons/BlueButton";
import Mail from "./../../assets/Icons/Mail";
import useResetPassword from "../Hooks/useResetPassword";
import { useState, useEffect } from "react";
import DisabledButton from "../Buttons/DisabledButton";
import Warning from "../Alerts/Warning";
import ButtonLink from "../Buttons/ButtonLink";
import { useNavigate } from "react-router-dom";
import usecheckLogin from "../Hooks/usecheckLogin";

function ForgotPassword() {
  const checkLogin = usecheckLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [Reset, resestConfirm, loading, error, success, setSuccess, setError] =
    useResetPassword();

  useEffect(() => {
    checkLogin();
  }, []);
  const NavigatebacktoReset = () => {
    setSuccess(false);
  };
  const formSubmitHandler = (event) => {
    event.preventDefault();

    const email = event.target[0].value.trim();
    if (email === "") {
      setError("Please enter correct email");
      return;
    }
    setEmail(email);
    Reset(email);
  };

  const NavigatebacktoLogIn = () => {
    navigate("/log-in");
  };
  return (
    <section className={classes.Reset}>
      {!success && (
        <div className={classes.resetMain}>
          <H24>Reset your password</H24>
          {error && <Warning error={error} />}
          <P14G>
            Enter your email and we'll send you instructions on how to reset
            your password.
          </P14G>
          <MyForm method={"post"} formSubmittHandler={formSubmitHandler}>
            <label htmlFor="email">Email</label>
            <Input type={"email"} placeholder={"Email"} name={"Email"} />
            {loading ? (
              <DisabledButton type={"submitt"}>Reseting...</DisabledButton>
            ) : (
              <BlueButton type={"submitt"}>Reset password</BlueButton>
            )}
          </MyForm>
          <ButtonLink handler={NavigatebacktoLogIn}>back to login</ButtonLink>
        </div>
      )}
      {success && (
        <div className={classes.resetMessage}>
          <Mail />
          <H24>Please check your email</H24>
          <P14G>
            We sent instructions to reset your password to{" "}
            <strong>{email}</strong> If you do not receive anything right away,
            please check your spam folder or contact our support.
          </P14G>
          <ButtonLink handler={NavigatebacktoReset}>
            Wrong email address?
          </ButtonLink>
        </div>
      )}
    </section>
  );
}

export default ForgotPassword;
