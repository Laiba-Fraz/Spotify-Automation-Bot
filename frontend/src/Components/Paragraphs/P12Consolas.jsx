import classes from "./P12Consolas.module.css";

function P12Consolas(props) {
  return <p className={classes.paragraph}>{props.children}</p>;
}

export default P12Consolas;
