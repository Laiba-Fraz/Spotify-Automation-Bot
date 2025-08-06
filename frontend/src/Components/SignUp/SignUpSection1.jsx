import classes from "./SignUpSection1.module.css";
import H24 from "./../../Components/Headings/H24";
import P14G from "./../../Components/Paragraphs/P14G";
import Instagram from "../../assets/SocialIcons/Instagram.png";
import Twitter from "../../assets/SocialIcons/Twitter.png";
import Snapchat from "../../assets/SocialIcons/snapchat.png";
import Tiktok from "../../assets/SocialIcons/Tiktok.png";
import Feature from "./Feature";
import OsCheck from "./OsCheck";
import Android from "./../../assets/OsLogos/Android";
import Apple from "./../../assets/OsLogos/Apple";
import PLinks from "./../../Components/Paragraphs/PLinks";
import { Link } from "react-router-dom";

function SignUpSection1() {
  return (
    <div className={classes.SignUpSection1}>
      <div className={classes.mainContainer}>
        <div className={classes.headingFeatures}>
          <div className={classes.headings}>
            <H24>Simplify social media automation on your phone</H24>
            <P14G>
              {/* No ADB needed, Control with the app, not the wire. Anywhere,
              anytime. */}
              No ADB needed, Control via webapp, not the wire. Anywhere,
              anytime.
            </P14G>
          </div>
          <div className={classes.FeaturesContainer}>
            <Feature
              feature={"Control your phone remotely with a web dashboard"}
            />
            <Feature feature={"more than 40+ social media platforms bots"} />
            <Feature feature={"Post,comments,Intract,likes,many more"} />
            <Feature feature={"Support App clonning and multi accounts"} />
            <Feature feature={"Grow your followers effectively"} />
            <Feature feature={"Community support"} />
          </div>
        </div>
        <div className={classes.IconsContainer}>
          <P14G>
            Automating more than 800+ Phones and emulators from 100+ countries
          </P14G>
          <div className={classes.Icons}>
            <img src={Instagram} alt="Instagram" />
            <img src={Snapchat} alt="Snapchat" />
            <img src={Twitter} alt="Twitter" />
            <img src={Tiktok} alt="Tiktok" />
          </div>
          <div className={classes.opratingSystem}>
            <OsCheck>
              <div className={classes.os}>
                <Android />
                <span>android</span>
              </div>
            </OsCheck>
            <OsCheck>
              <div className={classes.os}>
                <Apple />
                <span>ios</span>
              </div>
            </OsCheck>
          </div>
        </div>
      </div>
      <div className={classes}>
        <PLinks>
          This site is protected by reCAPTCHA and the{" "}
          <Link to={"https://appilot.gitbook.io/appilot-docs/legal-information/privacy-policy"} target="_blank">
            Google Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to={"https://appilot.gitbook.io/appilot-docs/legal-information/terms-and-conditions"} target="_blank">
            Terms of Service
          </Link>{" "}
          apply.
        </PLinks>
      </div>
    </div>
  );
}

export default SignUpSection1;

// import classes from "./SignUpSection1.module.css";
// import H24 from "./../../Components/Headings/H24";
// import P14G from "./../../Components/Paragraphs/P14G";
// import Feature from "./Feature";

// function SignUpSection1() {
//   return (
//     <div className={classes.SignUpSection1}>
//       <div className={classes.mainContainer}>
//         <div className={classes.headings}>
//           <H24>Simplify social media automation on your phone</H24>
//           <P14G>
//             No ADB needed, Control with the app, not the wire. Anywhere,
//             anytime.
//           </P14G>
//         </div>
//         <div className={classes.FeaturesContainer}>
//           <Feature
//             feature={"Control your phone remotely with a web dashboard."}
//             des={
//               "No complex setup required. Start managing from any web dashboard immediately."
//             }
//           />
//           <Feature
//             feature={"The ultimate all-in-one social media bot."}
//             des={
//               "Effortlessly post, comment, interact, like, and much more with advanced automation tools."
//             }
//           />
//           <Feature
//             feature={"Post,comments,Intract,likes,many more."}
//             des={"Use App Cloner to manage multiple accounts seamlessly."}
//           />
//           <Feature
//             feature={"Support App cloner and multi accounts."}
//             des={
//               "Boost your online presence with smart automation designed to drive engagement."
//             }
//           />
//           <Feature feature={"Grow your followers effectively."} des={""} />
//           <Feature
//             feature={
//               "Community support."
//             }
//             des={"Get real-time help and collaborate with a vibrant community of experts and enthusiasts 24/7."}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUpSection1;
