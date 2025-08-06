import classes from "./PLinks.module.css";

function PLinks(props) {
  return <p className={classes.paragraph}>{props.children}</p>;
}

export default PLinks;
