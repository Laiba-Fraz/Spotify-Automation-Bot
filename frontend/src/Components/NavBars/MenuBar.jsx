import { NavLink } from "react-router-dom";
import classes from "./MenuBar.module.css";
function MenuBar(props) {
  return (
    <div className={classes.menubar}>
      {props.navLinks.map((el) => {
        return (
          <div className={classes.linksContainer}>
            <NavLink
            to={el.route}
            end
            className={({ isActive }) =>
              isActive ? `${classes["active-link"]}` : ""
            }
            key={el.name}
          >
            {el.name}
          </NavLink>
          <div className={classes.bottomContainer}>
            <div className={classes.BlueBorder}></div>
          </div>
          </div>
        );
      })}
    </div>
  );
}

export default MenuBar;
