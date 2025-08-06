import classes from "./TextBluePurpleEffect.module.css";

function TextBluePurpleEffect(props) {
  return props.link ? (
    <a href={props.link} className={classes.bluepurpleLink}>
      {props.children}
    </a>
  ) : (
    <span className={classes.bluepurpleWord}>{props.children}</span>
  );
}

export default TextBluePurpleEffect;
