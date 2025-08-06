import classes from "./TextRedPurpleEffect.module.css";

function TextRedPurpleEffect(props) {
  return props.link ? (
    <a href={props.link} target="_blank" className={classes.RedpurpleLink}>
      {props.children}
    </a>
  ) : (
    <span className={classes.RedpurpleWord}>{props.children}</span>
  );
}

export default TextRedPurpleEffect;
