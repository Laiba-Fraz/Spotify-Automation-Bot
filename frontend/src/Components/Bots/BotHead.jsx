import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./BotHead.module.css";
import LinksTag from "./LinksTag";
import GreenBtn from "../Buttons/GreenBtn";
import GreyButton from "../Buttons/GreyButton";
import CompleteOverlay from "../Overlay/CompleteOverlay";
import CreateTask from "../Form/CreateTask/CreateTask";
import useCreateTask from "../Hooks/useCreateTask";
import Loading from "../Alerts/Loading";
import Overlay from "../Overlay/Overlay";
import { failToast, successToast } from "../../Utils/utils";
import { AddToPhoneOverlay } from "../context/AddToPhone";

function BotHead(props) {
  const [showTaskForm, setoverLayForm] = useState(false);
  // const [uniqueName, setuniqueName] = useState("");
  const [taskData, setTaskData] = useState({
    taskName: "",
    serverId: "",
    channelId: ""
  });
  const [loading, createTask] = useCreateTask();
  const navigate = useNavigate();
  const addToPhoneCtx = useContext(AddToPhoneOverlay);

  const showTask = () => {
    if (loading) return;
    setoverLayForm((prevState) => !prevState);
  };

  const formSubmittHandler = async (event) => {
    console.log(event);
    // const Task = event.target[0].value.trim();
    // if (Task === "") {
    //   return;
    // }
    if(taskData.taskName === ""){
      failToast("Please Enter Task Title");
      return;
    }
    try {
      setoverLayForm(false);
      const id = await createTask(taskData, props.id);
      successToast("Task created");
      navigate(`/tasks/${id}`);
    } catch (error) {
      console.log(error.message);
      // failToast(error.message);
    }
  };

  // const addTouniqueNameHandler = (val) => {
  //   setuniqueName(val);
  // };

  const addTouniqueNameHandler = (data) => {
    setTaskData(data);
  };

  function addToPhoneHandler() {
    addToPhoneCtx.showOverlay();
  }

  return (
    <div className={classes.botContentHeader}>
      <div className={classes.botNameandLogo}>
        <div className={classes.botlogo}>
          {props.imagePath === "" ? (
            <div className={classes.loading}>
              <div className={classes.content}></div>
              <div className={classes.loadingEffect}></div>
            </div>
          ) : (
            <img src={`${props.imagePath}`} alt={props.name} />
          )}
        </div>
        <div className={classes.botName}>
          <div className={classes.botnameandlinkcontainer}>
            {props.name === "" ? (
              <div className={`${classes.loading} ${classes.name}`}>
                <div className={classes.content}></div>
                <div className={classes.loadingEffect}></div>
              </div>
            ) : (
              <h1 className={classes.botname}>{props.name}</h1>
            )}
            <LinksTag link={props.platform}>{props.platform}</LinksTag>
          </div>
          <div className={classes.tryfreebuttonContainer1}>
            {props.name === "" ? (
              <>
                <div className={`${classes.loading}`}>
                  <div className={classes.content}></div>
                  <div className={classes.loadingEffect}></div>
                </div>
                <div className={`${classes.loading}`}>
                  <div className={classes.content}></div>
                  <div className={classes.loadingEffect}></div>
                </div>
              </>
            ) : (
              <>
                <GreenBtn
                  handler={
                    props.development
                      ? addToPhoneHandler
                      : () => {
                          return;
                        }
                  }
                >
                  {props.development ? "Add to phone" : "Underdevelopment"}
                </GreenBtn>

                <GreyButton
                  handler={
                    props.development
                      ? showTask
                      : () => {
                          return;
                        }
                  }
                >
                  {props.development ? "Create task" : "Underdevelopment"}
                </GreyButton>
              </>
            )}
          </div>
        </div>
      </div>
      {props.desc === "" ? (
        <div className={`${classes.loading} ${classes.decription}`}>
          <div className={classes.content}></div>
          <div className={classes.loadingEffect}></div>
        </div>
      ) : (
        <p className={classes.botHeaderDescription}>{props.desc}</p>
      )}
      <div className={classes.tryfreebuttonContainer2}>
        <GreenBtn content={"Add to phone"} />
      </div>
      {showTaskForm && (
        <CompleteOverlay>
          <CreateTask
            closeHandler={showTask}
            addTouniqueNameHandler={addTouniqueNameHandler}
            formSubmittHandler={formSubmittHandler}
            // uniqueName={uniqueName}
            taskData={taskData}
            showTaskForm={showTaskForm}
            botname={props.name}
          />
        </CompleteOverlay>
      )}
      {loading && (
        <Overlay>
          <Loading>Creating Task</Loading>
        </Overlay>
      )}
    </div>
  );
}

export default BotHead;
