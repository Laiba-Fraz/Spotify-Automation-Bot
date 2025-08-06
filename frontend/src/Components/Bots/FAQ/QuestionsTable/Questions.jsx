import { Link } from "react-router-dom";
import classes from "./Questions.module.css";
import BlueTick from "../../../../assets/Icons/BlueTick";

function Questions(props) {
  return (
    <div className={classes.QuestionsMainContainer}>
      <div className={classes.Questionscontainerborders}></div>
      <ul className={classes.questionsList}>
        {props.isLoading ? (
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
        ) : props.list.length === 0 ? (
          <div className={classes.noQsContainer}>No questions available</div>
        ) : (
          props.list.map((el, index) => {
            return (
              <li className={classes.question} key={index}>
                <Link
                  to={""}
                  className={classes.questionLink}
                  onClick={() =>
                    props.showAndHideIssueHandler({
                      question: el.question,
                      answer: el.answer,
                    })
                  }
                >
                  <div className={classes.bluetickContainer}>
                    <BlueTick color={"#6f9dff"} />
                  </div>
                  <div className={classes.questionContainer}>
                    <h5>{el.question}</h5>
                    <p>{el.answer}</p>
                  </div>
                </Link>
              </li>
            );
          })
        )}
      </ul>
      <div className={classes.Questionscontainerborders2}></div>
    </div>
  );
}

export default Questions;
