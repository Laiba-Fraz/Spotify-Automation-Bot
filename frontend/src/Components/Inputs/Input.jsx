import { useState } from "react";
import classes from "./Input.module.css";
import Eyeshow from "./../../assets/Icons/Eyeshow";
import Eyehide from "./../../assets/Icons/Eyehide";
import PLinks from "../Paragraphs/PLinks";

function Input(props) {
  const [required, setRequired] = useState(false);
  const [Show, setShow] = useState(false);
  const [value, setValue] = useState(props.value || "");

  const Inputhandler = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    if (props.notrequired) {
      props.handler(inputValue);
      return;
    }
    if (inputValue.length === 0) {
      setRequired(true);
    } else {
      setRequired(false);
    }

    if (props.handler) {
      props.handler(inputValue);
    }
  };

  const blurHandler = (event)=>{
    const inputValue = event.target.value;
    props.blurHandler(inputValue)
  }

  const PasswordShowHandler = () => {
    setShow(!Show);
  };

  if (props.type === "password") {
    return (
      <>
        <div className={required ? classes.RedInput : classes.Input}>
          <input
            type={Show ? "text" : props.type}
            placeholder={props.placeholder}
            name={props.name}
            // autoComplete="off"
            onChange={Inputhandler}
            value={value}
            required
          />
          {Show ? (
            <Eyeshow PasswordShowHandler={PasswordShowHandler} />
          ) : (
            <Eyehide PasswordShowHandler={PasswordShowHandler} />
          )}
        </div>
        {required && (
          <p className={classes.warning}>{props.name} is required</p>
        )}
      </>
    );
  } else {
    return (
      <>
      <div>
        {props.label && <label className={classes.label}>{props.label}</label>}
        <div className={required ? classes.RedInput : classes.Input}>
          <input
            type={props.InputComponent}
            placeholder={props.placeholder}
            name={props.name}
            // autoComplete="off"
            onChange={Inputhandler}
            onBlur={blurHandler}
            value={value}
            min={"0"}
            required
          />
          {props.bottomLink && (
            <PLinks>
              {props.bottomLink.text}{" "}
              <a href={props.bottomLink.link.link}>
                {props.bottomLink.link.name}
              </a>
            </PLinks>
          )}
        </div>
        {required && (
          <p className={classes.warning}>{props.name} is required</p>
        )}
        </div>
      </>
    );
  }
}

export default Input;
