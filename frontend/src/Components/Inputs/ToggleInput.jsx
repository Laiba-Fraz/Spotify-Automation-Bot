import classes from "./ToggleInput.module.css";

function ToggleInput({ el, inputsToggleChangeHandler, index, InnerIndex }) {
  return (
    <div className={classes.toggleContainer}>
      <label className={classes.switch}>
        <input
          type="checkbox"
          checked={el.input}
          onChange={() => {
            inputsToggleChangeHandler(index, InnerIndex);
          }}
        />
        <span className={classes.slider}></span>
      </label>
      <p>{el.name}</p>
    </div>
  );
}

export default ToggleInput;
