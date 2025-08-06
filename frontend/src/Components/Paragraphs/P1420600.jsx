import classes from "./P1420600.module.css";

function P1420600(props) {
  return <p className={classes.paragraph}>{props.children}</p>;
}

export default P1420600;
