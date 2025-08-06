import classes from "./Header.module.css";
import LogoName from "../LogoName/LogoName";

function Header() {
  return (
    <header className={classes.header}>
      <LogoName />
    </header>
  );
}

export default Header;
