import classes from "./SignoutDrop.module.css";
import H18 from "./../Headings/H18";
import anonymous from "./../../assets/DP/anonymous.png";
import { Link, useNavigate } from "react-router-dom";
import P1420600 from "../Paragraphs/P1420600";
import Tick from "../../assets/Icons/Tick";
import Signout from "../../assets/Icons/Signout";
import { useAuthContext } from "../Hooks/useAuthContext";
function SignoutDrop(props) {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  function signOutHandler() {
    document.cookie = "access_token=; Max-Age=0; path=/;";
    dispatch({ type: "logout" });
    localStorage.removeItem("auth");
    navigate("/log-in");
  }

  return (
    <div className={classes.dropdown}>
      {/* <H18>Switch account</H18>
      <Link to={""} className={classes.usernameLink}>
        <div className={classes.contentContainer}>
          <img src={anonymous} alt={props.name} />
          <div className={classes.usernameConatainer}>
            <P1420600>{props.name}</P1420600>
            <P1420600>{props.username}</P1420600>
          </div>
        </div>
        <Tick />
      </Link> */}
      <button className={classes.signoutbtn} onClick={signOutHandler} id="signOut">
        <Signout />
        <P1420600>Sign out</P1420600>
      </button>
    </div>
  );
}

export default SignoutDrop;
