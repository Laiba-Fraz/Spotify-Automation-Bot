import classes from "./BotCard.module.css";
import { Link } from "react-router-dom";
import GreenBtn from "../Buttons/GreenBtn";
import { AddToPhoneOverlay } from "../context/AddToPhone";
import { useContext } from "react";

function BotCard(props) {
  const addToPhoneOverlay = useContext(AddToPhoneOverlay);
  const navigationHandler = (event) => {
    if (!props.development){
      return
    }
    event.stopPropagation();
    event.preventDefault();
    addToPhoneOverlay.showOverlay();
  };
  const name = props.name.trim().replace(/\s+/g, "-");

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num.toString();
    }
  }

  return (
    <Link to={props.link} className={props.development? classes.botCardMain:classes.botCardMainUnderDevelopment}>
      <div className={classes.botcardHeader}>
        <img src={props.image} alt="Booking Scraper" />
        <div className={classes.BotName}>
          <h2>{props.name}</h2>
          <p>{props.platform}</p>
        </div>
      </div>
      <div className={classes.botcardDescription}>
        <p>{props.desc}</p>
      </div>
      <div className={classes.botcardFooter}>
        <GreenBtn handler={navigationHandler}>Add to phone</GreenBtn>
        <p>{formatNumber(props.users)} phones</p>
      </div>
    </Link>
  );
}

export default BotCard;
