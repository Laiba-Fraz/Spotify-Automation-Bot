import classes from "./Demos.module.css";
import DemoCards from "./../../Cards/DemoCards";
import TextRedPurpleEffect from "../../TextEffects/TextRedPurpleEffect";

function Demos() {
  return (
    <div className={classes.demosmain}>
      <DemoCards  linkContent={"Youtube playlist"} link={""}>
        Please visit our{" "}
        <TextRedPurpleEffect link={"https://www.youtube.com/"}>
          Youtube Playlist
        </TextRedPurpleEffect>{" "}
        for technical demo of this bot.
      </DemoCards>
    </div>
  );
}

export default Demos;
