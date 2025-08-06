import classes from "./H28.module.css";

function H28(props) {
  return <h1 className={classes.heading}>{props.children}</h1>;
}

export default H28;
