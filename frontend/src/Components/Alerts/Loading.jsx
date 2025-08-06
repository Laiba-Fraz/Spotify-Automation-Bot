import classes from "./Loading.module.css";
import Spinner from "./../../assets/Spinner/Spinner";
import { useState } from "react";
import H18 from "../Headings/H18";

function Loading(props) {
  const [show, setShow] = useState(true);
  const showHandler = () => {
    setShow(true);
  };
  return (
    show && (
      <div className={classes.main}>
        <Spinner />
        <H18>{props.children}</H18>
      </div>
    )
  );
}

export default Loading;
