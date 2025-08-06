// import { Form } from "react-router-dom";
// import BlueButton from "../Buttons/BlueButton";
// import Input from "../Inputs/Input";
// import classes from "./SignUpForm.module.css";

// function SignUpForm() {
//   return (
//     <Form method="post" className={classes.form}>
//       <label for="Username">Discord Username</label>
//       <Input type={"text"} placeholder={"Username"} name={"Username"} />
//       <label for="email">Email</label>
//       <Input type={"email"} placeholder={"Email"} name={"email"} />
//       <label for="password">Password</label>
//       <Input type={"password"} placeholder={"Password"} name={"password"} />
//       <BlueButton type={"submitt"}>Sign up</BlueButton>
//     </Form>
//   );
// }

// export default SignUpForm;

import { Form } from "react-router-dom";
import classes from "./SignUpForm.module.css";

function MyForm(props) {
  return (
    <Form method={props.method} className={classes.form}>
      {props.children}
    </Form>
  );
}

export default MyForm;
