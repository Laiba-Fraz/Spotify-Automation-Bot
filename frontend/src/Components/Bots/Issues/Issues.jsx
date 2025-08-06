import classes from "./Issues.module.css";
import DemoCards from "../../Cards/DemoCards";
import TextRedPurpleEffect from "../../TextEffects/TextRedPurpleEffect";

function Issues() {
  return (
    <div className={classes.Issuessmain}>
      <DemoCards linkContent={"Discord"} link={"https://discord.gg/3CZ5muJdF2"}>
        Please visit our{" "}
        <TextRedPurpleEffect link={"https://discord.gg/3CZ5muJdF2"}>
          Discord
        </TextRedPurpleEffect>{" "}
        and opening a ticket for any Help
      </DemoCards>
    </div>
  );
}

export default Issues;
