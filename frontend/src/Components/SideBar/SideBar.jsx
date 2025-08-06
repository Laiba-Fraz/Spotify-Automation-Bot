// import LogoName from "../LogoName/LogoName";
// import classes from "./SideBar.module.css";
// import SignOutBtn from "./SignOutBtn";
// import NavBar from "./NavBar";
// import ThemeSwitch from "./../Animations/ThemeSwitch/ThemeSwitch";
// import { NavLink } from "react-router-dom";
// import P1420600 from "../Paragraphs/P1420600";
// import { BookOpen, CircleHelp, MessageCircleQuestion } from "lucide-react";
// import BlueButton from "../Buttons/BlueButton";
// import CompleteOverlay from "../Overlay/CompleteOverlay";
// import { useEffect } from "react";
// import appilot from "./../../assets/logo/Appilot.png";

// function SideBar() {
//   useEffect(() => {}, []);
//   return (
//     <>
//       <nav className={classes.nav}>
//         <div className={classes.main}>
//           <div className={classes.LogoContainer}>
//             <LogoName />
//           </div>
//           <SignOutBtn />
//           <NavBar />
//         </div>
//         <div className={classes.bottomNavBarmain}>
//           <div className={classes.themeSwitchContainer}>
//             <div className={classes.navFooterLinkContainer}>
//               <NavLink
//                 to={"https://appilot.gitbook.io/appilot-docs"}
//                 className={({ isActive }) =>
//                   isActive
//                     ? `${classes.inactive} ${classes.active}`
//                     : `${classes.inactive}`
//                 }
//               >
//                 <BookOpen />
//                 <P1420600>Documentation</P1420600>
//               </NavLink>
//               <NavLink
//                 to={"https://appilot.app/help-and-support"}
//                 className={({ isActive }) =>
//                   isActive
//                     ? `${classes.inactive} ${classes.active}`
//                     : `${classes.inactive}`
//                 }
//               >
//                 <CircleHelp />
//                 <P1420600>Help & resources</P1420600>
//               </NavLink>
//               <NavLink
//                 to={"https://appilot.app/contact-us"}
//                 className={({ isActive }) =>
//                   isActive
//                     ? `${classes.inactive} ${classes.active}`
//                     : `${classes.inactive}`
//                 }
//               >
//                 <MessageCircleQuestion />
//                 <P1420600>Contact us</P1420600>
//               </NavLink>
//             </div>
//             {/* <div className={classes.upgradeBtnContainer}>
//             <BlueButton handler={upgrateHandler}>Upgrade</BlueButton>
//           </div> */}
//             {/* <div className={classes.switchContainer}>
//             <ThemeSwitch />
//           </div> */}
//           </div>
//         </div>
//       </nav>
//       <CompleteOverlay>
//         <div className={classes.loadingAnimationContainer}>
//           <div className={classes.loadingContentContainer}>
//             <img
//               src={appilot}
//               alt="Appilot"
//               className={classes.loaderlogoimg}
//             />
//             <div className={classes.textContainer}>
//               <span>Lets</span> <span>ride</span>
//             </div>
//           </div>
//         </div>
//       </CompleteOverlay>
//     </>
//   );
// }

// export default SideBar;

import { useEffect, useState } from "react";
import LogoName from "../LogoName/LogoName";
import classes from "./SideBar.module.css";
import SignOutBtn from "./SignOutBtn";
import NavBar from "./NavBar";
import ThemeSwitch from "./../Animations/ThemeSwitch/ThemeSwitch";
import { NavLink } from "react-router-dom";
import P1420600 from "../Paragraphs/P1420600";
import { BookOpen, CircleHelp, MessageCircleQuestion } from "lucide-react";
import BlueButton from "../Buttons/BlueButton";
import CompleteOverlay from "../Overlay/CompleteOverlay";
import appilot from "./../../assets/logo/Appilot.png";
// import appilot from "./../../assets/logo/logogitanimated.gif";


function SideBar() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <nav className={classes.nav}>
        <div className={classes.main}>
          <div className={classes.LogoContainer}>
            <LogoName />
          </div>
          <SignOutBtn />
          <NavBar />
        </div>
        <div className={classes.bottomNavBarmain}>
          <div className={classes.themeSwitchContainer}>
            <div className={classes.navFooterLinkContainer}>
              <NavLink
                to={"https://appilot.gitbook.io/appilot-docs"}
                target="_blank"
                className={({ isActive }) =>
                  isActive
                    ? `${classes.inactive} ${classes.active}`
                    : `${classes.inactive}`
                }
              >
                <BookOpen />
                <P1420600>Documentation</P1420600>
              </NavLink>
              <NavLink
                to={"https://appilot.app/help-and-support"}
                target="_blank"
                className={({ isActive }) =>
                  isActive
                    ? `${classes.inactive} ${classes.active}`
                    : `${classes.inactive}`
                }
              >
                <CircleHelp />
                <P1420600>Help & resources</P1420600>
              </NavLink>
              <NavLink
                to={"https://appilot.app/contact-us"}
                target="_blank"
                className={({ isActive }) =>
                  isActive
                    ? `${classes.inactive} ${classes.active}`
                    : `${classes.inactive}`
                }
              >
                <MessageCircleQuestion />
                <P1420600>Contact us</P1420600>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {loading && (
        <CompleteOverlay>
          <div className={classes.loadingAnimationContainer}>
            <div className={classes.loadingContentContainer}>
              {/* <img
                src={appilot}
                alt="Appilot"
                className={classes.loaderlogoimg}
              /> */}
              <img
                src={appilot}
                alt="Appilot"
                className={classes.loaderlogoimg}
              />
              <div className={classes.textContainer}>
                <span>Let’s</span>
                <span>fly!</span>
              </div>
            </div>
          </div>
        </CompleteOverlay>
      )}
    </>
  );
}

export default SideBar;
