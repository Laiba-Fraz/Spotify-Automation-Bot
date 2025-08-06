import { Link, useNavigate } from "react-router-dom";
import H24 from "../Headings/H24";
import Input from "../Inputs/Input";
import PLinks from "../Paragraphs/PLinks";
import classes from "./LogIn.module.css";
import BlueButton from "../Buttons/BlueButton";
import Warning from "../Alerts/Warning";
import useLogin from "../Hooks/useLogin";
import MyForm from "../Form/MyForm";
import DisabledButton from "../Buttons/DisabledButton";
import { useEffect } from "react";
import usecheckLogin from "../Hooks/usecheckLogin";

function LogIn() {
  const navigate = useNavigate();
  const checkLogin = usecheckLogin();
  const [Login, loading, error, setError] = useLogin();
  useEffect(() => {
    checkLogin();
  }, []);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const email = event.target[0].value.trim();
    const password = event.target[1].value.trim();
    if (email === "" || password === "") {
      setError("Please enter valid email and password");
      return;
    }
    try {
      await Login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className={classes.Login}>
      <div className={classes.LoginMain}>
        <H24>Welcome back to Appilot console</H24>
        {error && <Warning error={error} />} {/* Display warning if error */}
        <MyForm method="post" formSubmittHandler={formSubmitHandler}>
          <label htmlFor="Email">Email</label>
          <Input type="email" placeholder="Email" name="Email" />
          <label htmlFor="password" className={classes.passwordlable}>
            Password <Link to="/forgot-password">Forgot your password?</Link>
          </label>
          <Input type="password" placeholder="Password" name="password" />
          {loading ? (
            <DisabledButton>loging...</DisabledButton>
          ) : (
            <BlueButton type="submit">Log in</BlueButton>
          )}
        </MyForm>
        <PLinks>
          New to Appilot? <Link to="/sign-up">Sign up</Link>
        </PLinks>
      </div>
    </section>
  );
}

export default LogIn;
