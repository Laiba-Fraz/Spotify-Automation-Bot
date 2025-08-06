import { useContext } from "react";
import classes from "./ThemeSwitch.module.css";
import Theme from "../../context/ThemeContext";
function ThemeSwitch() {
  const themeCtx = useContext(Theme);

  function setThemeHandler() {
    themeCtx.toggleTheme();
  }

  return (
    <label className={`${classes.switch}`}>
      <input
        type="checkbox"
        onChange={setThemeHandler}
        checked={themeCtx.theme}
        aria-checked={themeCtx.theme}
        role="switch"
      />
      <span className={`${classes.slider} ${classes.round}`}></span>
    </label>
  );
}

export default ThemeSwitch;
