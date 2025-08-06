import classes from "./EditName.module.css";
import H18 from "../../Headings/H18";
import Cut from "../../../assets/Icons/Cut";
import Input from "../../Inputs/Input";
import P1420600 from "../../Paragraphs/P1420600";
import TransparentButton from "../../Buttons/TransparentButton";
import BlueButton from "../../Buttons/BlueButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { failToast } from "../../../Utils/utils";

function EditName(props) {
  const { id } = useParams("id");
  const Close = () => {
    props.closeHandler();
  };
  const formSubmittHandler = (event) => {
    event.preventDefault();
    const value = event.target[0].value.trim();
    if (value === "") {
      failToast("Please enter correct name");
      return;
    }
    props.nameChangeHandler(value);
  };
  useEffect(() => {
    const form = document.getElementById("edditNameForm");
    function hideForm(event) {
      if (form && !form.contains(event.target)) {
        props.closeHandler();
      }
    }
    window.addEventListener("mousedown", hideForm);

    return () => {
      window.removeEventListener("mousedown", hideForm);
    };
  }, [props.showTaskForm]);

  return (
    <div className={classes.CreateTaskMain} id="edditNameForm">
      <div className={classes.head}>
        <H18>Edit Name</H18>
        <Cut showHandler={Close} />
      </div>
      <form onSubmit={formSubmittHandler} className={classes.Form}>
        <Input
          type="text"
          placeholder={""}
          name={"Nmae"}
          label={"New Name"}
          value={""}
        />
        <div className={classes.footer}>
          <TransparentButton type={"button"} handler={Close}>
            Cancel
          </TransparentButton>
          <BlueButton type={"submitt"}>Confirm</BlueButton>
        </div>
      </form>
    </div>
  );
}

export default EditName;
