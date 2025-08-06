import classes from "./H12.module.css"

function H12(props) {
  return (
    <h3 className={classes.heading}>{props.children}</h3>
  )
}

export default H12