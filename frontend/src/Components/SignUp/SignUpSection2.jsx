import { Link } from "react-router-dom";
import Mail from "./../../assets/Icons/Mail";
import GreyButton from "../Buttons/GreyButton";
import H24 from "../Headings/H24";
import P14G from "../Paragraphs/P14G";
import PLinks from "../Paragraphs/PLinks";
import MyForm from "./../Form/MyForm";
import Input from "../Inputs/Input";
import BlueButton from "../Buttons/BlueButton";
import classes from "./SignUpSection2.module.css";
import UseSignup from "../Hooks/UseSignup";
import Warning from "../Alerts/Warning";
import { useState, useEffect, useRef } from "react";
import DisabledButton from "./../Buttons/DisabledButton";
import Overlay from "../Overlay/Overlay";
import Loading from "../Alerts/Loading";
import ButtonLink from "./../Buttons/ButtonLink";
import { successToast } from "../../Utils/utils";

function SignUpSection2() {
  const [devicesToAutomate, setDevicesToAutomate] = useState(0);
  const [localError, setlocalError] = useState(null);
  const [data, setData] = useState({});
  const [resending, setresending] = useState(false);
  const [resendSuccess, setresendSuccess] = useState(false);
  const [signUp, error, loading, success, setSuccess] = UseSignup();
  const DiscordUsername = useRef("");

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(event)
    // let DiscordUsername = event.target[0].value.trim();
    let discordUsername = DiscordUsername.current.value.trim();
    DiscordUsername.current.value = "";
    discordUsername = discordUsername === "" ? "none" : discordUsername;
    const email = event.target[0].value.trim();
    const password = event.target[1].value.trim();
    console.log(discordUsername,email,password)
    try {
      if (email && password) {
        console.log("email && password is correct");
        setData({
          devicesToAutomate,
          discordUsername,
          email,
          password,
        });
        await signUp(devicesToAutomate, discordUsername, email, password);
      } else {
        throw new Error("Please Enter Correct Email and Password");
      }
    } catch (error) {
      console.log(error.message);
      setlocalError(error.message);
    }
  };
  const resentVerificationEmail = async () => {
    try {
      setresending(true);
      await signUp(
        data.devicesToAutomate,
        data.discordUsername,
        data.email,
        data.password
      );
      setresending(false);
      successToast("Resent Email, Please check")
    } catch (error) {
      console.log(error.message);
    }
  };

  const reSignup = () => {
    setData(null);
    setSuccess(null);
  };
  return (
    <div
      className={`${classes.SignUpSection2} ${success && classes.alignceneter}`}
    >
      {success ? (
        <div className={classes.confirmMailmain}>
          <Mail />
          <H24>Please check your email</H24>
          <P14G>Confirm your email address to get started with Appilot.</P14G>
          <P14G>
            We've sent a confirmation link to <strong>{data.email}</strong> If
            you do not receive anything right away, please check your spam
            folder or contact our support.
          </P14G>
          <GreyButton handler={resentVerificationEmail}>
            Resent verification email
          </GreyButton>
          {/* <button onClick={reSignup}>incorrect email?</button> */}
          <P14G>
            incorrect email? <ButtonLink handler={reSignup}>sign up</ButtonLink>
          </P14G>
        </div>
      ) : (
        <div className={classes.main}>
          <H24>Create your account</H24>
          {/* <p className={classes.optionalTag}>optional</p> */}
          <GreyButton>
            how many device you want to automate? (optional)
            <input
              type="number"
              name="Devices"
              min="0"
              max="50"
              value={devicesToAutomate}
              onChange={(e) => setDevicesToAutomate(e.target.value)}
            />
          </GreyButton>
          {(error || localError) && <Warning error={error || localError} />}
          <label htmlFor="Username">
              Discord Username{" "}
              <PLinks>
                Join our Discord{" "}
                <a href="https://discord.gg/3CZ5muJdF2" target="_blank">
                  server
                </a>
              </PLinks>
            </label>
            <input
              type="text"
              name="discordusername"
              placeholder="(optional)"
              ref={DiscordUsername}
            />
          <MyForm formSubmittHandler={formSubmitHandler}>
            {/* <label htmlFor="Username">
              Discord Username{" "}
              <PLinks>
                Join our Discord{" "}
                <a href="https://discord.gg/3CZ5muJdF2" target="_blank">
                  server
                </a>
              </PLinks>
            </label>
            <input
              type="text"
              name="discordusername"
              placeholder="(optional)"
              ref={inputRef}
            /> */}
            <label htmlFor="email">
              Email<span>*</span>
            </label>
            <Input type={"email"} placeholder={"Email"} name={"email"} />
            <label htmlFor="password">
              Password<span>*</span>
            </label>
            <Input
              type={"password"}
              placeholder={"Password"}
              name={"password"}
            />
            {/* <button type="submit">Submit</button> */}
            {loading ? (
              <DisabledButton>Sign up...</DisabledButton>
            ) : (
              <BlueButton type={"submit"}>Sign up</BlueButton>
            )}
          </MyForm>
          <PLinks>
            By signing up, you agree to Appilot's{" "}
            <Link
              to={
                "https://appilot.gitbook.io/appilot-docs/legal-information/privacy-policy"
              }
              target="_blank"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              to={
                "https://appilot.gitbook.io/appilot-docs/legal-information/terms-and-conditions"
              }
              target="_blank"
            >
              Terms & Conditions
            </Link>
            .
          </PLinks>
          <PLinks>
            Already have an account? <Link to={"/log-in"}>Log in</Link>
          </PLinks>
        </div>
      )}
      <Overlay>
        {resending && loading && <Loading>Resending verification mail</Loading>}
      </Overlay>
      {/* <Overlay>
        {resendSuccess && <GreenAlert message={"Resent Email, Please check"} />}
      </Overlay> */}
    </div>
  );
}

export default SignUpSection2;
