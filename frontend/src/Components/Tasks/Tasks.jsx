import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./Tasks.module.css";
import HeaderHB from "../Header/HeaderHB/HeaderHB";
import P14G from "../Paragraphs/P14G";
import Tables from "../Tables/Tables";
import Checkbox from "../Buttons/Checkbox";
import { useAuthContext } from "../Hooks/useAuthContext";
import Spinner from "../../assets/Spinner/Spinner";
import debounce from "lodash.debounce";
import useDeleteTask from "../Hooks/useDeleteTask";
import Overlay from "../Overlay/Overlay";
import Loading from "../Alerts/Loading";
import { failToast, successToast } from "../../Utils/utils";
import useStopTask from "../Hooks/useStopTask";
import useClearOldTasks from "../Hooks/useClearOldTasks";

function Tasks(props) {
  const [selected, setSelected] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [ItemsLength, setItemsLength] = useState("All");
  const [pageNo, setpageNo] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [tasksToShow, setTasksToShow] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const auth = useAuthContext();
  const [deleteTask, deleteloading, setDeleteloading] = useDeleteTask();
  const [stopTask, Stoploading,, unschedueOldJobs, unscheduleLoading] = useStopTask();
  const [clearOldTasks, clearOldTasksloading] = useClearOldTasks();
  const navigate = useNavigate();

  const searchActiveRef = useRef(false);

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim() !== "" && !searchActiveRef.current) {
        setItemsLength("All");
        searchActiveRef.current = true;
      } else if (value.trim() === "" && searchActiveRef.current) {
        setItemsLength(10);
        searchActiveRef.current = false;
      }
      const filteredTasks = tasks.filter((task) =>
        task.taskName.toLowerCase().includes(value.toLowerCase())
      );
      setTasksToShow(filteredTasks);
    }, 300)
  );
  async function loadTasks(props = null, shouldShowLoadingAnimation) {
    try {
      !shouldShowLoadingAnimation && setLoading(true);
      setError(null);
      const value = `${document.cookie}`;
      // let URL = "http://127.0.0.1:8000/get-all-task";
      let URL = "https://server.appilot.app/get-all-task";
      if (props && props.URL) {
        URL = props.URL;
      }
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
      });

      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("401 error inside tasks");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.detail);
      }
      const parsedTasks = res.tasks;
      setTasks(parsedTasks);
      // setSelected([]);
      console.log(res.tasks);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      // setLoading(false);
    } finally {
      !shouldShowLoadingAnimation && setLoading(false);
    }
  }
  useEffect(() => {
    loadTasks(props);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const searchHandler = (value) => {
    debouncedSearch(value);
  };

  useEffect(() => {
    if (ItemsLength === "All") {
      setTasksToShow(tasks);
      return;
    }

    // Ensure ItemsLength is a valid number
    if (typeof ItemsLength === "number" && !isNaN(ItemsLength)) {
      const startIdx = ItemsLength * (pageNo - 1);
      const endIdx = startIdx + ItemsLength;
      const newItems = tasks.slice(startIdx, endIdx);
      setTasksToShow(newItems);
    } else {
      // Handle unexpected ItemsLength values
      console.error(`Invalid ItemsLength: ${ItemsLength}`);
      setTasksToShow([]);
    }
  }, [ItemsLength, pageNo, tasks]);

  useEffect(() => {
    if (selected.length === tasks.length) {
      setIsAllSelected(true);
    } else if (selected.length === 0) {
      setIsAllSelected(false);
    }
  }, [selected, tasks.length]);
  // ----------------------
  const buttons = [
    {
      btnName: "Delete",
      confirmationMessage: "Are you sure you want to delete sectected Tasks?",
      confirmBtnMessage: "Delete",
      type: "confirm",
      handler: Delete,
    },
    {
      btnName: "Stop",
      confirmationMessage: "Are you sure you want to Stop sectected Tasks?",
      confirmBtnMessage: "Stop",
      type: "confirm",
      handler: StopTasks,
    },
    {
      btnName: "clear old jobs",
      confirmationMessage: "Are you sure you want to clear tasks old jobs?",
      confirmBtnMessage: "Clear",
      type: "confirm",
      handler: ClearOldJobs,
    },
    {
      btnName: "un-schedule",
      confirmationMessage: "Are you sure you want to unschedule tasks?",
      confirmBtnMessage: "un-schedule",
      type: "confirm",
      handler: unscheduleTaks,
    }
  ];
  // ----------------------
  const navigateStoreHandler = () => {
    navigate("/tasks/add-new");
  };

  const allSelectedHandler = (check) => {
    if (check) {
      setSelected(tasks.map((task) => task.id));
    } else {
      setSelected([]);
    }
    setIsAllSelected(check);
  };

  const oneSelectedHandler = (check, id) => {
    if (check) {
      setSelected((prevSelected) => [...prevSelected, id]);
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== id)
      );
      setIsAllSelected(false);
    }
  };

  async function Delete() {
    console.log(selected);

    try {
      await deleteTask(selected);
      await loadTasks(props);
      setSelected([]);
      successToast("Deleted Successfully");
    } catch (error) {
      // toast("Could not delete, Please try again", {
      //   style: {
      //     color: "#ef6045",
      //     backgroundColor: "#40191b",
      //     border: "1px solid #aa3229",
      //     display: "flex",
      //     gap: "16px",
      //   },
      //   duration: 3000,
      //   icon: <TriangleAlert />,
      // });
      // failToast("Could not delete, Please try again");
      console.log(error.message);
    }
  }

  async function StopTasks() {
    if (selected.length <= 0) {
      failToast("Please Select running Tasks!");
      return;
    }
    try {
      const hasNonRunningTask = selected.some((taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        return task && task.status !== "running";
      });

      if (hasNonRunningTask) {
        failToast("Please Select only running Tasks!");
        return;
      }
      await stopTask(selected);
      successToast("Stopped Tasks Successfully");
      loadTasks();
      setSelected([]);
    } catch (error) {
      console.error("Error stopping tasks:", error.message);
    }
  }

  async function unscheduleTaks() {
    if (selected.length <= 0) {
      failToast("Please Select scheduled or running Tasks!");
      return;
    }
    try {
      const hasAwaitingTask = selected.some((taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        return task && task.status == "awaiting";
      });

      if (hasAwaitingTask) {
        failToast("Please Select only running or scheduled Tasks!");
        return;
      }
      await unschedueOldJobs(selected);
      successToast("Stopped Tasks Successfully");
      loadTasks();
      setSelected([]);
    } catch (error) {
      console.error("Error stopping tasks:", error.message);
    }
  }

  async function ClearOldJobs() {
    if (selected.length <= 0) {
      failToast("Please Select running Tasks!");
      return;
    }
    try {
      // const hasNonRunningTask = selected.some((taskId) => {
      //     const task = tasks.find(t => t.id === taskId);
      //     return task && task.status !== "running";
      // });

      // if (hasNonRunningTask) {
      //     failToast("Please Select only running Tasks!");
      //     return;
      // }
      await clearOldTasks(selected);
      successToast("Cleared old Jobs Successfully");
      loadTasks();
      setSelected([]);
    } catch (error) {
      console.error("Error stopping tasks:", error.message);
    }
  }

  function chageNoofPgaes(noOfItems) {
    setpageNo(1);
    if (noOfItems === "All") {
      setItemsLength("All");
      return;
    }
    const parsed = parseInt(noOfItems, 10);
    setItemsLength(parsed);
  }

  function nextHandler() {
    setpageNo((prevState) => prevState + 1);
  }

  function prevHandler() {
    setpageNo((prevState) => prevState - 1);
  }

  useEffect(() => {
    const loadTasksInterval = setInterval(() => {
      loadTasks(props, true);
    }, 30000);
    return () => {
      clearInterval(loadTasksInterval);
    };
  }, []);

  return (
    <section className={classes.tasks}>
      <div className={classes.main}>
        <HeaderHB
          heading={"Tasks"}
          infoText={
            "Tasks let you save an input configuration and run options for any Actor, so that you can easily reuse it later."
          }
          btnIcon={<Plus />}
          btnText={"Add a new task"}
          btnClickHandler={navigateStoreHandler}
        />
        <Tables
          type={"tasks"}
          selected={selected}
          noOfBots={tasks.length}
          searchHandler={searchHandler}
          cancelAllSelectedHandler={() => {
            allSelectedHandler(false);
          }}
          buttons={buttons}
          // deleteHandler={Delete}
          searchbarPlaceHolder={"Search by task name"}
          noOfItemInTable={ItemsLength}
          chageNoofPgaes={chageNoofPgaes}
          nextHandler={nextHandler}
          prevHandler={prevHandler}
          currentPage={pageNo}
          nextBtn={
            ItemsLength === "All" ? false : ItemsLength * pageNo < tasks.length
          }
          prevBtn={pageNo > 1}
        >
          <thead>
            <tr className={classes.headingrow}>
              <th className={classes.headingcheckbox}>
                <Checkbox
                  handler={(check) => allSelectedHandler(check)}
                  isChecked={tasks.length === 0 ? false : isAllSelected}
                />
              </th>
              <th className={classes.TaskName}>Name</th>
              <th className={classes.botName}>Bot Name</th>
              <th className={classes.platform}>Social Platform</th>
              <th className={classes.Status}>Status</th>
              <th className={classes.DateCreated}>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={classes.errorContainer}>
                <td colSpan="6">
                  <p>
                    <Spinner />
                    loading...
                  </p>
                </td>
              </tr>
            ) : error ? (
              <tr className={classes.errorContainer}>
                <td colSpan="6">
                  <p>Error: {error}</p>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr className={classes.errorContainer}>
                <td colSpan="6">
                  <p>No Tasks</p>
                </td>
              </tr>
            ) : (
              tasksToShow.map((task) => {
                const dateObject = new Date(task.activationDate);
                const options = {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                };
                const date = dateObject.toLocaleDateString("en-US", options);
                const botPath = task.botDetails.botName
                  .trim()
                  .replace(/\s+/g, "-");
                const taskPath = task.taskName.trim().replace(/\s+/g, "-");
                return (
                  <tr className={classes.tr} key={task.id}>
                    <td>
                      <Checkbox
                        handler={(check) => oneSelectedHandler(check, task.id)}
                        isChecked={selected.includes(task.id)}
                      />
                    </td>
                    <td className={classes.taskNameContainer}>
                      <NavLink to={`/tasks/${task.id}`}>
                        <P14G>{task.taskName}</P14G>
                        <P14G>
                          {botPath}/{taskPath}
                        </P14G>
                      </NavLink>
                    </td>
                    <td className={classes.BotNameContainer}>
                      <img
                        src={task.botDetails.imagePath}
                        alt={`${task.botDetails.botName}`}
                      />
                      <NavLink to={`/store/${botPath}`}>
                        <P14G>{task.botDetails.botName}</P14G>
                        <P14G>{task.botDetails.platform}</P14G>
                      </NavLink>
                    </td>
                    <td>
                      {/* <P14G>{task.botDetails.platform}</P14G> */}
                      <img
                        className={classes.platformIcons}
                        src={task.botDetails.imagePath}
                        alt={task.botDetails.platform}
                      />
                    </td>
                    <td>
                      <P14G>
                        <span
                          className={
                            task.status === "awaiting"
                              ? classes.inactive
                              : task.status === "running"
                              ? classes.active
                              : classes.scheduled
                          }
                        >
                          {task.status}
                        </span>
                      </P14G>
                    </td>
                    <td>
                      <P14G>{date}</P14G>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Tables>
      </div>
      {deleteloading && (
        <Overlay>
          <Loading>Deleting Tasks</Loading>
        </Overlay>
      )}
      {clearOldTasksloading && (
        <Overlay>
          <Loading>Clearing Jobs</Loading>
        </Overlay>
      )}
      {Stoploading && (
        <Overlay>
          <Loading>Stopping Tasks</Loading>
        </Overlay>
      )}
      {unscheduleLoading && (
        <Overlay>
          <Loading>Unscheduling Taks</Loading>
        </Overlay>
      )}
    </section>
  );
}

export default Tasks;
