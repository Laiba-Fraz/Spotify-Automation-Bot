import { useState } from "react";
import classes from "./SchedulesInput.module.css";

function SchedulesInput(props) {
  const [required, setRequired] = useState(false);
  const [Show, setShow] = useState(false);

  const Inputhandler = (event) => {
    const inputValue = event.target.value;

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

  const blurHandler = (event) => {
    const inputValue = event.target.value;
    props.blurHandler(inputValue);
  };

  return (
    <>
      {props.label && <label className={classes.label}>{props.label}</label>}
      <div className={required ? classes.RedInput : classes.Input}>
        <input
          type={props.type}
          placeholder={props.placeholder}
          name={props.name}
          onChange={Inputhandler}
          onBlur={blurHandler}
          value={props.value || ""}  
          min={"0"}
          required
        />
      </div>
      {required && <p className={classes.warning}>{props.name} is required</p>}
    </>
  );
}

export default SchedulesInput;
