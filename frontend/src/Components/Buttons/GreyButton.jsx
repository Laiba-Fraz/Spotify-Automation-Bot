import classes from "./GreyButton.module.css";

function GreyButton(props) {
  const btnClickHandler = () => {
    if (props.handler) {
      props.handler();
    }
    return;
  };
  return (
    <button
      className={`${classes.button} ${props.error ? classes.required : ""}`}
      onClick={btnClickHandler}
    >
      {props.children}
    </button>
  );
}

export default GreyButton;
