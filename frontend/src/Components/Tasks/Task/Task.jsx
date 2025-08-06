import BackLink from "../../Animations/Links/BackLink";
import classes from "./Task.module.css";
import TaskHead from "./TaskHead";
import Input from "./Input/Input";
import ChooseDevice from "./ChooseDevice/ChooseDevice";
import Schedule from "../Schedule/Schedule";
import MenubarWithoutNavLinks from "../../NavBars/MenubarWithoutNavLinks/MenubarWithoutNavLinks";
import { useEffect, useState } from "react";
import Save from "./Save/Save";
import { TriangleAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useSaveTask from "../../Hooks/useSaveTask";
import useClearOldTasks from "../../Hooks/useClearOldTasks";
import { toast } from "sonner";
import { failToast, loadingToast, successToast, updateLoadingToast, schedulingInputsValidater} from "../../../Utils/utils";
import Overlay from "../../Overlay/Overlay";
import Loading from "../../Alerts/Loading";
import { useAuthContext } from "../../Hooks/useAuthContext";

function Task() {
  const [show, setShow] = useState("Input");
  const [localLoading, setLoading] = useState(null);
  const [loading, saveTask] = useSaveTask();
  const [] = useClearOldTasks();
  const [error, setError] = useState(null);
  const [task, settask] = useState({});
  const navLinks = ["Input", "Choose device", "Schedule", "Save"];
  const { id } = useParams("id");
  const [devices, SelectedDevice] = useState([]);
  const navigate = useNavigate();
  const auth = useAuthContext();
  
  async function loadTask() {


    setLoading(true);
    setError(null);
    const localLoadingId = loadingToast("Loading Task");
    try {
      const value = `${document.cookie}`;
      const response = await fetch(
        `https://server.appilot.app/get-task?id=${id}`,
          // `http://127.0.0.1:8000/get-task?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: value !== "" ? value.split("access_token=")[1] : "",
          },
        }
      );

      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("inside 401 of useDeleteTask");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        updateLoadingToast(localLoadingId);
        throw new Error("Cannot fetch task");
      }
      settask({ task: res.task, bot: res.bot });
      setLoading(false);
      console.log(res.task);
      updateLoadingToast(localLoadingId);
    } catch (error) {
      console.log(error.message);
      setError(true);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTask();
  }, []);

  function changeComponentHandler(val) {
    setShow(val);
  }
  function nextHandler(val) {
    setShow(val);
  }

  function validateInputs() {
    console.log("Entered validateInputs");
      const selectedSchedule = task.task.schedules.inputs.find((el) => el.selected);
      if (selectedSchedule) {
        return schedulingInputsValidater(selectedSchedule);
      }
    failToast("Please set correct Scheduling Inputs");
      return false; 
    }

  const saveHandler = async () => {
    console.log(task);
    if (devices.length === 0) {
      failToast("Please select device");
      setShow("Choose device");
      return;
    }
    if(!validateInputs()){
      setShow("Schedule");
      return;
    }
    console.log("devices and schedules validated");
    try {
      const result = await saveTask(task);
      if (result.success) {
        successToast(result.message);
        navigate(result.navigateTo);
      } else {
        if (result.navigateTo.startsWith("/")) {
          navigate(result.navigateTo);
        } else {
          nextHandler(result.navigateTo);
        }
      }
      
    } catch (error) {
      console.log("saveHandler");
      console.log(error.message);
    }
  };

  function setInputsHandler(inputs) {
    console.log("entered setInputsHandler")
    console.log("inputs:",inputs)
    settask((prevState) => ({
      ...prevState,
      task: {
        ...prevState.task,
        inputs: inputs,
      },
    }));
  }

  function setDevicesHandler(devicesArray) {
    settask((prevState) => ({
      ...prevState,
      task: {
        ...prevState.task,
        deviceIds: devicesArray,
      },
    }));
    SelectedDevice(devicesArray);
  }

  function setScheduleHandler(schedules) {
    console.log(schedules)
    settask((prevState) => ({
      ...prevState,
      task: {
        ...prevState.task,
        schedules: schedules,
      },
    }));
  }

  return (
    task.task && (
      <>
      <section className={classes.Task}>
        <div className={classes.main}>
          <BackLink to={"/tasks"} linkName={"All tasks"} />
          <TaskHead task={task.task} bot={task.bot} loadTask={loadTask} />
          <div className={classes.NavbarContainer}>
            <MenubarWithoutNavLinks
              components={navLinks}
              handler={changeComponentHandler}
              state={show}
            />
          </div>
          <div className={classes.menuComponentContainer}>
            {show === "Input" && (
              <Input
                nextHandler={nextHandler}
                setInputsHandler={setInputsHandler}
                taskId={id}
                inputs={task.task.inputs}
              />
            )}
            {show === "Choose device" && (
              <ChooseDevice
                nextHandler={nextHandler}
                taskId={id}
                chooseDeviceHandler={setDevicesHandler}
                selected={task.task.deviceIds}
              />
            )}
            {show === "Schedule" && (
              <Schedule
                nextHandler={nextHandler}
                setScheduleHandler={setScheduleHandler}
                taskId={id}
                schedules={task.task.schedules}
              />
            )}
            {show === "Save" && <Save saveHandler={saveHandler} task={task.task} devicesNavigator={nextHandler} disabled={!loading}/>}
          </div>
        </div>
      </section>
      </>
    )
  );
}

export default Task;
