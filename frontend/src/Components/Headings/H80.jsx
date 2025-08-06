import classes from "./H80.module.css";

function H80(props) {
  return <h1 className={classes.herobannerHeading}>{props.children}</h1>;
}

export default H80;
