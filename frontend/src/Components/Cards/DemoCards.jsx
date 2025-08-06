import classes from "./DemoCards.module.css";

function DemoCards(props) {
  return (
    <div className={classes.card}>
      <p>{props.children}</p>
      {props.linkContent && (
        <a href={props.link} target="_blank" className={classes.link}>
          {props.linkContent}
        </a>
      )}
    </div>
  );
}

export default DemoCards;
