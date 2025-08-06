import classes from "./QATable.module.css";
import anonymousUser from "./../../../../assets/Images/anonymousUser.png";
import BlueTick from "../../../../assets/Icons/BlueTick";
import LeftArrow from "../../../../assets/Arrows/LeftArrow";
import { Link } from "react-router-dom";

function QATable(props) {
  return (
    <>
      <div className={classes.backLinkContainer}>
        <Link
          to={""}
          onClick={() => props.hideIssueHandler({ question: "", answer: [] })}
        >
          <LeftArrow />
          Back to Questions
        </Link>
      </div>
      <div className={classes.IssueMain}>
        <div className={classes.questionerProfileContainer}>
          <img src={anonymousUser} alt="Anonymous User" />
        </div>
        <div className={classes.queryContainer}>
          <div className={classes.questionContainer}>
            <div className={classes.BlueTick}>
              <BlueTick color={"#6f9dff"} />
            </div>
            <h5 className={classes.question}>{props.data.question}</h5>
          </div>
          <div className={classes.answerContainer}>
            <p>{props.data.answer}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default QATable;
