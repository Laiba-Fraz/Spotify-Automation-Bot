import { useState, useEffect } from "react";
import classes from "./ChooseDevice.module.css";
import GreyButton from "../../../Buttons/GreyButton";
import Devices from "../../../Devices/Devices";
import { failToast, successToast } from "../../../../Utils/utils";

function ChooseDevice(props) {
  const [selectedDevices, setSelectedDevices] = useState(
    props.selected ? props.selected : []
  );

  function setSelectedDevicesHandler(newDevices) {
    setSelectedDevices(newDevices);
  }
  useEffect(() => {
    console.log(selectedDevices);
    props.chooseDeviceHandler(selectedDevices);
  }, [selectedDevices]);

  async function NextHandler() {
    if (selectedDevices.length === 0) {
      failToast("please select device");
      return;
    }
    successToast("Devices saved");
    props.nextHandler("Schedule");
  }
  return (
    <>
      <Devices
        showheader={true}
        classname={"mainNoPadding"}
        setSelectedDevicesHandler={setSelectedDevicesHandler}
        taskSelected={selectedDevices}
      />
      <div className={classes.main}>
        <GreyButton handler={NextHandler}>next</GreyButton>
      </div>
    </>
  );
}

export default ChooseDevice;
