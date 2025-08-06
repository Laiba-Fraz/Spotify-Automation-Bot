import classes from "./CreateTask.module.css";
import { useEffect } from "react";
import H18 from "../../Headings/H18";
import Cut from "../../../assets/Icons/Cut";
import Input from "../../Inputs/Input";
import P1420600 from "../../Paragraphs/P1420600";
import TransparentButton from "../../Buttons/TransparentButton";
import BlueButton from "../../Buttons/BlueButton";
import { useParams } from "react-router-dom";
import InputText from "../../Inputs/InputText";
import LinkButton from "../../Links/LinkButton";

function CreateTask(props) {
  const { id } = useParams("id");
  const Close = () => {
    props.closeHandler();
  };

  // const addTouniqueNameHandler = (val) => {
  //   props.addTouniqueNameHandler(val);
  // };

  const addTouniqueNameHandler = (val) => {
    props.addTouniqueNameHandler({
      ...props.taskData,
      taskName: val,
    });
  };

  const addServerId = (val) => {
    props.addTouniqueNameHandler({
      ...props.taskData,
      serverId: val,
    });
  };

  const addChannelId = (val) => {
    props.addTouniqueNameHandler({
      ...props.taskData,
      channelId: val,
    });
  };

  const formSubmittHandler = (event) => {
    event.preventDefault();
    props.formSubmittHandler(event);
  };
  useEffect(() => {
    const form = document.getElementById("taskForm");
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
    <div className={classes.CreateTaskMain} id="taskForm">
      <div className={classes.head}>
        <H18>Create new task</H18>
        <Cut showHandler={Close} />
      </div>
      <form onSubmit={formSubmittHandler} className={classes.Form}>
        <Input
          type="text"
          placeholder={"Your task title"}
          name={"title"}
          label={"Title"}
          handler={addTouniqueNameHandler}
          value={props.taskData.taskName}
        />
        <InputText
          label={"Discord Server Id"}
          type={"text"}
          placeholder={"Your discord server id"}
          name={"serverId"}
          handler={addServerId}
          isTaskInputs={false}
        />
        <InputText
          label={"Discord Channel Id"}
          type={"text"}
          placeholder={"Your discord channel id"}
          name={"channelId"}
          handler={addChannelId}
          isTaskInputs={false}
        />
        <div><p className={classes.discordInviteContainer}>Add Appilot bot to your server by clicking the button: <LinkButton link={"https://discord.com/oauth2/authorize?client_id=1326626975284072550&permissions=274877917184&integration_type=0&scope=bot"} text={"Appilot Bot"}/></p></div>
        <div className={classes.uniquesName}>
          <P1420600>Unique name</P1420600>
          <P1420600>{`${id.replace(/\s+/g, "-")}/ ${
            props.taskData.taskName
          }`}</P1420600>
        </div>
        <div className={classes.footer}>
          <TransparentButton type={"button"} handler={Close}>
            Cancel
          </TransparentButton>
          <BlueButton type={"submitt"}>Continue</BlueButton>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
