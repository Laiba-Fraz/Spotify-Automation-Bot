import classes from "./BackLink.module.css";
import { Link } from "react-router-dom";
import LeftArrow from "../../../assets/Arrows/LeftArrow";

function BackLink(props) {
  return (
    <div className={classes.viewallbotsLinkContainer}>
      <Link to={props.to}>
        <LeftArrow className={classes.leftIcon} />
        <p className={classes.viewallbotsPara}>{props.linkName}</p>
      </Link>
    </div>
  );
}

export default BackLink;
