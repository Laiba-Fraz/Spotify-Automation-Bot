import classes from "./P14G.module.css";

function P14G(props) {
  return <p className={classes.paragraphs}>{props.children}</p>;
}

export default P14G;
