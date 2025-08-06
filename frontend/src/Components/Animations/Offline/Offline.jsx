import classes from "./Offline.module.css";

function Offline() {
  return (
    <div className={classes.container}>
      <div className={classes.onlineindicator}>
        <span className={classes.blink}></span>
      </div>
      <h2 className={classes.onlinetext}>Inactive</h2>
    </div>
  );
}

export default Offline;
