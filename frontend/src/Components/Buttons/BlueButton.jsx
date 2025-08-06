import classes from "./BlueButton.module.css";

function BlueButton(props) {
  return (
    <button
      className={classes.button}
      type={props.type}
      onClick={props.handler ? props.handler : undefined}
    >
      {props.children}
    </button>
  );
}

export default BlueButton;
