import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./Devices.module.css";
import HeaderHB from "../Header/HeaderHB/HeaderHB";
import P14G from "../Paragraphs/P14G";
import Tables from "../Tables/Tables";
import Checkbox from "../Buttons/Checkbox";
import { useAuthContext } from "../Hooks/useAuthContext";
import Spinner from "../../assets/Spinner/Spinner";
import debounce from "lodash.debounce";
import useDeleteDevice from "../Hooks/useDeleteDevice";
import Instagram from "../../assets/Images/SocialImages/instagram.png";
import Twitter from "../../assets/Images/SocialImages/X.png";
import Snapchat from "../../assets/Images/SocialImages/snapchat.png";
import Reddit from "../../assets/Images/SocialImages/reddit.png";
import Facebook from "../../assets/Images/SocialImages/facebook.png";
import Gmail from "../../assets/Images/SocialImages/gmail.png";
import Tiktok from "../../assets/Images/SocialImages/tiktok.png";
import Bumble from "../../assets/Images/SocialImages/bumble.png";
import Spotify from "../../assets/Images/SocialImages/Spotify.png";
import { failToast } from "../../Utils/utils";
import CompleteOverlay from "../Overlay/CompleteOverlay";
import EditName from "../Form/EditName/EditName";

const socialIncons = [
  { name: "instagram", component: Instagram },
  { name: "twitter", component: Twitter },
  { name: "snapchat", component: Snapchat },
  { name: "reddit", component: Reddit },
  { name: "facebook", component: Facebook },
  { name: "gmail", component: Gmail },
  { name: "tiktok", component: Tiktok },
  { name: "bumble", component: Bumble },
  { name: "spotify", component: Spotify },
];

