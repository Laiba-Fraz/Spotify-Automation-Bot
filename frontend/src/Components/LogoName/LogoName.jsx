import classes from "./LogoName.module.css";
import { Link } from "react-router-dom";
import Logo from "./../../assets/logo/Appilot.png";
function LogoName() {
  return (
    <header className={classes.link}>
      <Link to={"store"} className={classes.link}>
      <img src={Logo} alt="Appilot" />
      <span>Appilot</span>
      </Link>
    </header>
  );
}

export default LogoName;
