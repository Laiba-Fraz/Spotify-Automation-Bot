import classes from "./MenubarWithoutNavLinks.module.css";

function MenubarWithoutNavLinks(props) {
  return (
    <div className={classes.menubar}>
      {props.components.map((el) => {
        return (
          <div className={classes.linksContainer} key={el}>
            <button
              onClick={() => props.handler(el)}
              className={props.state === el ? `${classes["active-link"]}` : ""}
            >
              {el}
            </button>
            <div className={classes.bottomContainer}>
              <div className={classes.BlueBorder}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MenubarWithoutNavLinks;
