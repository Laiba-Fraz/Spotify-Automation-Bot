import classes from "./AskingCard.module.css";
import Docs from "./../../assets/Images/Docs.webp";
function AskingCard() {
  return (
    <div className={classes.askingCardMain}>
      <div className={classes.backEffect}></div>
      <div className={classes.askingCardContent}>
        <h4>Looking for a custom mobile automation bot?</h4>
        <p>
          Let us handle the development for you! We’ll create a bot for your
          chosen social media platform with your desired features within your
          specified timeline and budget.
        </p>
        <p>Join our discord server and open a ticket or email us direclty.</p>
        <div className={classes.btnContainer}>
          <a href="https://discord.gg/3CZ5muJdF2" target="_blank">Join discord</a>
        </div>
      </div>
      <img src={Docs} alt="Docs" />
    </div>
  );
}

export default AskingCard;
