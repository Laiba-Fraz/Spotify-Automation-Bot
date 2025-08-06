import classes from "./KeywordsTags.module.css";

function KeywordsTags(props) {
  return (
    <div className={classes.keysContainer}>
      {props.keys.map((el) => {
        return <span className={classes.keywords}>{el}</span>;
      })}
    </div>
  );
}

export default KeywordsTags;
