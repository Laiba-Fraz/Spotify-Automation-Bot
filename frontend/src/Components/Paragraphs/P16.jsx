import classes from "./P16.module.css";

function P16(props) {
  if (props.dangerouslySetInnerHTML) {
    return (
      <p
        className={classes.Paragraph}
        dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
      />
    );
  }

  return <p className={classes.Paragraph}>{props.children}</p>;
}

export default P16;
