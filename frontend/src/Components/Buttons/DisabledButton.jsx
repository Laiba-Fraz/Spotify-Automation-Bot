import classes from "./DisabledButton.module.css";

function DisabledButton(props) {

  const handler = ()=>{
    props.handler()
  }
  return (
    <button type="button" className={classes.DisabledButton} onClick={handler}>
      {props.children}
    </button>
  );
}

export default DisabledButton;
