import classes from "./Steps.module.css";
import H20 from "./../Headings/H20";
import { Link, useNavigate } from "react-router-dom";
import TextBluePurpleEffect from "./../TextEffects/TextBluePurpleEffect";
import P16 from "../Paragraphs/P16";
import Appilot from "./../../assets/logo/Logo.png";
import BlueButton from "../Buttons/BlueButton";

function Steps(props) {
  const navigate = useNavigate();

  const navigationHandler = () => {
    if (props.deviceSelected) {
      navigate("/devices");
    } else {
      navigate("/store");
    }
  };

  return (
    <div className={classes.StepsMain}>
      <div className={classes.heading}>
        <H20>
          <TextBluePurpleEffect>{props.content.id}</TextBluePurpleEffect>
          {props.content.heading}
        </H20>
      </div>
      <div className={classes.content}>
        <div className={classes.descriptionContainer}>
          <div>
            <P16
              dangerouslySetInnerHTML={{ __html: props.content.description }}
            />

            <Link to={""}>
              <img src={Appilot} alt="" /> Appilot Console
            </Link>
          </div>
          {props.content.FinishBtn && (
            <BlueButton handler={navigationHandler}>Finish</BlueButton>
          )}
        </div>
        <div className={classes.imgVideoContainer}>
          {props.content.imgRoute && (
            <img src={props.content.imgRoute} alt="" />
          )}
          {props.content.iframeURL && (
            <iframe
              src={props.content.iframeURL}
              frameborder="0"
              allow="fullscreen"
            >
              {props.content.iframeURL}
            </iframe>
          )}
        </div>
      </div>
    </div>
  );
}

export default Steps;
