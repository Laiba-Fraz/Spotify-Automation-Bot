import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Alerts/Loading";
import BlueButton from "../Buttons/BlueButton";
import MyForm from "../Form/MyForm";
import H24 from "../Headings/H24";
import useResetPassword from "../Hooks/useResetPassword";
import Input from "../Inputs/Input";
import classes from "./ResetPassword.module.css";
import Warning from "../Alerts/Warning";
import DisabledButton from "../Buttons/DisabledButton";
import usecheckLogin from "../Hooks/usecheckLogin";
import { useEffect } from "react";
import { failToast, successToast } from "../../Utils/utils";

function ResetPassword() {
  const checkLogin = usecheckLogin();
  const { token } = useParams("token");
  const navigate = useNavigate();
  const [Reset, resestConfirm, loading, error, success, setSuccess, setError] =
    useResetPassword();

  useEffect(() => {
    checkLogin();
  }, []);
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const password = event.target[0].value.trim();
    if (password === "") {
      setError("Please Enter correct password");
      return;
    }
    try {
      await resestConfirm(password, token);
      successToast("Password reset successfully")
      navigate("/log-in");
    } catch (error) {
      failToast(error.message)
      console.log(error.message);
    }
  };
  return (
    <section className={classes.ResetPassword}>
      {loading && (
        <Loading>
          <p>Reseting your password</p>
        </Loading>
      )}
      <div className={classes.resetmain}>
        <H24>Create new password</H24>
        {/* {error && <Warning error={error} />} */}
        <MyForm formSubmittHandler={formSubmitHandler}>
          <label htmlFor="password">Password</label>
          <Input type={"password"} placeholder={"Password"} name={"password"} />
          {loading ? (
            <DisabledButton>Reseting...</DisabledButton>
          ) : (
            <BlueButton type={"submitt"}>Reset password</BlueButton>
          )}
        </MyForm>
      </div>
    </section>
  );
}

export default ResetPassword;
