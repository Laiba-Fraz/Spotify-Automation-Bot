import BlueButton from "../../Buttons/BlueButton";
import H24 from "../../Headings/H24";
import classes from "./HeaderHB.module.css";
import QuestionMarkwithCircle from "./../../../assets/Icons/QuestionMarkwithCircle";
import { useEffect, useState } from "react";

function HeaderHB(props) {
  const [show, setShow] = useState(false);

  const showInfoHandler = () => {
    setShow((prevShow) => !prevShow); 
  };

  useEffect(() => {
    const tooltipdiv = document.getElementById("infotooltip");
    const infoIcon = document.getElementById("infoIcon");

    function tooltiphandler(event) {
      if (
        (tooltipdiv && tooltipdiv.contains(event.target)) || 
        (infoIcon && infoIcon.contains(event.target))
      ) {
        return; 
      }

      setShow(false); 
    }

    window.addEventListener("mousedown", tooltiphandler);

    return () => {
      window.removeEventListener("mousedown", tooltiphandler);
    };
  }, [show]);

  return (
    <div className={classes.main}>
      <H24>
        {props.infoText ? (
          <>
            {props.heading}
            <div className={classes.iconContainer} id="infoIcon">
              <QuestionMarkwithCircle handler={showInfoHandler} />
              {show && (
                <div className={classes.Info} id="infotooltip">
                  <p>{props.infoText}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          props.heading
        )}
      </H24>
      <BlueButton handler={props.btnClickHandler}>
        {props.btnIcon ? (
          <>
            {props.btnIcon? props.btnIcon:""}
            {props.btnText}
          </>
        ) : (
          props.btnText
        )}
      </BlueButton>
    </div>
  );
}

export default HeaderHB;
