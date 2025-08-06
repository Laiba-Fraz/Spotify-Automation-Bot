import classes from "./RedButton.module.css";

function RedButton(props) {
    const btnClickHandler = () => {
        if (props.handler) {
          props.handler();
        }
        return;
      };
      return (
        <button className={classes.RedBtn} onClick={btnClickHandler}>
      {props.icon ? props.icon : ""}
      {props.children}
    </button>
      );
}

export default RedButton