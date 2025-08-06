import ReactDOM from "react-dom";
import classes from "./CompleteOverlay.module.css";

function CompleteOverlay(props) {
  const overlayContent = (
    <div className={classes.main}>{props.children}</div>
  );
  return ReactDOM.createPortal(
    overlayContent,
    document.getElementById("overlay-root")
  );
}

export default CompleteOverlay;
