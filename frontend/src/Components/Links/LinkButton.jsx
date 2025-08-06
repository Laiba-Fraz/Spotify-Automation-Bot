import Discord from "../../assets/Icons/Discord"
import classes from "./LinkButton.module.css"

function LinkButton(props) {
  return (
    <a href={props.link} target='_blank' className={classes.link}><Discord/>{props.text}</a>
  )
}

export default LinkButton