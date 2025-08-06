import P14G from "../Paragraphs/P14G";
import H28 from "./../Headings/H28";
import classes from "./SimplehHeader.module.css";

function SimplehHeader(props) {
  return (
    <header className={classes.header}>
      <div className={classes.content}>
        <H28>{props.content}</H28>
        <P14G>{props.subHeading}</P14G>
      </div>
    </header>
  );
}

export default SimplehHeader;
