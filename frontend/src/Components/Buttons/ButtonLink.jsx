import classes from "./ButtonLink.module.css";

function ButtonLink(props) {
  return (
    <button onClick={props.handler} className={classes.btnLink}>
      {props.children}
    </button>
  );
}

export default ButtonLink;
