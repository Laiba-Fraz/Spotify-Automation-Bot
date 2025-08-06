import { useState, useRef, useEffect } from "react";
import classes from "./SignOutBtn.module.css";
import anonymous from "./../../assets/DP/anonymous.png";
import P1420600 from "../Paragraphs/P1420600";
import DropsownArrow from "../../assets/Icons/DropsownArrow";
import SignoutDrop from "./SignoutDrop";
import { useAuthContext } from "../Hooks/useAuthContext";

function SignOutBtn(props) {
  const { data } = useAuthContext();
  const [show, setShow] = useState(false);
  const buttonRef = useRef(null);

  const dropdownHandler = () => {
    setShow(!show);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const conatiner = document.getElementById("signupDropdown");
      const signoutBtn = document.getElementById("signOut");
      if (conatiner && !conatiner.contains(event.target) && signoutBtn && !signoutBtn.contains(event.target) ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.main}>
      <button
        id="signupDropdown"
        ref={buttonRef}
        className={`${classes.btnName} ${show ? classes.openbtnName : ""}`}
        onClick={dropdownHandler}
      >
        <div className={classes.UsernameContainer}>
          <img src={anonymous} alt={props.username} />
          <div className={classes.username}>
            <P1420600>{data.email? data.email:"null"}</P1420600>
            {/* <P1420600>Id: {data.user}</P1420600> */}
          </div>
        </div>
        <DropsownArrow />
      </button>
      {show && (
        <SignoutDrop
          // name={"Abdullah Noor"}
          // username={"AbdullahNoor_1"}
          // hideDropdownHandler={hideDropdownHandler}
        />
      )}
    </div>
  );
}

export default SignOutBtn;
