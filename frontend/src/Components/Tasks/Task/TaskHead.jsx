import classes from "./TaskHead.module.css";
import H24 from "../../Headings/H24";
import LinksTag from "../../Bots/LinksTag";
import P1420600 from "../../Paragraphs/P1420600";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Spotify from "../../../assets/Images/SocialImages/Spotify.png";
import GreenBtn from "../../Buttons/GreenBtn";
import { Play } from "lucide-react";
import GreyButton from "../../Buttons/GreyButton";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import useDeleteTask from "../../Hooks/useDeleteTask";
import CompleteOverlay from "../../Overlay/CompleteOverlay";
import EditName from "../../Form/EditName/EditName";
import useUpdateTask from "../../Hooks/useUpdateTask";
import { failToast, successToast } from "../../../Utils/utils";
import DeleteConfirm from "../../Form/DeleteConfirm/DeleteConfirm";

function TaskHead(props) {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [nameChangeForm, setNameChangeFor] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [lastModified, setLastModified] = useState("");
  const [deleteTask, deleteloading, setDeleteloading] = useDeleteTask();
  const [updateTask, loading] = useUpdateTask();
  const navigate = useNavigate();
  const showDropdown = () => {
    setShow((prevState) => !prevState);
  };
  const editNamehandler = () => {
    setNameChangeFor(true);
  };

  const hideEditNameFormHandler = () => {
    setNameChangeFor(false);
  };
  const hideDeleteConfirmFormHandler = () => {
    setDeleteForm(false);
  };
  const deleteTaskhandler = () => {
    setDeleteForm(true);
  };

  function timeAgo(timestampInSeconds) {
    const timestamp = timestampInSeconds * 1000;
    const now = Date.now();
    const secondsPast = (now - timestamp) / 1000 - 7200;

    if (secondsPast <= 0) {
      return "Just now";
    }

    if (secondsPast < 60) {
      // return `${Math.floor(secondsPast)} second${
      //   Math.floor(secondsPast) !== 1 ? "s" : ""
      // } ago`;
      return "Created Just now";
    }
    if (secondsPast < 3600) {
      return `Created ${Math.floor(secondsPast / 60)} minute${
        Math.floor(secondsPast / 60) !== 1 ? "s" : ""
      } ago`;
    }
    if (secondsPast < 86400) {
      return `Created ${Math.floor(secondsPast / 3600)} hour${
        Math.floor(secondsPast / 3600) !== 1 ? "s" : ""
      } ago`;
    }

    const daysPast = Math.floor(secondsPast / 86400);
    return daysPast === 1 ? "Created Yesterday" : `Created ${daysPast} days ago`;
  }

  useEffect(() => {
    if (props.task?.LastModifiedDate) {
      const timeString = timeAgo(props.task.LastModifiedDate);
      setLastModified(timeString);
    } else {
      setLastModified("Just now");
    }
  }, [props.task?.LastModifiedDate]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdown = document.getElementById("dropdownTaskHead");
      if (dropdown && !dropdown.contains(event.target)) {
        setShow(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [location]);
  const botName = props.bot.botName.trim().replace(/\s+/g, "-");

  async function nameChangeHandler(newName) {
    const toUpdate = {
      taskName: newName,
    };
    try {
      await updateTask(props.task.id, toUpdate);
      setNameChangeFor();
      await props.loadTask();
      successToast("Name Updated Successfully");
    } catch (error) {
      failToast("Could not update task name");
    }
  }

  async function deleteHnadler() {
    console.log("entered delete function");
    try {
      await deleteTask([props.task.id]);
      successToast("Deleted successfully");
      navigate("/tasks");
    } catch (error) {
      failToast("Could not delete task");
    }
  }

  return (
    <>
      <div className={classes.main}>
        <div className={classes.headingCont}>
          <H24>{props.task.taskName} (Task)</H24>
          <div className={classes.SubHeading}>
            <LinksTag>{props.bot.platform}</LinksTag>
            <div className={classes.taskForContainer}>
              <P1420600>Task for</P1420600>
              <Link to={`/store/${botName}`}>
                <img src={props.bot.imagePath} alt={props.bot.botName} />
                {props.bot.botName}
              </Link>
            </div>
            <div className={classes.taskForContainer}>
              <P1420600>{lastModified}</P1420600>
            </div>
          </div>
        </div>
        <div className={classes.btnsCont}>
          {/* <GreenBtn icon={<Play />} handler={startHandler}>
          start
        </GreenBtn> */}
          <GreyButton handler={showDropdown}>
            <Ellipsis />
          </GreyButton>

          {show && (
            <div className={classes.dropDown} id="dropdownTaskHead">
              <button onClick={editNamehandler}>
                <Pencil />
                Edit name
              </button>

              <button onClick={deleteTaskhandler}>
                <Trash2 />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {nameChangeForm && (
        <CompleteOverlay>
          <EditName
            closeHandler={hideEditNameFormHandler}
            nameChangeHandler={nameChangeHandler}
          />
        </CompleteOverlay>
      )}
      {deleteForm && (
        <CompleteOverlay>
          <DeleteConfirm
            message={`Are you sure you want to delete "${props.task.taskName}"?`}
            hideFormHandler={hideDeleteConfirmFormHandler}
            deleteConfirmHandler={deleteHnadler}
          />
        </CompleteOverlay>
      )}
    </>
  );
}

export default TaskHead;
