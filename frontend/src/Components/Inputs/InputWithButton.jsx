import { useRef } from "react";
import BlueButton from "../Buttons/BlueButton";
import classes from "./InputWithButton.module.css";

function InputWithButton(props) {
    const val = useRef();

    const buttonClickHandler = ()=>{
        props.handler(val.current.value);
        val.current.value ="";
    }


  return (
    <div className={classes.mainContainer}>
        <p className={classes.label}>{props.lable}</p>
        <div className={classes.InputConatiner}>
        <div className={classes.Input}>
          <input
            type={props.type}
            name={props.name}
            ref={val}
          />
        </div>
        <BlueButton handler={buttonClickHandler}>{props.buttonText}</BlueButton>
        </div>
    </div>
  )
}

export default InputWithButton