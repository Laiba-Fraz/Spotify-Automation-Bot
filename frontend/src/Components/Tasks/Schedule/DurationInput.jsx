import classes from "./Schedule.module.css";

import React from "react";

const DurationInput = ({ initialValue = 0, onChange, description, InnerHeading }) => {
  const handleDurationChange = (value, type) => {
    let totalMinutes = initialValue;
    const currentHours = Math.floor(totalMinutes / 60);
    const currentMinutes = totalMinutes % 60;

    if (type === "hours") {
      const newHours = parseInt(value) || 0;
      if (newHours >= 0 && newHours <= 24) {
        totalMinutes =
          newHours === 24 ? 24 * 60 : newHours * 60 + currentMinutes;
      }
    } else if (type === "minutes") {
      const newMinutes = parseInt(value) || 0;
      if (newMinutes >= 0 && newMinutes <= 59) {
        totalMinutes =
          currentHours === 24 ? 24 * 60 : currentHours * 60 + newMinutes;
      }
    }

    onChange(totalMinutes);
  };

  return (
    <>
      {description && (
        <div className={classes.descriptionContainer}>
          <p>{description}</p>
        </div>
      )}
      <div className={classes.duarationMainConatiner}>
      {InnerHeading && (
        <div className={classes.descriptionContainer}>
          <p>{InnerHeading}</p>
        </div>
      )}
        <div className={classes.inputoutermain}>
          <label className={classes.label}>Hours</label>
          <div className={classes.Input}>
            <input
              type="number"
              placeholder="hh"
              onChange={(e) => handleDurationChange(e.target.value, "hours")}
              value={Math.floor(initialValue / 60)}
              min="0"
              max="24"
              required
            />
          </div>
        </div>
        <div className={classes.inputoutermain}>
          <label className={classes.label}>Minutes</label>
          <div className={classes.Input}>
            <input
              type="number"
              placeholder="mm"
              onChange={(e) => handleDurationChange(e.target.value, "minutes")}
              value={initialValue % 60}
              min="0"
              max="59"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DurationInput;
