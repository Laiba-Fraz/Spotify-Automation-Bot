import { useContext, useEffect } from "react";
import classes from "./AddToPhoneStep.module.css";
import P16 from "../Paragraphs/P16";
import Cut from "../../assets/Icons/Cut";
import { AddToPhoneOverlay } from "../context/AddToPhone";
import H20 from "../Headings/H20";
import TextBluePurpleEffect from "../TextEffects/TextBluePurpleEffect";
import { Link } from "react-router-dom";
import Appilot from "./../../assets/logo/Logo.png";
import ImageCarousel from "./ImageCarousal"

function AddToPhoneStep(props) {
  const addToPhoneContext = useContext(AddToPhoneOverlay);
  useEffect(() => {
    const overlay = document.getElementById("AddToPhoneOverlay");
    function hideOverlay(event) {
      if (overlay && !overlay.contains(event.target)) {
        addToPhoneContext.hideOverlay();
      }
    }
    window.addEventListener("mousedown", hideOverlay);

    return () => {
      window.removeEventListener("mousedown", hideOverlay);
    };
  }, [props.showState]);

  const hideOverlayHandler = () => {
    addToPhoneContext.hideOverlay();
  };

  const step1Images = [
    {
      src: "/confirmAccessibility.jpg",
      alt: "Select Your Bot"
    },
    {
      src: "/AppilotAccessibility.jpg",
      alt: "Create Task"
    },
    {
      src: "/completeMobileSetUp.jpg",
      alt: "Give Task Name and other data"
    },
    {
      src: "/checkDeviceInList.png",
      alt: "Check Image in device table on dashboard"
    }
  ]
  return (
    <div className={classes.confirmationMain} id="AddToPhoneOverlay">
      <div className={classes.HeadingCntainer}>
        <Cut showHandler={hideOverlayHandler} />
      </div>
      <div className={classes.StepsMain}>
        <div className={classes.heading}>
          <H20>
            <TextBluePurpleEffect>2.</TextBluePurpleEffect>
            Download and Install APK on your Phone
          </H20>
        {/* <Link to={"https://github.com/BitBashOwn/appilot-APK/releases/download/v1.0.0/Appilot_2024.11.08_09-40.apk"} target="_blank">
           <img src={Appilot} alt="Schedule live Demo" /> Download APK
          </Link> */}
        </div>
        <div className={classes.content}>
          <div className={classes.descriptionContainer}>
            <div>
              <P16>
                1. Download the <strong>APK</strong> and send it to your{" "}
                <strong>Android/Emulator</strong> from here.
              </P16>
              <P16>
                2. <strong>Install the APK:</strong> Transfer and install it on
                your Android/Emulator.
              </P16>
              <P16>
                3. <strong>Grant Permissions:</strong> Allow Restricted settings
                + necessary permissions for functionality.
              </P16>
              <P16>
                4. <strong>Verify Your Device:</strong> Check the Devices tab on
                the Appilot Console(Link) to ensure your device is listed.
              </P16>
              <Link
                to={"https://cal.com/app-pilot-m8i8oo/30min"}
                target="_blank"
              >
                <img src={Appilot} alt="Schedule live Demo" /> Schedule live
                Demo
              </Link>
            </div>
          </div>
          <div className={classes.imgVideoContainer}>
            <ImageCarousel images={step1Images} />
            {/* <iframe
              src="https://www.youtube.com/embed/bNACk1_S_6w?enablejsapi=1&rel=0"
              frameborder="0"
              allow="fullscreen"
            >
              {"https://www.youtube.com/embed/bNACk1_S_6w?enablejsapi=1&rel=0"}
            </iframe> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToPhoneStep;
