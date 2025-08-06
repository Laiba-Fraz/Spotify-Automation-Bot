import classes from "./GreenBtn.module.css";

function GreenBtn(props) {
  return (
    <button className={classes.GreenBtn} onClick={(e)=>{props.handler(e)}}>
      {props.icon ? props.icon : ""}
      {props.children}
    </button>
  );
}

export default GreenBtn;
