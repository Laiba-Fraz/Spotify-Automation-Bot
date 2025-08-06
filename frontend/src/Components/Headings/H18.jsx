import classes from "./H18.module.css";

function H18(props) {
  return <h1 className={classes.headings}>{props.children}</h1>;
}

export default H18;
