import React from "react";
import { useEffect, useState } from "react";
import { fb } from "../service/firebase";

const AuthContext = React.createContext({
  isLoggedIn: false,
  serverError: "",
  onLogIn: () => {},
  onLogOut: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    console.log(serverError);
  }, [serverError]);

  useEffect(() => {
    if (localStorage.getItem("LoggedIn") === "1") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logOutHandler = () => {
    localStorage.setItem("LoggedIn", "0");
    fb.auth.signOut();
  };
  const LogInHandler = (userDetails) => {
    console.log(userDetails.email);
    console.log(userDetails.password);
    fb.auth
      .signInWithEmailAndPassword(userDetails.email, userDetails.password)
      .then((res) => {
        if (res.user) {
          setIsLoggedIn(1);
          localStorage.setItem("LoggedIn", "1");
        }
        if (!res.user) {
          setServerError(
            "We're having trouble logging you in. Please try again."
          );
        }
      })
      .catch((err) => {
        setIsLoggedIn(0);
        localStorage.setItem("LoggedIn", "0");
        if (err.code === "auth/wrong-password") {
          setServerError("Invalid credentials");
        } else if (err.code === "auth/user-not-found") {
          setServerError("No account for this email");
        } else {
          setServerError("Something went wrong :(");
        }
      });
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogIn: LogInHandler,
        onLogOut: logOutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
