import classes from "./Feature.module.css";
import Tick from "../../assets/Icons/Tick";
import P14G from "../Paragraphs/P14G";

function Feature(props) {
  return (
    <div className={classes.Feature}>
      <Tick />
      <P14G>{props.feature}</P14G>
    </div>
  );
}

export default Feature;

// import classes from "./Feature.module.css";
// import Tick from "../../assets/Icons/Tick";
// import P14G from "../Paragraphs/P14G";

// function Feature(props) {
//   return (
//     <div className={classes.Feature}>
//       <div className={classes.IconContainer}>
//         <Tick />
//       </div>
//       <div className={classes.FeatureContent}>
//       <P14G>{props.feature}</P14G>
//       <P14G>{props.des}</P14G>
//       </div>
//     </div>
//   );
// }

// export default Feature;