function Devices(props) {
  const [selected, setSelected] = useState(
    props.taskSelected ? props.taskSelected : []
  );
  // const [selected, setSelected] = useState([]);
  const [deviceUpdateForm, setDeviceUpdateForm] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [ItemsLength, setItemsLength] = useState("All");
  const [pageNo, setpageNo] = useState(1);
  const [devices, setDevices] = useState([]);
  const [devicesToShow, setdevicesToShow] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const auth = useAuthContext();
  const [deleteDevice, deleteloading, setDeleteloading, UpdateDevice,updateDeviceStatus] =
    useDeleteDevice();
  const navigate = useNavigate();

  const searchActiveRef = useRef(false);

  useEffect(() => {
    if (props.setSelectedDevicesHandler) {
      props.setSelectedDevicesHandler(selected);
    }
  }, [selected]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim() !== "" && !searchActiveRef.current) {
        setItemsLength("All");
        searchActiveRef.current = true;
      } else if (value.trim() === "" && searchActiveRef.current) {
        setItemsLength(10);
        searchActiveRef.current = false;
      }
      const filteredDevices = devices.filter((device) =>
        device.deviceName.toLowerCase().includes(value.toLowerCase())
      );
      setdevicesToShow(filteredDevices);
    }, 300)
  );
  async function loadDevices(shouldhowLoading) {
    try {
      !shouldhowLoading && setLoading(true);
      setError(null);
      const value = `${document.cookie}`;
      const response = await fetch("https://server.appilot.app/devices", {
        // const response = await fetch("http://127.0.0.1:8000/devices", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: value !== "" ? value.split("access_token=")[1] : "",
        },
      });

      const res = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          console.log("401 error inside devices");
          failToast("please logIn again");
          auth.dispatch({ type: "logout" });
          localStorage.removeItem("auth");
          navigate("/log-in");
        }
        throw new Error(res.detail);
      }
      const parsedDevices = res.devices;
      setDevices(parsedDevices);
      !shouldhowLoading && setLoading(false);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const searchHandler = (value) => {
    debouncedSearch(value);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (ItemsLength === "All") {
      setdevicesToShow(devices);
      return;
    }

    // Ensure ItemsLength is a valid number
    if (typeof ItemsLength === "number" && !isNaN(ItemsLength)) {
      const startIdx = ItemsLength * (pageNo - 1);
      const endIdx = startIdx + ItemsLength;
      const newItems = devices.slice(startIdx, endIdx);
      setdevicesToShow(newItems);
    } else {
      // Handle unexpected ItemsLength values
      console.error(`Invalid ItemsLength: ${ItemsLength}`);
      setdevicesToShow([]);
    }
  }, [ItemsLength, pageNo, devices]);

  useEffect(() => {
    if (selected.length === devices.length) {
      setIsAllSelected(true);
    } else if (selected.length === 0) {
      setIsAllSelected(false);
    }
  }, [selected, devices.length]);

  const buttons = [
    {
      btnName: "Delete",
      confirmationMessage: "Are you sure you want to delete sectected Devices?",
      confirmBtnMessage: "Delete",
      type: "confirm",
      handler: Delete,
    },
    {
      btnName: "Edit",
      handler: EditHandler,
    },
    {
      btnName: "Refresh Status",
      handler: refreshStatus,
    },
  ];

  const addNewDeviceHandler = () => {
    navigate("new");
  };

  const allSelectedHandler = (check) => {
    if (check) {
      setSelected(devices.map((bot) => bot.deviceId));
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
    try {
      console.log(selected);
      await deleteDevice(selected);
      await loadDevices();
      setSelected([]);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function refreshStatus() {
    try {
      console.log(selected);
      await updateDeviceStatus(selected);
      await loadDevices();
      setSelected([]);
    } catch (error) {
      console.log(error.message);
    }
  }


  async function EditHandler() {
    setDeviceUpdateForm(true);
  }

  async function patchHandler(data) {
    const toUpdate = {
      // ...data
      deviceName: data,
    };
    try {
      console.log(selected);
      await UpdateDevice(selected, toUpdate);
      setDeviceUpdateForm(false);
      await loadDevices();
      setSelected([]);
    } catch (error) {
      setDeviceUpdateForm(false);
      console.log(error.message);
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
    const loadDdevicesInterval = setInterval(() => {
      loadDevices(true);
    }, 30000);
    return () => {
      clearInterval(loadDdevicesInterval);
    };
  }, []);

  const hideEditNameFormHandler = () => {
    setDeviceUpdateForm(false);
  };

  return (
    <>
      <section className={classes.devices}>
        <div className={`${classes.devicesMain} ${classes[props.classname]}`}>
          {!props.showheader && (
            <HeaderHB
              heading={"Devices Dashboard"}
              infoText={
                "Actors are serverless cloud programs ideal for web scraping and automation. They are easy to develop, share, and build upon. They can be started manually using our API or scheduler, and they can be easily integrated with other apps."
              }
              btnIcon={<Plus />}
              btnText={"Add new device"}
              btnClickHandler={addNewDeviceHandler}
            />
          )}
          <Tables
            type={"devices"}
            selected={selected}
            noOfBots={devices.length}
            searchHandler={searchHandler}
            cancelAllSelectedHandler={() => {
              allSelectedHandler(false);
            }}
            buttons={buttons}
            // deleteHandler={Delete}
            searchbarPlaceHolder={"Search by device name"}
            noOfItemInTable={ItemsLength}
            chageNoofPgaes={chageNoofPgaes}
            nextHandler={nextHandler}
            prevHandler={prevHandler}
            currentPage={pageNo}
            nextBtn={
              ItemsLength === "All"
                ? false
                : ItemsLength * pageNo < devices.length
            }
            prevBtn={pageNo > 1}
          >
            <thead>
              <tr className={classes.headingrow}>
                <th className={classes.headingcheckbox}>
                  <Checkbox
                    handler={(check) => allSelectedHandler(check)}
                    isChecked={devices.length === 0 ? false : isAllSelected}
                  />
                </th>
                <th className={classes.devicesheadingmain}>Devices</th>
                <th className={classes.botnameheadingmain}>Bots</th>
                <th className={classes.modelheadingmain}>Model</th>
                <th className={classes.statusheadingmain}>Access Status</th>
                <th className={classes.dateheadingmain}>Activation Date</th>
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
              ) : devices.length === 0 ? (
                <tr className={classes.errorContainer}>
                  <td colSpan="6">
                    <p>No devices</p>
                  </td>
                </tr>
              ) : (
                devicesToShow.map((device) => {
                  const dateObject = new Date(device.activationDate);
                  const options = {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  };
                  const date = dateObject.toLocaleDateString("en-US", options);
                  return (
                    <tr className={classes.tr} key={device.deviceId}>
                      <td>
                        <Checkbox
                          handler={(check) =>
                            oneSelectedHandler(check, device.deviceId)
                          }
                          isChecked={selected.includes(device.deviceId)}
                        />
                      </td>
                      <td>
                        <P14G>{device.deviceName}</P14G>
                      </td>
                      <td className={classes.botsRunningIcons}>
                        {device.botName.map((el) => {
                          const icon = socialIncons.find(
                            (iconObj) =>
                              iconObj.name.toLowerCase() === el.toLowerCase()
                          );
                          return icon ? (
                            <img
                              key={el}
                              src={icon.component}
                              alt={icon.name}
                            />
                          ) : null;
                        })}
                      </td>

                      <td>
                        <P14G>{device.model}</P14G>
                      </td>
                      <td>
                        <P14G>
                          <span
                            className={
                              device.status === true
                                ? classes.active
                                : classes.inactive
                            }
                          >
                            {device.status ? "active" : "inactive"}
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
      </section>
      {deviceUpdateForm && (
        <CompleteOverlay>
          <EditName
            closeHandler={hideEditNameFormHandler}
            nameChangeHandler={patchHandler}
          />
        </CompleteOverlay>
      )}
    </>
  );
}

export default Devices;
