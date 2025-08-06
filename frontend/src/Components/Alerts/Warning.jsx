import classes from "./Warning.module.css";
import Cut from "../../assets/Icons/Cut";
import WarningIcon from "./../../assets/Icons/Warning";
import P14G from "../Paragraphs/P14G";
import { useState } from "react";
function Warning(props) {
  const [show, setShow] = useState(true);
  const showHandler = () => {
    setShow(!show);
  };
  return (
    show && (
      <div className={classes.main}>
        <div className={classes.contentCont}>
          <WarningIcon />
          <P14G>{props.error}</P14G>
        </div>
        <Cut showHandler={showHandler} />
      </div>
    )
  );
}

export default Warning;
