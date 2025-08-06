import classes from "./H20.module.css";

function H20(props) {
  return <h2 className={classes.heading}>{props.children}</h2>;
}

export default H20;
