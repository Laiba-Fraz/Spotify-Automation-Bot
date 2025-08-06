import classes from "./Documentation.module.css";
import DemoCards from "../../Cards/DemoCards";
import TextRedPurpleEffect from "../../TextEffects/TextRedPurpleEffect";

function Documentation() {
  return (
    <div className={classes.docssmain}>
      <DemoCards  linkContent={"Gitbook"} link={"https://app.gitbook.com/o/HVkjEqcmnOr3d3q4oBAr/sites/site_Fjt9G"}>
        Please visit our <TextRedPurpleEffect link={"https://app.gitbook.com/o/HVkjEqcmnOr3d3q4oBAr/sites/site_Fjt9G"}>Gitbook</TextRedPurpleEffect>{" "}
        for technical documentaitons.
      </DemoCards>
    </div>
  );
}

export default Documentation;
