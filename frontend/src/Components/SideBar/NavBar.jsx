import { NavLink, useLocation } from "react-router-dom";
import classes from "./NavBar.module.css";
import P1420600 from "../Paragraphs/P1420600";
import {
  ShoppingCart,
  Smartphone,
  ChevronsLeftRight,
  Play,
  CalendarCheck2,
  BadgePlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import Dropdown from "../../assets/Icons/Dropdown";

function NavBar() {
  const [showTasks, setShowTasks] = useState(false);
  const [TasksInActive, setTasksInActive] = useState(false);
  const [isAnyTaskActive, setIsAnyTaskActive] = useState(false);

  const location = useLocation();

  const showTasksDropDownHandler = () => {
    setShowTasks((prevState) => !prevState);
  };

  useEffect(() => {
    const tasksActiveLinks = ["/tasks"];
    const dropdownTaskLinks = [
      "/tasks/add-new",
      "/tasks/schedule",
      "/tasks/running",
    ];

    const isActive = tasksActiveLinks.some((link) =>
      location.pathname.startsWith(link)
    );
    const isDropdownActive = dropdownTaskLinks.some((link) =>
      location.pathname.includes(link)
    );
    setIsAnyTaskActive(isActive || isDropdownActive);
    setTasksInActive(isActive && !isDropdownActive);
  }, [location]);

  return (
    <div className={classes.NavBar}>
      <NavLink
        to={"/get-started"}
        className={({ isActive }) =>
          isActive
            ? `${classes.inactivegetstarted} ${classes.howToUse} ${classes.activegetstarted}`
            : `${classes.inactivegetstarted} ${classes.howToUse}`
        }
      >
        <P1420600>🚀 How to use</P1420600>
      </NavLink>
      <NavLink
        to={"/store"}
        className={({ isActive }) =>
          isActive
            ? `${classes.inactive} ${classes.active}`
            : `${classes.inactive}`
        }
      >
        <ShoppingCart />
        <P1420600>Store</P1420600>
      </NavLink>
      <NavLink
        to={"/devices"}
        className={({ isActive }) =>
          isActive
            ? `${classes.inactive} ${classes.active}`
            : `${classes.inactive}`
        }
      >
        <Smartphone />
        <P1420600>Devices</P1420600>
      </NavLink>

      <div
        className={`${classes.tasksdropdownCont} ${
          isAnyTaskActive ? classes.tasksactiveparent : ""
        }`}
      >
        <NavLink
          to={"/tasks"}
          className={`${classes.taskinactive} ${
            TasksInActive ? classes.taskactive : ""
          }`}
        >
          <div className={classes.tasksNamecontainer}>
            <ChevronsLeftRight />
            <P1420600>Tasks</P1420600>
          </div>
          <Dropdown direction={showTasks} handler={showTasksDropDownHandler} />
        </NavLink>

        {showTasks && (
          <div className={classes.taskslinks}>
            <NavLink
              to={"/tasks/add-new"}
              className={({ isActive }) =>
                isActive
                  ? `${classes.tasksinactive} ${classes.tasksactive}`
                  : `${classes.tasksinactive}`
              }
            >
              <BadgePlus />
              <P1420600>Add new</P1420600>
            </NavLink>
            <NavLink
              to={"/tasks/schedule"}
              // to={"/tasks"}
              className={({ isActive }) =>
                isActive
                  ? `${classes.tasksinactive} ${classes.tasksactive}`
                  : `${classes.tasksinactive}`
              }
            >
              <CalendarCheck2 />
              <P1420600>Schedule</P1420600>
            </NavLink>
            <NavLink
              to={"/tasks/running"}
              className={({ isActive }) =>
                isActive
                  ? `${classes.tasksinactive} ${classes.tasksactive}`
                  : `${classes.tasksinactive}`
              }
            >
              <Play />
              <P1420600>Running</P1420600>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
