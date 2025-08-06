import { useState } from "react";
import classes from "./InputText.module.css";

function InputText(props) {
  const [value, setValue] = useState(props.value || "");

  const Inputhandler = (event) => {
    const inputValue = event.target.value;
      props.handler(inputValue);
      setValue(inputValue);
      return;
  };
  return (
    <div className={props.isTaskInputs? classes.main:classes.main2} >
        {props.label && <label className={classes.label}>{props.label}</label>}
        <div className={classes.Input}>
          <input
            type={props.InputComponent}
            placeholder={props.placeholder}
            name={props.name}
            autoComplete="off"
            onChange={Inputhandler}
            value={value}
            min={"0"}
            required={props.isTaskInputs}
          />
        </div>
        </div>
  )
}

export default InputText