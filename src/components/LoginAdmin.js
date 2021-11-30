import { Button, Card } from "react-bootstrap";
import styles from "../styles/Login.module.css";
import { useState, useReducer, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../context/auth-context";

function Login(props) {
  const ctx = useContext(AuthContext);
  const [errorContent, setErrorContent] = useState("");
  const [isFormValid, setFormValid] = useState(false);

  const emailStateReducer = (state, action) => {
    if (action?.type === "USER_INPUT") {
      return {
        val: action.val,
        isvalid: action.val.includes("@"),
        classes: action.val.includes("@")
          ? styles.control
          : styles.control + " " + styles.invalid,
      };
    }
    return { val: "", isvalid: false, classes: styles.control };
  };
  const passwordStateReducer = (state, action) => {
    if (action?.type === "USER_INPUT") {
      return {
        val: action.val,
        isvalid: action.val.trim().length > 6,
        classes:
          action.val.trim().length > 6
            ? styles.control
            : styles.control + " " + styles.invalid,
      };
    }
    return { val: "", isvalid: false, classes: styles.control };
  };
  const [emailState, dispatchEmail] = useReducer(emailStateReducer, {
    // Email State Reducer
    val: "",
    isvalid: null,
    classes: styles.control,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordStateReducer, {
    // Password State Reducer
    val: "",
    isvalid: null,
    classes: styles.control,
  });

  useEffect(() => {
    setFormValid(emailState.isvalid && passwordState.isvalid);
  }, [emailState, passwordState]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);                          // Whenever email is changing on every keystroke, we are setting the whole email state with its validlity by useReducer
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    setFormValid(event.target.value.includes("@") && passwordState.isvalid);
  };
  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    setFormValid(emailState.isvalid && event.target.value.trim().length > 6);
  };

  const formSubmitHandler = (event) => {
    const userDetails = {
      email: emailState.val,
      password: passwordState.val,
    };
    event.preventDefault();

    ctx.onLogIn(userDetails);
    dispatchEmail();
    dispatchPassword();
  };

  useEffect(() => {
    if (ctx.serverError) {
      console.log(ctx.serverError);
    }
  }, [ctx.serverError]);
  return (
    <Card className={styles.login}>
      <div className="mx-auto">
        <h2>Admin Login</h2>
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className={emailState.classes}>
          <label>Email</label>
          <input
            type="text"
            value={emailState.val}
            onChange={emailChangeHandler}
          ></input>
        </div>

        <div className={passwordState.classes}>
          <label>Password</label>
          <input
            type="password"
            value={passwordState.val}
            onChange={passwordChangeHandler}
          ></input>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.action}
            disabled={!isFormValid}
          >
            Log In
          </Button>
        </div>

        {errorContent}
      </form>
    </Card>
  );
}
export default Login;
