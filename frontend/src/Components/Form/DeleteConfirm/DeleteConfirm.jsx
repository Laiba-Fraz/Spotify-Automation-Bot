import classes from "./DeleteConfirm.module.css";
import H20 from "../../Headings/H20";
import GreyButton from "../../Buttons/GreyButton";
import RedButton from "../../Buttons/RedButton";
import { useEffect } from "react";

function DeleteConfirm(props) {
  function hideFormHandler() {
    props.hideFormHandler();
  }

  function deleteConfirmHandler() {
    props.deleteConfirmHandler();
  }
  useEffect(() => {
    const form = document.getElementById("deleteConfirm");
    function hideForm(event) {
      if (form && !form.contains(event.target)) {
        props.hideFormHandler();
      }
    }
    window.addEventListener("mousedown", hideForm);

    return () => {
      window.removeEventListener("mousedown", hideForm);
    };
  }, [props.formShowState]);
  return (
    <div className={classes.confirmationMain} id="deleteConfirm">
      <H20>{props.message}</H20>
      <div className={classes.ConfirmationBtnHandler}>
        <GreyButton handler={hideFormHandler}>Cancel</GreyButton>
        <RedButton handler={deleteConfirmHandler}>{props.btnMessage}</RedButton>
      </div>
    </div>
  );
}

export default DeleteConfirm;
