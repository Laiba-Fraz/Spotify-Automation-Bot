import classes from "./TransparentButton.module.css";

function TransparentButton(props) {
  return (
    <button
      className={classes.button}
      onClick={props.handler ? props.handler : undefined}
      type={props.type}
    >
      {props.children}
    </button>
  );
}

export default TransparentButton;
