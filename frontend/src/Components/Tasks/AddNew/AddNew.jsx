import React, { useState } from "react";
import classes from "./AddNew.module.css";

function AddNew() {
  const [time, setTime] = useState("00:00");

  const handleTimeChange = (e) => {
    const value = e.target.value;

    const formattedValue = value.replace(/[^0-9:]/g, "");

    if (formattedValue.length <= 5) {
      setTime(formattedValue);
    }
  };

  const handleBlur = () => {
    const timePattern = /^([0-1][0-9]|2[0-4]):([0-5][0-9]|60)$/;

    if (!timePattern.test(time)) {
      setTime("00:00");
    }
  };

  return (
    <div>
      <label htmlFor="time">Enter Time (HH:mm): </label>
      <input
        type="text"
        id="time"
        name="time"
        value={time}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        placeholder="HH:mm"
        maxLength="5"
        className={classes.timeInput}
      />
    </div>
  );
}

export default AddNew;
