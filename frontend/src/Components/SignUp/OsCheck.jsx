import classes from "./OsCheck.module.css";
// import Check from "../../assets/Icons/Check";
import { CircleCheck } from "lucide-react";

function OsCheck(props) {
  return (
    <div className={classes.osCheck}>
      {props.children}
      <div className={classes.check}>
        <CircleCheck />
        <CircleCheck />
        <CircleCheck />
        <CircleCheck />
        <CircleCheck />
      </div>
    </div>
  );
}

export default OsCheck;
