import { useEffect } from "react";
import classes from "./UserinteractionTable.module.css";
import P16 from "../../Paragraphs/P16";
import Cut from "../../../assets/Icons/Cut";

function UserinteractionTable(props) {
  useEffect(() => {
    const form = document.getElementById("userInteractionTable");
    function hideForm(event) {
      if (form && !form.contains(event.target)) {
        props.hideFormHandler();
      }
    }
    window.addEventListener("mousedown", hideForm);

    return () => {
      window.removeEventListener("mousedown", hideForm);
    };
  }, [props.showState]);
  return (
    <div className={classes.confirmationMain} id="userInteractionTable">
      <div className={classes.HeadingCntainer}>
        <P16>User Interaction Speed Limits Table</P16>
        <Cut showHandler={props.hideFormHandler} />
      </div>
      <table className={classes.table}>
        <thead>
          <tr className={classes.headingrow}>
            <th className={classes.number}>#</th>
            <th className={classes.type}>User Type</th>
            <th className={classes.timeFrame}>Time Frame</th>
            <th className={classes.comments}>Comments</th>
            <th className={classes.votes}>Upvotes</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.tr}>
            <td>1</td>
            <td>Normal</td>
            <td>Per Minute</td>
            <td>1 every 12-30 minutes</td>
            <td>1 every 2-6 minutes</td>
          </tr>
          <tr className={classes.tr}>
            <td>2</td>
            <td>Normal</td>
            <td>Per Hour</td>
            <td>2-5 Comments</td>
            <td>10-25 upvotes</td>
          </tr>
          <tr className={classes.tr}>
            <td>3</td>
            <td>Normal</td>
            <td>Per Day (1-2 hrs)</td>
            <td>2-10 Comments</td>
            <td>20-50 upvotes</td>
          </tr>
          <tr className={classes.tr}>
            <td>4</td>
            <td>Extensive</td>
            <td>Per Minute</td>
            <td>1 every 6-12 minutes</td>
            <td>1 every 1-2 minutes</td>
          </tr>
          <tr className={classes.tr}>
            <td>5</td>
            <td>Extensive</td>
            <td>Per Hour</td>
            <td>5-10 Comments</td>
            <td>30-50 upvotes</td>
          </tr>
          <tr className={classes.tr}>
            <td>6</td>
            <td>Extensive</td>
            <td>Per Day (3-5+ hrs)</td>
            <td>15-50 Comments</td>
            <td>100-250 upvotes</td>
          </tr>
        </tbody>
      </table>
      <div className={classes.Tablefooter}></div>
    </div>
  );
}

export default UserinteractionTable;
