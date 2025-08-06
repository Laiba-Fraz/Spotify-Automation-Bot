import { useState } from "react";
import classes from "./LinksTag.module.css";
import { Copy, Check } from "lucide-react";

function LinksTag(props) {
  const [showtick, setShowTick] = useState(false);

  const copyLinkHandler = () => {
    setShowTick(true);
    navigator.clipboard.writeText(props.childrenf);
    setTimeout(setShowTick, 1000, false);
  };
  return (
    <div className={classes.linkContainer}>
      <span className={classes.link}>{props.children}</span>
      {/* {showtick && <Check style={{ color: "#008a27" }} />}
      {!showtick && <Copy onClick={copyLinkHandler} />} */}
    </div>
  );
}

export default LinksTag;
