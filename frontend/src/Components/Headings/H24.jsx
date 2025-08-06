import classes from "./H24.module.css";
function H24(props) {
  return (
  <h1 className={classes.heading}>{props.children}</h1>
  )
}

export default H24