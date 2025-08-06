import React from "react";
import Classes from "./RadioOptions.module.css";

function RadioOptions(props) {
  const { options, initialValue, handler, description } = props;
  const [selectedValue, setSelectedValue] = React.useState(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (handler) {
      handler(newValue);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Description */}
      <div className={Classes.description}>
        <p>{description}</p>
      </div>

      {/* Options Container */}
      <div className={Classes.optionsContainer}>
        {options.map((option) => (
          <label key={option} className={Classes.labelWrapper}>
            <input
              type="radio"
              name="radio-group"
              value={option}
              checked={selectedValue === option}
              onChange={handleChange}
              className={Classes.randioButton}
            />
            <span className={Classes.optionText}>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioOptions;