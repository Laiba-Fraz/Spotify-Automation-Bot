import H12 from "./../Headings/H12"
import classes from "./BotsTable.module.css";
import Checkbox from "../Buttons/Checkbox";
import Tr from "./Tr";

function BotsTable(props) {
  function allSelectedHandler() {}
  function specificSelectedHandler() {}

  return (
    <table className={classes.table}>
      <tr className={classes.headingrow}>
        <th className={classes.headingcheckbox}>
          <Checkbox handler={allSelectedHandler} />
        </th>
        <th className={classes.devicesheadingmain}>
          <H12>Devices</H12>
        </th>
        <th className={classes.modelheadingmain}>
          <H12>Model</H12>
        </th>
        <th className={classes.uniqueidheadingmain}>
          <H12>unique identifier</H12>
        </th>
        <th className={classes.statusheadingmain}>
          <H12>Access status</H12>
        </th>
        <th className={classes.dateheadingmain}>
          <H12>Activation date</H12>
        </th>
      </tr>
      {
        props.data.map((el)=>{
            return <Tr bot={el} handler={specificSelectedHandler}/>
        })
      }
    </table>
  );
}

export default BotsTable;
