import classes from "./Tr.module.css";
import Checkbox from "../Buttons/Checkbox";
import P14G from "../Paragraphs/P14G";
import Online from "../Animations/Online/Online";
import Offline from "../Animations/Offline/Offline";

function Tr({ bot, handler }) {
  const SelectedHandler = () => {
    handler();
  };
  return (
    <tr className={classes.tr}>
      <td>
        <Checkbox handler={SelectedHandler} />
      </td>
      <td>
        <P14G>{bot.device}</P14G>
      </td>
      <td>
        <P14G>{bot.model}</P14G>
      </td>
      <td>
        <P14G>{bot.uniqueIdentifier}</P14G>
      </td>
      {/* <td><P14G>{bot.accessStatus}</P14G></td> */}
      <td>
        <P14G>
          {bot.accessStatus === "Active" ? (
            <span className={classes.active}>Active</span>
          ) : (
            <span className={classes.inactive}>Inactive</span>
          )}
        </P14G>
      </td>
      <td>
        <P14G>{bot.activationDate}</P14G>
      </td>
    </tr>
  );
}

export default Tr;
