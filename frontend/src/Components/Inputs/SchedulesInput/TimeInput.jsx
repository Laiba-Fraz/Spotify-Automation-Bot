import classes from "./TimeInput.module.css";

function TimeInput(props) {
  return (
        <div className={classes.inputoutermain}>
          {props.lable && (
            <label className={classes.label}>{props.lable}</label>
          )}
          <div className={classes.Input}>
            <input
              type="time"
              value={props.value}
              onChange={(e) => props.timeChangeHandler(e.target.value)}
              min="00:00"
              max="23:59"
            />
          </div>
        </div>
  );
}

export default TimeInput;
