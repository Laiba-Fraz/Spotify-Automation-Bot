import React from "react";
import classes from "./Schedule.module.css";

const NumberInput = ({Value, onChange, description, min = 0, max, lable }) => {
  const handleInputChange = (value) => {
    let numericValue = parseInt(value) || 0;

    // Enforce min and max constraints
    if (numericValue < min) {
      numericValue = min;
    }
    if (max !== undefined && numericValue > max) {
      numericValue = max;
    }

    onChange(numericValue);
  };

  return (
    <>
      {description && (
        <div className={classes.descriptionContainer}>
          <p>{description}</p>
        </div>
      )}
      <div className={classes.duarationMainConatiner}>
        <div className={classes.inputoutermain}>
        {lable !== undefined && <p>{lable}</p>}
          {/* <label className={classes.label}>Value</label> */}
          <div className={classes.Input}>
            <input
              type="number"
              onChange={(e) => handleInputChange(e.target.value)}
              value={Value}
              min={min}
              max={max !== undefined ? max : ""}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberInput;
