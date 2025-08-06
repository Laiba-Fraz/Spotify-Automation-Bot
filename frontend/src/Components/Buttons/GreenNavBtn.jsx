import classes from "./GreenNavBtn.module.css";

function GreenNavBtn(props) {
  return (
    <button className={classes.Btn}>
        {props.icon}
        <span>{props.children}</span>
    </button>
  )
}

export default GreenNavBtn