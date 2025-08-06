import ReactDOM from "react-dom";
import classes from "./Overlay.module.css"; 

const Overlay = (props) => {
  const overlayContent = (
    <div className={classes.backdrop} >
        {props.children} 
    </div>
  );

  return ReactDOM.createPortal(overlayContent, document.getElementById("overlay-root"));
};

export default Overlay;
