
import classes from "./MyForm.module.css";

function MyForm(props) {
  return (
    <form
      method={props.method}
      className={classes.form}
      onSubmit={props.formSubmittHandler}
      autocomplete="off"
    >
      {props.children}
    </form>
  );
}

export default MyForm;
