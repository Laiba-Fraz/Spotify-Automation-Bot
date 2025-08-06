import { useEffect } from "react";
import classes from "./SignUp.module.css";
import SignUpSection1 from "./SignUpSection1";
import SignUpSection2 from "./SignUpSection2";
import { useAuthContext } from "../Hooks/useAuthContext";
import usecheckLogin from "../Hooks/usecheckLogin";

function SignUp() {
  const checkLogin = usecheckLogin();
  const ctx = useAuthContext();
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <section className={classes.App}>
      <SignUpSection1 />
      <SignUpSection2 />
    </section>
  );
}

export default SignUp;
