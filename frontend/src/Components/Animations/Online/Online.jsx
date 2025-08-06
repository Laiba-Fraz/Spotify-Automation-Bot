import classes from "./Online.module.css";

function Online() {
  return (
    <div className={classes.container}>
      <div className={classes.onlineindicator}>
        <span className={classes.blink}></span>
      </div>
      <h2 className={classes.onlinetext}>active</h2>
    </div>
  );
}

export default Online;
