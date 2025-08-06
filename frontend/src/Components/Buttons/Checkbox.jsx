import { useState, useEffect } from "react";
import classes from "./Checkbox.module.css";

function Checkbox({ handler, isChecked }) {
  const [check, setCheck] = useState(false);

  const checkhandler = () => {
    setCheck((prev) => !prev);
    handler(!check); 
  };

  useEffect(() => {
    setCheck(isChecked);
  }, [isChecked]);

  return (
    <label className={classes.rectCheckbox}>
      <input
        type="checkbox"
        checked={check}
        onChange={checkhandler}
      />
      <span className={classes.checkmark}></span>
    </label>
  );
}

export default Checkbox;
