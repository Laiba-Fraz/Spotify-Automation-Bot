import classes from "./Getstarted.module.css"
import SimplehHeader from "./../Header/SimplehHeader"
import H20 from "./../Headings/H20"
import { Link, useNavigate } from "react-router-dom"
import TextBluePurpleEffect from "./../TextEffects/TextBluePurpleEffect"
import P16 from "../Paragraphs/P16"
import Appilot from "./../../assets/logo/Logo.png"
import Whatsapp from "./../../assets/logo/whatsapp.png"
import Discord from "./../../assets/logo/discord.png"
import Telegram from "./../../assets/logo/telegram.png"
import BlueButton from "../Buttons/BlueButton"
import ImageCarousel from "./ImageCarousal"

function Getstarted() {
  const navigate = useNavigate()

  const navigationHandler = () => {
    navigate("/store")
  }

  const step1Images = [
    {
      src: "/login.png",
      alt: "Login and Signup Process"
    },
    {
      src: "/selectBot.png",
      alt: "select bot"
    },
    {
      src: "/downloadApk.png",
      alt: "Download the apk"
    },
  ]

  const step2Images = [
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

  const step3Images = [
    {
      src: "/selectbotForTask.png",
      alt: "Select Your Bot"
    },
    {
      src: "/createtask.png",
      alt: "Create Task"
    },
    {
      src: "/giveTaskData.png",
      alt: "Give Task Name and other data"
    }
  ]

  const step4Images = [
    {
      src: "/giveInputs.png",
      alt: "Give Inputs"
    },
    {
      src: "/selectDevice.png",
      alt: "Select Device"
    },
    {
      src: "/setTime.png",
      alt: "Set Schedule Time"
    },
    {
      src: "/SaveAndStart.png",
      alt: "Save And Start"
    }
  ]





  return (
    <section className={classes.Getstarted}>
      <SimplehHeader
        content={"Getting Started with Appilot"}
        subHeading={"Learn how to Register a device to Appilot Console"}
      />
      <div className={classes.StepsContainer}>
        <div className={classes.StepsMain}>
          <div className={classes.heading}>
            <H20>
              <TextBluePurpleEffect>Step 1:</TextBluePurpleEffect>
              Signup and Select Your Bot
            </H20>
          </div>
          <div className={classes.content}>
            <div className={classes.descriptionContainer}>
              <div>
                <P16>
                  1. Sign up and log in to the <strong>Appilot Console</strong> from here.
                </P16>
                <P16>
                  2. Go to the <strong>Appilot Store</strong>.
                </P16>
                <P16>
                  3. Select the desired <strong>Bot</strong> you want to use.
                </P16>
                <P16>
                  4. Click on <strong>"Add to Phone"</strong>.
                </P16>
                <P16>
                  5. Download the <strong>APK</strong> and Send it to Your <strong>Android/Emulator</strong>.
                </P16>
                <Link to={"https://cal.com/app-pilot-m8i8oo/30min"} target="_blank">
                  <img src={Appilot} alt="Schedule live Demo" /> Schedule live Demo
                </Link>
              </div>
            </div>
            <div className={classes.imgVideoContainer}>
              <ImageCarousel images={step1Images} />
            </div>
          </div>
        </div>

        {/* Rest of your steps remain the same */}
        <div className={classes.StepsMain}>
          <div className={classes.heading}>
            <H20>
              <TextBluePurpleEffect>Step 2:</TextBluePurpleEffect>
              Install APK on Your Phone
            </H20>
          </div>
          <div className={classes.content}>
            <div className={classes.descriptionContainer}>
              <div>
                <P16>
                  1. <strong>Install the APK:</strong> Transfer and install it on your Android/Emulator.
                </P16>
                <P16>
                  2. <strong>Grant Permissions:</strong> Allow Restricted settings + necessary permissions for
                  functionality.
                </P16>
                <P16>
                  3. <strong>Verify Your Device:</strong> Check the Devices tab on the Appilot Console(Link) to ensure
                  your device is listed.
                </P16>
                <Link to={""} className={classes.greenLink} target="_blank">
                  <img src={Whatsapp || "/placeholder.svg"} alt="" /> Get Instant Help
                </Link>
              </div>
            </div>
            <div className={classes.imgVideoContainer}>
              <ImageCarousel images={step2Images} />
            </div>
          </div>
        </div>

        

        <div className={classes.StepsMain}>
          <div className={classes.heading}>
            <H20>
              <TextBluePurpleEffect>Step 3:</TextBluePurpleEffect>
              Create Task
            </H20>
          </div>
          <div className={classes.content}>
            <div className={classes.descriptionContainer}>
              <div>
                <P16>
                  1. <strong>Select Your Bot:</strong> Choose Your desired Bot from the store and click.
                </P16>
                <P16>
                  2. <strong>Create Task:</strong> Name your task and provide server or channel IDs if you want to receive automation updates (optional). If you provide a server ID, make sure to add the bot to the server by clicking the "Appilot Bot" button. This will grant the bot the necessary permissions to interact with your server and provide updates.
                </P16>
                <Link to={""} className={classes.telegramLink} target="_blank">
                  <img src={Telegram || "/placeholder.svg"} alt="" /> Get Instant Help on Telegram
                </Link>
              </div>
            </div>
            <div className={classes.imgVideoContainer}>
              <ImageCarousel images={step3Images} />
            </div>
          </div>
        </div>

        <div className={classes.StepsMain}>
          <div className={classes.heading}>
            <H20>
              <TextBluePurpleEffect>Step 4:</TextBluePurpleEffect>
              Run Your Bot
            </H20>
          </div>
          <div className={classes.content}>
            <div className={classes.descriptionContainer}>
              <div>
                <P16>
                  1. <strong>Give inputs:</strong> Give input for different functions to run and press Next
                </P16>
                <P16>
                  2. <strong>Select the device:</strong> Please select the devices on which you want to run the bot
                </P16>
                <P16>
                  3. <strong>Schedule:</strong> Select Your desired Schedule to run the bot and Press Next
                </P16>
                <P16>
                  4. <strong>Save and Start:</strong> Verify Your configuration and Press Save and Start.
                </P16>
                <Link to={""} className={classes.purpleLink} target="_blank">
                  <img src={Discord || "/placeholder.svg"} alt="" /> Open a Discord Support Ticket
                </Link>
              </div>
              <BlueButton handler={navigationHandler}>Finish</BlueButton>
            </div>
            <div className={classes.imgVideoContainer}>
              <ImageCarousel images={step4Images} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Getstarted
