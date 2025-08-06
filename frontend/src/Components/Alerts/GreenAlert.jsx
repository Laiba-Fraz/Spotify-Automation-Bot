import Cut from "../../assets/Icons/Cut";
import P14G from "../Paragraphs/P14G";
import classes from "./GreenAlert.module.css";
import { useState } from "react";
import { CircleCheck  } from 'lucide-react';

function GreenAlert(props) {
  const [show, setShow] = useState(true);
  const showHandler = () => {
    setShow(!show);
  };
  return (
    show && (
      <div className={classes.main}>
        <div className={classes.contentCont}>
        <CircleCheck/>
        <P14G>{props.message}</P14G>
        </div>
         <Cut showHandler={showHandler} />
      </div>
    )
  );
}

export default GreenAlert;
